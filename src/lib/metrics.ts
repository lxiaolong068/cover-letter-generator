// Comprehensive metrics collection system
import { multiLevelCache, cacheKeys } from './cache';
import { logger, PerformanceMetrics, BusinessMetrics } from './logging';

// Metrics interfaces
export interface ApiMetrics {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
  userId?: string;
  userTier?: string;
  errorType?: string;
}

export interface AiGenerationMetrics {
  model: string;
  tokensUsed: number;
  generationTime: number;
  success: boolean;
  userId?: string;
  userTier?: string;
  timestamp: Date;
  errorType?: string;
}

export interface CacheMetrics {
  operation: 'get' | 'set' | 'delete' | 'clear';
  key: string;
  hit: boolean;
  level: 'memory' | 'redis' | 'multi';
  responseTime: number;
  timestamp: Date;
}

export interface UserActivityMetrics {
  userId: string;
  action: string;
  duration: number;
  success: boolean;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface SystemHealthMetrics {
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage?: number;
  activeConnections: number;
  cacheStats: any;
  timestamp: Date;
}

// Metrics aggregation interface
export interface MetricsAggregation {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  throughput: number; // requests per second
  period: {
    start: Date;
    end: Date;
  };
}

class MetricsCollector {
  private metrics: {
    api: ApiMetrics[];
    aiGeneration: AiGenerationMetrics[];
    cache: CacheMetrics[];
    userActivity: UserActivityMetrics[];
    systemHealth: SystemHealthMetrics[];
  } = {
    api: [],
    aiGeneration: [],
    cache: [],
    userActivity: [],
    systemHealth: [],
  };

  private readonly MAX_METRICS_IN_MEMORY = 10000;
  private readonly METRICS_FLUSH_INTERVAL = 60000; // 1 minute
  private flushInterval?: NodeJS.Timeout;

  constructor() {
    this.startPeriodicFlush();
    this.startSystemHealthCollection();
  }

  // API metrics collection
  recordApiMetrics(metrics: ApiMetrics): void {
    this.metrics.api.push(metrics);
    this.trimMetrics('api');

    // Log performance metrics
    logger.logPerformanceMetrics({
      requestId: `api_${Date.now()}`,
      endpoint: metrics.endpoint,
      method: metrics.method,
      statusCode: metrics.statusCode,
      duration: metrics.responseTime,
      timestamp: metrics.timestamp,
      userId: metrics.userId,
      userTier: metrics.userTier,
    });

    // Cache recent metrics for quick access
    this.cacheRecentMetrics('api', metrics);
  }

  // AI generation metrics collection
  recordAiGenerationMetrics(metrics: AiGenerationMetrics): void {
    this.metrics.aiGeneration.push(metrics);
    this.trimMetrics('aiGeneration');

    // Log AI generation
    logger.logAiGeneration({
      requestId: `ai_${Date.now()}`,
      userId: metrics.userId,
      model: metrics.model,
      tokensUsed: metrics.tokensUsed,
      generationTime: metrics.generationTime,
      success: metrics.success,
      error: metrics.errorType,
    });

    // Cache AI metrics for monitoring
    this.cacheRecentMetrics('aiGeneration', metrics);
  }

  // Cache metrics collection
  recordCacheMetrics(metrics: CacheMetrics): void {
    this.metrics.cache.push(metrics);
    this.trimMetrics('cache');

    logger.logCacheOperation({
      operation: metrics.operation,
      key: metrics.key,
      hit: metrics.hit,
      level: metrics.level,
      duration: metrics.responseTime,
    });
  }

  // User activity metrics collection
  recordUserActivity(metrics: UserActivityMetrics): void {
    this.metrics.userActivity.push(metrics);
    this.trimMetrics('userActivity');

    // Log business metrics
    logger.logBusinessMetrics({
      event: 'api_call',
      userId: metrics.userId,
      metadata: {
        action: metrics.action,
        duration: metrics.duration,
        success: metrics.success,
        ...metrics.metadata,
      },
      timestamp: metrics.timestamp,
    });
  }

  // System health metrics collection
  recordSystemHealth(metrics: SystemHealthMetrics): void {
    this.metrics.systemHealth.push(metrics);
    this.trimMetrics('systemHealth');
  }

  // Get aggregated metrics for a time period
  async getAggregatedMetrics(
    type: 'api' | 'aiGeneration',
    startTime: Date,
    endTime: Date
  ): Promise<MetricsAggregation> {
    const relevantMetrics = this.metrics[type].filter(
      m => m.timestamp >= startTime && m.timestamp <= endTime
    );

    if (relevantMetrics.length === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        errorRate: 0,
        throughput: 0,
        period: { start: startTime, end: endTime },
      };
    }

    const responseTimes = relevantMetrics
      .map(m =>
        type === 'api' ? (m as ApiMetrics).responseTime : (m as AiGenerationMetrics).generationTime
      )
      .sort((a, b) => a - b);

    const successfulRequests = relevantMetrics.filter(m =>
      type === 'api' ? (m as ApiMetrics).statusCode < 400 : (m as AiGenerationMetrics).success
    ).length;

    const totalRequests = relevantMetrics.length;
    const failedRequests = totalRequests - successfulRequests;
    const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const p95Index = Math.floor(responseTimes.length * 0.95);
    const p99Index = Math.floor(responseTimes.length * 0.99);
    const timePeriodSeconds = (endTime.getTime() - startTime.getTime()) / 1000;

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime,
      p95ResponseTime: responseTimes[p95Index] || 0,
      p99ResponseTime: responseTimes[p99Index] || 0,
      errorRate: failedRequests / totalRequests,
      throughput: totalRequests / timePeriodSeconds,
      period: { start: startTime, end: endTime },
    };
  }

  // Get real-time metrics dashboard data
  async getDashboardMetrics(): Promise<{
    api: MetricsAggregation;
    aiGeneration: MetricsAggregation;
    cache: {
      hitRate: number;
      totalOperations: number;
      averageResponseTime: number;
    };
    system: SystemHealthMetrics | null;
  }> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const [apiMetrics, aiMetrics] = await Promise.all([
      this.getAggregatedMetrics('api', oneHourAgo, now),
      this.getAggregatedMetrics('aiGeneration', oneHourAgo, now),
    ]);

    // Cache metrics for the last hour
    const recentCacheMetrics = this.metrics.cache.filter(
      m => m.timestamp >= oneHourAgo && m.timestamp <= now
    );

    const cacheHits = recentCacheMetrics.filter(m => m.hit).length;
    const totalCacheOps = recentCacheMetrics.length;
    const avgCacheResponseTime =
      totalCacheOps > 0
        ? recentCacheMetrics.reduce((sum, m) => sum + m.responseTime, 0) / totalCacheOps
        : 0;

    const latestSystemHealth =
      this.metrics.systemHealth[this.metrics.systemHealth.length - 1] || null;

    return {
      api: apiMetrics,
      aiGeneration: aiMetrics,
      cache: {
        hitRate: totalCacheOps > 0 ? cacheHits / totalCacheOps : 0,
        totalOperations: totalCacheOps,
        averageResponseTime: avgCacheResponseTime,
      },
      system: latestSystemHealth,
    };
  }

  // Helper methods
  private trimMetrics(type: keyof typeof this.metrics): void {
    if (this.metrics[type].length > this.MAX_METRICS_IN_MEMORY) {
      this.metrics[type] = this.metrics[type].slice(-this.MAX_METRICS_IN_MEMORY / 2) as any;
    }
  }

  private async cacheRecentMetrics(type: string, metrics: any): Promise<void> {
    try {
      const key = cacheKeys.config(`recent_metrics_${type}`);
      const recentMetrics = (await multiLevelCache.get<any[]>(key)) || [];
      recentMetrics.push(metrics);

      // Keep only last 100 metrics
      if (recentMetrics.length > 100) {
        recentMetrics.splice(0, recentMetrics.length - 100);
      }

      await multiLevelCache.set(key, recentMetrics, {
        memory: 5 * 60 * 1000, // 5 minutes
        redis: 15 * 60 * 1000, // 15 minutes
      });
    } catch (error) {
      logger.error('Failed to cache recent metrics', { error: error as Error, type });
    }
  }

  private startPeriodicFlush(): void {
    this.flushInterval = setInterval(() => {
      this.flushMetricsToStorage();
    }, this.METRICS_FLUSH_INTERVAL);
  }

  private startSystemHealthCollection(): void {
    setInterval(() => {
      this.collectSystemHealth();
    }, 30000); // Every 30 seconds
  }

  private async flushMetricsToStorage(): Promise<void> {
    // In production, this would flush metrics to a time-series database
    // For now, we'll just log the summary
    try {
      const dashboard = await this.getDashboardMetrics();
      logger.info('Metrics Summary', { dashboard });
    } catch (error) {
      logger.error('Failed to flush metrics', { error: error as Error });
    }
  }

  private async collectSystemHealth(): Promise<void> {
    try {
      const memoryUsage = process.memoryUsage();
      const cacheStats = await multiLevelCache.getStats();

      const healthMetrics: SystemHealthMetrics = {
        memoryUsage,
        activeConnections: 0, // Would be populated from connection pool
        cacheStats,
        timestamp: new Date(),
      };

      this.recordSystemHealth(healthMetrics);
    } catch (error) {
      logger.error('Failed to collect system health metrics', { error: error as Error });
    }
  }

  // Cleanup method
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
  }
}

// Create singleton instance
export const metricsCollector = new MetricsCollector();

// Convenience functions
export const recordApiCall = (metrics: ApiMetrics) => metricsCollector.recordApiMetrics(metrics);
export const recordAiGeneration = (metrics: AiGenerationMetrics) =>
  metricsCollector.recordAiGenerationMetrics(metrics);
export const recordCacheOperation = (metrics: CacheMetrics) =>
  metricsCollector.recordCacheMetrics(metrics);
export const recordUserActivity = (metrics: UserActivityMetrics) =>
  metricsCollector.recordUserActivity(metrics);
export const getDashboardMetrics = () => metricsCollector.getDashboardMetrics();
