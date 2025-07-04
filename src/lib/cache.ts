// Cache utilities for improved performance
import React from 'react';

// In-memory cache with TTL
class MemoryCache<T> {
  private cache = new Map<string, { value: T; expiry: number }>();

  set(key: string, value: T, ttlMs: number = 5 * 60 * 1000): void {
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { value, expiry });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
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
}

// Cache instances
export const memoryCache = new MemoryCache();
export const sessionCache = new SessionCache();
export const localCache = new LocalCache();

// Generic cache decorator for functions
export function withCache<T extends (...args: unknown[]) => unknown>(
  fn: T,
  cache: MemoryCache<ReturnType<T>> | SessionCache | LocalCache,
  keyGenerator: (...args: Parameters<T>) => string,
  ttlMs?: number
): T {
  return ((...args: Parameters<T>) => {
    const key = keyGenerator(...args);

    // Try to get from cache first
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

// Async cache decorator
export function withAsyncCache<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  cache: MemoryCache<Awaited<ReturnType<T>>> | SessionCache | LocalCache,
  keyGenerator: (...args: Parameters<T>) => string,
  ttlMs?: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args);

    // Try to get from cache first
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

// React hook for cached data
export function useCachedData<T>(
  key: string,
  fetcher: () => T | Promise<T>,
  cache: MemoryCache<T> | SessionCache | LocalCache,
  ttlMs?: number
): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchData = React.useCallback(async () => {
    // Check cache first
    const cached = cache.get<T>(key);
    if (cached !== null) {
      setData(cached);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      cache.set(key, result, ttlMs);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, cache, ttlMs]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Cleanup function to run periodically
export function startCacheCleanup(): () => void {
  const interval = setInterval(
    () => {
      memoryCache.cleanup();
    },
    5 * 60 * 1000
  ); // Every 5 minutes

  return () => clearInterval(interval);
}
