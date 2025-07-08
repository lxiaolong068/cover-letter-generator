// Enhanced cache utilities for improved performance with multi-level caching
import React from 'react';
import Redis from 'ioredis';
import NodeCache from 'node-cache';
import { createLogger, format, transports } from 'winston';

// Logger for cache operations
const cacheLogger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

// Cache configuration interface
export interface CacheConfig {
  redis?: {
    host: string;
    port: number;
    password?: string;
    db?: number;
    keyPrefix?: string;
  };
  memory?: {
    stdTTL: number;
    checkperiod: number;
    maxKeys: number;
  };
  defaultTTL: {
    memory: number;
    redis: number;
    session: number;
    local: number;
  };
}

// Default cache configuration
const defaultCacheConfig: CacheConfig = {
  memory: {
    stdTTL: 300, // 5 minutes
    checkperiod: 120, // Check every 2 minutes
    maxKeys: 1000,
  },
  defaultTTL: {
    memory: 5 * 60 * 1000, // 5 minutes
    redis: 15 * 60 * 1000, // 15 minutes
    session: 30 * 60 * 1000, // 30 minutes
    local: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Enhanced in-memory cache with TTL and statistics
class MemoryCache<T> {
  private cache = new Map<string, { value: T; expiry: number; hits: number; lastAccess: number }>();
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    evictions: 0,
  };

  set(key: string, value: T, ttlMs: number = 5 * 60 * 1000): void {
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, {
      value,
      expiry,
      hits: 0,
      lastAccess: Date.now(),
    });
    this.stats.sets++;

    cacheLogger.debug('Memory cache SET', { key, ttlMs, size: this.cache.size });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      this.stats.misses++;
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.evictions++;
      return null;
    }

    // Update access statistics
    item.hits++;
    item.lastAccess = Date.now();
    this.stats.hits++;

    cacheLogger.debug('Memory cache HIT', { key, hits: item.hits });
    return item.value;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
      cacheLogger.debug('Memory cache DELETE', { key });
    }
    return deleted;
  }

  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.stats.deletes += size;
    cacheLogger.info('Memory cache CLEAR', { clearedItems: size });
  }

  size(): number {
    return this.cache.size;
  }

  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
    };
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    let evicted = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        evicted++;
      }
    }

    this.stats.evictions += evicted;
    if (evicted > 0) {
      cacheLogger.info('Memory cache cleanup', { evicted, remaining: this.cache.size });
    }
  }

  // Get most accessed items
  getHotKeys(limit: number = 10): Array<{ key: string; hits: number; lastAccess: number }> {
    return Array.from(this.cache.entries())
      .map(([key, item]) => ({ key, hits: item.hits, lastAccess: item.lastAccess }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, limit);
  }
}

// Redis cache implementation for distributed caching
class RedisCache {
  private redis: Redis | null = null;
  private fallbackCache = new MemoryCache<string>();
  private connected = false;

  constructor(config?: CacheConfig['redis']) {
    if (config && typeof window === 'undefined') {
      try {
        this.redis = new Redis({
          host: config.host,
          port: config.port,
          password: config.password,
          db: config.db || 0,
          keyPrefix: config.keyPrefix || 'cover-letter:',
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });

        this.redis.on('connect', () => {
          this.connected = true;
          cacheLogger.info('Redis cache connected');
        });

        this.redis.on('error', error => {
          this.connected = false;
          cacheLogger.error('Redis cache error', error);
        });

        this.redis.on('close', () => {
          this.connected = false;
          cacheLogger.warn('Redis cache connection closed');
        });
      } catch (error) {
        cacheLogger.error('Failed to initialize Redis cache', error);
      }
    }
  }

  async set(key: string, value: unknown, ttlMs: number = 15 * 60 * 1000): Promise<void> {
    const serialized = JSON.stringify({
      value,
      expiry: Date.now() + ttlMs,
      timestamp: Date.now(),
    });

    try {
      if (this.redis && this.connected) {
        await this.redis.setex(key, Math.ceil(ttlMs / 1000), serialized);
        cacheLogger.debug('Redis cache SET', { key, ttlMs });
        return;
      }
    } catch (error) {
      cacheLogger.error('Redis cache SET error', { key, error });
    }

    // Fallback to memory cache
    this.fallbackCache.set(key, serialized, ttlMs);
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    try {
      if (this.redis && this.connected) {
        const cached = await this.redis.get(key);
        if (cached) {
          const item = JSON.parse(cached);
          if (Date.now() <= item.expiry) {
            cacheLogger.debug('Redis cache HIT', { key });
            return item.value;
          } else {
            // Expired, delete it
            await this.redis.del(key);
          }
        }
      }
    } catch (error) {
      cacheLogger.error('Redis cache GET error', { key, error });
    }

    // Fallback to memory cache
    const fallbackValue = this.fallbackCache.get(key);
    if (fallbackValue) {
      try {
        const item = JSON.parse(fallbackValue);
        if (Date.now() <= item.expiry) {
          return item.value;
        }
      } catch {
        // Invalid JSON, delete it
        this.fallbackCache.delete(key);
      }
    }

    return null;
  }

  async delete(key: string): Promise<boolean> {
    let deleted = false;

    try {
      if (this.redis && this.connected) {
        const result = await this.redis.del(key);
        deleted = result > 0;
        cacheLogger.debug('Redis cache DELETE', { key, deleted });
      }
    } catch (error) {
      cacheLogger.error('Redis cache DELETE error', { key, error });
    }

    // Also delete from fallback
    const fallbackDeleted = this.fallbackCache.delete(key);
    return deleted || fallbackDeleted;
  }

  async clear(): Promise<void> {
    try {
      if (this.redis && this.connected) {
        await this.redis.flushdb();
        cacheLogger.info('Redis cache CLEAR');
      }
    } catch (error) {
      cacheLogger.error('Redis cache CLEAR error', error);
    }

    this.fallbackCache.clear();
  }

  async getStats() {
    const memoryStats = this.fallbackCache.getStats();
    let redisStats = {};

    try {
      if (this.redis && this.connected) {
        const info = await this.redis.info('memory');
        const keyspace = await this.redis.info('keyspace');
        redisStats = { info, keyspace, connected: this.connected };
      }
    } catch (error) {
      cacheLogger.error('Redis stats error', error);
    }

    return {
      redis: redisStats,
      memory: memoryStats,
      connected: this.connected,
    };
  }

  isConnected(): boolean {
    return this.connected;
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.disconnect();
    }
  }
}

// Session storage cache with fallback
class SessionCache {
  private fallbackCache = new MemoryCache<string>();

  set(key: string, value: unknown, ttlMs: number = 30 * 60 * 1000): void {
    const item = {
      value,
      expiry: Date.now() + ttlMs,
    };

    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem(key, JSON.stringify(item));
        return;
      }
    } catch {
      // Fall through to memory cache
    }

    // Fallback to memory cache
    this.fallbackCache.set(key, JSON.stringify(item), ttlMs);
  }

  get<T = unknown>(key: string): T | null {
    let itemStr: string | null = null;

    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        itemStr = sessionStorage.getItem(key);
      }
    } catch {
      // Fall through to memory cache
    }

    if (!itemStr) {
      itemStr = this.fallbackCache.get(key);
    }

    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        this.delete(key);
        return null;
      }
      return item.value;
    } catch {
      this.delete(key);
      return null;
    }
  }

  delete(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.removeItem(key);
      }
    } catch {
      // Ignore errors
    }
    this.fallbackCache.delete(key);
  }

  clear(): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.clear();
      }
    } catch {
      // Ignore errors
    }
    this.fallbackCache.clear();
  }

  getStats() {
    return this.fallbackCache.getStats();
  }
}

// Local storage cache with fallback
class LocalCache {
  private fallbackCache = new MemoryCache<string>();

  set(key: string, value: unknown, ttlMs: number = 24 * 60 * 60 * 1000): void {
    const item = {
      value,
      expiry: Date.now() + ttlMs,
    };

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, JSON.stringify(item));
        return;
      }
    } catch {
      // Fall through to memory cache
    }

    // Fallback to memory cache
    this.fallbackCache.set(key, JSON.stringify(item), ttlMs);
  }

  get<T = unknown>(key: string): T | null {
    let itemStr: string | null = null;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        itemStr = localStorage.getItem(key);
      }
    } catch {
      // Fall through to memory cache
    }

    if (!itemStr) {
      itemStr = this.fallbackCache.get(key);
    }

    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        this.delete(key);
        return null;
      }
      return item.value;
    } catch {
      this.delete(key);
      return null;
    }
  }

  delete(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch {
      // Ignore errors
    }
    this.fallbackCache.delete(key);
  }

  clear(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.clear();
      }
    } catch {
      // Ignore errors
    }
    this.fallbackCache.clear();
  }

  getStats() {
    return this.fallbackCache.getStats();
  }
}

// Multi-level cache service (L1: Memory, L2: Redis, L3: Database)
export class MultiLevelCacheService {
  private memoryCache: MemoryCache<any>;
  private redisCache: RedisCache;
  private config: CacheConfig;

  constructor(config: CacheConfig = defaultCacheConfig) {
    this.config = { ...defaultCacheConfig, ...config };
    this.memoryCache = new MemoryCache();
    this.redisCache = new RedisCache(config.redis);
  }

  async get<T>(key: string): Promise<T | null> {
    // L1: Check memory cache first (fastest)
    let value = this.memoryCache.get(key) as T | null;
    if (value !== null) {
      cacheLogger.debug('Multi-level cache L1 HIT', { key });
      return value;
    }

    // L2: Check Redis cache (medium speed)
    value = await this.redisCache.get<T>(key);
    if (value !== null) {
      // Store in L1 for faster future access
      this.memoryCache.set(key, value, this.config.defaultTTL.memory);
      cacheLogger.debug('Multi-level cache L2 HIT', { key });
      return value;
    }

    cacheLogger.debug('Multi-level cache MISS', { key });
    return null;
  }

  async set<T>(key: string, value: T, ttl?: { memory?: number; redis?: number }): Promise<void> {
    const memoryTTL = ttl?.memory || this.config.defaultTTL.memory;
    const redisTTL = ttl?.redis || this.config.defaultTTL.redis;

    // Set in both L1 and L2
    this.memoryCache.set(key, value, memoryTTL);
    await this.redisCache.set(key, value, redisTTL);

    cacheLogger.debug('Multi-level cache SET', { key, memoryTTL, redisTTL });
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
    await this.redisCache.delete(key);
    cacheLogger.debug('Multi-level cache DELETE', { key });
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();
    await this.redisCache.clear();
    cacheLogger.info('Multi-level cache CLEAR');
  }

  async getStats() {
    const memoryStats = this.memoryCache.getStats();
    const redisStats = await this.redisCache.getStats();

    return {
      memory: memoryStats,
      redis: redisStats,
      config: this.config,
    };
  }

  // Warm up cache with frequently accessed data
  async warmUp(
    data: Array<{ key: string; value: any; ttl?: { memory?: number; redis?: number } }>
  ): Promise<void> {
    cacheLogger.info('Multi-level cache warm-up started', { items: data.length });

    for (const item of data) {
      await this.set(item.key, item.value, item.ttl);
    }

    cacheLogger.info('Multi-level cache warm-up completed');
  }

  async disconnect(): Promise<void> {
    await this.redisCache.disconnect();
  }
}

// Cache instances with configuration from environment
const cacheConfig: CacheConfig = {
  ...defaultCacheConfig,
  redis: process.env.REDIS_URL
    ? {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0'),
        keyPrefix: process.env.REDIS_KEY_PREFIX || 'cover-letter:',
      }
    : undefined,
};

export const memoryCache = new MemoryCache();
export const sessionCache = new SessionCache();
export const localCache = new LocalCache();
export const redisCache = new RedisCache(cacheConfig.redis);
export const multiLevelCache = new MultiLevelCacheService(cacheConfig);

// Generic cache decorator for functions with multi-level cache support
export function withCache<T extends (...args: unknown[]) => unknown>(
  fn: T,
  cache: MemoryCache<ReturnType<T>> | SessionCache | LocalCache | MultiLevelCacheService,
  keyGenerator: (...args: Parameters<T>) => string,
  ttlMs?: number
): T {
  return ((...args: Parameters<T>) => {
    const key = keyGenerator(...args);

    // Handle multi-level cache
    if (cache instanceof MultiLevelCacheService) {
      return (async () => {
        const cached = await cache.get(key);
        if (cached !== null) {
          return cached;
        }

        const result = fn(...args) as ReturnType<T>;
        await cache.set(key, result);
        return result;
      })() as ReturnType<T>;
    }

    // Handle other cache types
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result, ttlMs);

    return result;
  }) as T;
}

// Async cache decorator with multi-level cache support
export function withAsyncCache<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  cache: MemoryCache<Awaited<ReturnType<T>>> | SessionCache | LocalCache | MultiLevelCacheService,
  keyGenerator: (...args: Parameters<T>) => string,
  ttlMs?: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args);

    // Handle multi-level cache
    if (cache instanceof MultiLevelCacheService) {
      const cached = await cache.get(key);
      if (cached !== null) {
        return cached;
      }

      const result = (await fn(...args)) as Awaited<ReturnType<T>>;
      await cache.set(key, result);
      return result;
    }

    // Handle other cache types
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = (await fn(...args)) as Awaited<ReturnType<T>>;
    cache.set(key, result, ttlMs);

    return result;
  }) as T;
}

// Multi-level cache decorator specifically for async functions
export function withMultiLevelCache<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl?: { memory?: number; redis?: number }
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args);

    // Try to get from multi-level cache
    const cached = await multiLevelCache.get(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = (await fn(...args)) as Awaited<ReturnType<T>>;
    await multiLevelCache.set(key, result, ttl);

    return result;
  }) as T;
}

// React hook for cached data with multi-level cache support
export function useCachedData<T>(
  key: string,
  fetcher: () => T | Promise<T>,
  cache: MemoryCache<T> | SessionCache | LocalCache | MultiLevelCacheService = multiLevelCache,
  ttlMs?: number
): { data: T | null; loading: boolean; error: Error | null; refetch: () => void; stats?: any } {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [stats, setStats] = React.useState<any>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      let cached: T | null = null;

      if (cache instanceof MultiLevelCacheService) {
        cached = await cache.get<T>(key);
      } else {
        cached = cache.get<T>(key);
      }

      if (cached !== null) {
        setData(cached);
        setLoading(false);
        return;
      }

      // Fetch new data
      const result = await fetcher();
      setData(result);

      // Cache the result
      if (cache instanceof MultiLevelCacheService) {
        await cache.set(key, result);
        setStats(await cache.getStats());
      } else {
        cache.set(key, result, ttlMs);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, cache, ttlMs]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, stats };
}

// Enhanced cleanup function with statistics
export function startCacheCleanup(): () => void {
  const cleanupInterval = setInterval(
    () => {
      memoryCache.cleanup();
      cacheLogger.info('Cache cleanup completed', {
        memoryStats: memoryCache.getStats(),
        timestamp: new Date().toISOString(),
      });
    },
    5 * 60 * 1000
  ); // Every 5 minutes

  // Stats reporting interval
  const statsInterval = setInterval(
    async () => {
      try {
        const stats = await multiLevelCache.getStats();
        cacheLogger.info('Cache statistics', stats);
      } catch (error) {
        cacheLogger.error('Failed to get cache statistics', error);
      }
    },
    15 * 60 * 1000
  ); // Every 15 minutes

  return () => {
    clearInterval(cleanupInterval);
    clearInterval(statsInterval);
  };
}

// Cache warming utilities
export const cacheWarmupStrategies = {
  // Warm up user data cache
  async warmUpUserData(userId: string): Promise<void> {
    const key = `user:${userId}`;
    // This would typically fetch from database
    // await multiLevelCache.set(key, userData, { memory: 5 * 60 * 1000, redis: 15 * 60 * 1000 });
  },

  // Warm up frequently accessed templates
  async warmUpTemplates(): Promise<void> {
    const templates = [
      { key: 'template:professional', value: 'professional template data' },
      { key: 'template:creative', value: 'creative template data' },
      { key: 'template:technical', value: 'technical template data' },
    ];

    await multiLevelCache.warmUp(
      templates.map(t => ({
        ...t,
        ttl: { memory: 60 * 60 * 1000, redis: 24 * 60 * 60 * 1000 }, // 1 hour memory, 24 hours redis
      }))
    );
  },

  // Warm up system configuration
  async warmUpSystemConfig(): Promise<void> {
    const configs = [
      { key: 'config:ai-models', value: 'AI model configuration' },
      { key: 'config:rate-limits', value: 'Rate limit configuration' },
    ];

    await multiLevelCache.warmUp(
      configs.map(c => ({
        ...c,
        ttl: { memory: 30 * 60 * 1000, redis: 60 * 60 * 1000 }, // 30 minutes memory, 1 hour redis
      }))
    );
  },
};

// Cache key generators for consistent naming
export const cacheKeys = {
  user: (userId: string) => `user:${userId}`,
  userProfile: (userId: string) => `user:profile:${userId}`,
  coverLetter: (id: string) => `cover-letter:${id}`,
  coverLetters: (userId: string, page: number = 1) => `cover-letters:${userId}:page:${page}`,
  aiModel: (modelName: string) => `ai-model:${modelName}`,
  template: (type: string) => `template:${type}`,
  rateLimit: (key: string) => `rate-limit:${key}`,
  session: (sessionId: string) => `session:${sessionId}`,
  config: (key: string) => `config:${key}`,
};
