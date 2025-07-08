// System health check endpoint for monitoring and load balancers
import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseHealth, getPoolStats } from '@/lib/neon';
import { multiLevelCache } from '@/lib/cache';
import { logger } from '@/lib/logging';
import { getActiveAlerts } from '@/lib/alerting';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    database: HealthCheckResult;
    cache: HealthCheckResult;
    memory: HealthCheckResult;
    alerts: HealthCheckResult;
  };
  metrics: {
    memory: NodeJS.MemoryUsage;
    cpu: NodeJS.CpuUsage;
    uptime: number;
    activeConnections: number;
  };
}

interface HealthCheckResult {
  status: 'pass' | 'warn' | 'fail';
  duration: number;
  message?: string;
  details?: any;
}

class HealthChecker {
  private async checkDatabase(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const isHealthy = await checkDatabaseHealth();
      const poolStats = getPoolStats();
      const duration = Date.now() - startTime;

      if (!isHealthy) {
        return {
          status: 'fail',
          duration,
          message: 'Database connection failed',
        };
      }

      // Check if pool is overloaded
      if (poolStats && poolStats.waitingCount > 5) {
        return {
          status: 'warn',
          duration,
          message: 'Database pool has high waiting connections',
          details: poolStats,
        };
      }

      return {
        status: 'pass',
        duration,
        details: poolStats,
      };
    } catch (error) {
      return {
        status: 'fail',
        duration: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Database check failed',
      };
    }
  }

  private async checkCache(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Test cache operations
      const testKey = 'health_check_test';
      const testValue = { timestamp: Date.now() };
      
      await multiLevelCache.set(testKey, testValue, {
        memory: 1000, // 1 second
        redis: 1000,
      });
      
      const retrieved = await multiLevelCache.get(testKey);
      await multiLevelCache.delete(testKey);
      
      const duration = Date.now() - startTime;

      if (!retrieved || retrieved.timestamp !== testValue.timestamp) {
        return {
          status: 'fail',
          duration,
          message: 'Cache read/write test failed',
        };
      }

      // Get cache statistics
      const cacheStats = await multiLevelCache.getStats();
      
      // Check cache performance
      if (duration > 100) {
        return {
          status: 'warn',
          duration,
          message: 'Cache response time is slow',
          details: cacheStats,
        };
      }

      return {
        status: 'pass',
        duration,
        details: cacheStats,
      };
    } catch (error) {
      return {
        status: 'fail',
        duration: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Cache check failed',
      };
    }
  }

  private checkMemory(): HealthCheckResult {
    const startTime = Date.now();
    const memoryUsage = process.memoryUsage();
    const duration = Date.now() - startTime;

    const heapUsedPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    const rssUsedMB = memoryUsage.rss / 1024 / 1024;

    if (heapUsedPercent > 90) {
      return {
        status: 'fail',
        duration,
        message: `Heap usage is critically high: ${heapUsedPercent.toFixed(1)}%`,
        details: memoryUsage,
      };
    }

    if (heapUsedPercent > 80 || rssUsedMB > 512) {
      return {
        status: 'warn',
        duration,
        message: `Memory usage is high: heap ${heapUsedPercent.toFixed(1)}%, RSS ${rssUsedMB.toFixed(0)}MB`,
        details: memoryUsage,
      };
    }

    return {
      status: 'pass',
      duration,
      details: memoryUsage,
    };
  }

  private checkAlerts(): HealthCheckResult {
    const startTime = Date.now();
    
    try {
      const activeAlerts = getActiveAlerts();
      const duration = Date.now() - startTime;

      const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');
      const highAlerts = activeAlerts.filter(alert => alert.severity === 'high');

      if (criticalAlerts.length > 0) {
        return {
          status: 'fail',
          duration,
          message: `${criticalAlerts.length} critical alerts active`,
          details: {
            total: activeAlerts.length,
            critical: criticalAlerts.length,
            high: highAlerts.length,
            alerts: criticalAlerts.map(a => ({ id: a.id, type: a.type, title: a.title })),
          },
        };
      }

      if (highAlerts.length > 2) {
        return {
          status: 'warn',
          duration,
          message: `${highAlerts.length} high-severity alerts active`,
          details: {
            total: activeAlerts.length,
            high: highAlerts.length,
          },
        };
      }

      return {
        status: 'pass',
        duration,
        details: {
          total: activeAlerts.length,
        },
      };
    } catch (error) {
      return {
        status: 'warn',
        duration: Date.now() - startTime,
        message: 'Failed to check alerts',
      };
    }
  }

  async performHealthCheck(): Promise<HealthCheck> {
    const startTime = Date.now();

    // Run all health checks in parallel
    const [databaseCheck, cacheCheck, memoryCheck, alertsCheck] = await Promise.all([
      this.checkDatabase(),
      this.checkCache(),
      this.checkMemory(),
      this.checkAlerts(),
    ]);

    // Determine overall status
    const checks = { database: databaseCheck, cache: cacheCheck, memory: memoryCheck, alerts: alertsCheck };
    const checkResults = Object.values(checks);
    
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    
    if (checkResults.some(check => check.status === 'fail')) {
      overallStatus = 'unhealthy';
    } else if (checkResults.some(check => check.status === 'warn')) {
      overallStatus = 'degraded';
    }

    const healthCheck: HealthCheck = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks,
      metrics: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        uptime: process.uptime(),
        activeConnections: getPoolStats()?.totalCount || 0,
      },
    };

    const duration = Date.now() - startTime;
    
    // Log health check results
    logger.info('Health check completed', {
      status: overallStatus,
      duration,
      checks: Object.entries(checks).reduce((acc, [key, check]) => {
        acc[key] = check.status;
        return acc;
      }, {} as Record<string, string>),
    });

    return healthCheck;
  }
}

// Create health checker instance
const healthChecker = new HealthChecker();

// GET handler - perform health check
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const detailed = url.searchParams.get('detailed') === 'true';

    const healthCheck = await healthChecker.performHealthCheck();

    // Return appropriate status code based on health
    let statusCode = 200;
    if (healthCheck.status === 'degraded') {
      statusCode = 200; // Still operational
    } else if (healthCheck.status === 'unhealthy') {
      statusCode = 503; // Service unavailable
    }

    // Filter response based on detailed parameter
    const response = detailed ? healthCheck : {
      status: healthCheck.status,
      timestamp: healthCheck.timestamp,
      uptime: healthCheck.uptime,
      version: healthCheck.version,
      environment: healthCheck.environment,
    };

    return NextResponse.json(response, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Status': healthCheck.status,
      }
    });

  } catch (error) {
    logger.error('Health check failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { 
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Health-Status': 'unhealthy',
        }
      }
    );
  }
}

// HEAD handler - lightweight health check for load balancers
export async function HEAD(req: NextRequest) {
  try {
    // Quick health check - just database and basic metrics
    const isDbHealthy = await checkDatabaseHealth();
    const memoryUsage = process.memoryUsage();
    const heapUsedPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

    if (!isDbHealthy || heapUsedPercent > 95) {
      return new NextResponse(null, { 
        status: 503,
        headers: {
          'X-Health-Status': 'unhealthy',
        }
      });
    }

    return new NextResponse(null, { 
      status: 200,
      headers: {
        'X-Health-Status': 'healthy',
      }
    });

  } catch (error) {
    return new NextResponse(null, { 
      status: 503,
      headers: {
        'X-Health-Status': 'unhealthy',
      }
    });
  }
}
