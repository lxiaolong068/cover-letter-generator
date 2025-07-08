// Admin metrics dashboard API endpoint
import { NextRequest, NextResponse } from 'next/server';
import { 
  fullStackApiMiddleware,
  AuthenticatedRequest,
  MiddlewareContext
} from '@/lib/middleware';
import { getDashboardMetrics } from '@/lib/metrics';
import { multiLevelCache } from '@/lib/cache';
import { getPoolStats } from '@/lib/neon';
import { logger } from '@/lib/logging';
import { generateDatabaseReport } from '@/scripts/optimize-database';

// Admin-only middleware (you would implement proper admin role checking)
const adminMiddleware = fullStackApiMiddleware();

// GET handler - fetch comprehensive metrics dashboard
async function getMetricsDashboard(
  req: AuthenticatedRequest,
  context: MiddlewareContext
) {
  try {
    // Check if user is admin (implement proper role checking)
    if (context.user?.tier !== 'enterprise') {
      return NextResponse.json(
        { error: { message: 'Admin access required', code: 'FORBIDDEN' } },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const timeRange = url.searchParams.get('timeRange') || '1h';
    const includeDatabase = url.searchParams.get('includeDatabase') === 'true';

    // Get dashboard metrics
    const dashboardMetrics = await getDashboardMetrics();

    // Get cache statistics
    const cacheStats = await multiLevelCache.getStats();

    // Get database pool statistics
    const poolStats = getPoolStats();

    // Get system metrics
    const systemMetrics = {
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      cpuUsage: process.cpuUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    };

    // Get database report if requested
    let databaseReport = null;
    if (includeDatabase) {
      try {
        databaseReport = await generateDatabaseReport();
      } catch (error) {
        logger.error('Failed to generate database report', { error });
      }
    }

    // Calculate derived metrics
    const derivedMetrics = {
      errorRate: dashboardMetrics.api.errorRate,
      averageResponseTime: dashboardMetrics.api.averageResponseTime,
      throughput: dashboardMetrics.api.throughput,
      cacheHitRate: dashboardMetrics.cache.hitRate,
      aiGenerationSuccessRate: dashboardMetrics.aiGeneration.successfulRequests / 
        (dashboardMetrics.aiGeneration.totalRequests || 1),
      memoryUsagePercent: (systemMetrics.memory.heapUsed / systemMetrics.memory.heapTotal) * 100,
    };

    // Health status calculation
    const healthStatus = {
      overall: 'healthy' as 'healthy' | 'warning' | 'critical',
      api: derivedMetrics.errorRate < 0.01 ? 'healthy' : 
           derivedMetrics.errorRate < 0.05 ? 'warning' : 'critical',
      cache: derivedMetrics.cacheHitRate > 0.8 ? 'healthy' : 
             derivedMetrics.cacheHitRate > 0.5 ? 'warning' : 'critical',
      database: poolStats ? 'healthy' : 'warning',
      memory: derivedMetrics.memoryUsagePercent < 80 ? 'healthy' : 
              derivedMetrics.memoryUsagePercent < 90 ? 'warning' : 'critical',
    };

    // Set overall health based on component health
    const componentStatuses = Object.values(healthStatus).slice(1); // Exclude 'overall'
    if (componentStatuses.includes('critical')) {
      healthStatus.overall = 'critical';
    } else if (componentStatuses.includes('warning')) {
      healthStatus.overall = 'warning';
    }

    // Performance alerts
    const alerts = [];
    if (derivedMetrics.errorRate > 0.05) {
      alerts.push({
        type: 'error_rate_high',
        severity: 'critical',
        message: `Error rate is ${(derivedMetrics.errorRate * 100).toFixed(2)}% (threshold: 5%)`,
        timestamp: new Date().toISOString(),
      });
    }

    if (derivedMetrics.averageResponseTime > 1000) {
      alerts.push({
        type: 'response_time_high',
        severity: 'warning',
        message: `Average response time is ${derivedMetrics.averageResponseTime.toFixed(0)}ms (threshold: 1000ms)`,
        timestamp: new Date().toISOString(),
      });
    }

    if (derivedMetrics.cacheHitRate < 0.5) {
      alerts.push({
        type: 'cache_hit_rate_low',
        severity: 'warning',
        message: `Cache hit rate is ${(derivedMetrics.cacheHitRate * 100).toFixed(1)}% (threshold: 50%)`,
        timestamp: new Date().toISOString(),
      });
    }

    if (derivedMetrics.memoryUsagePercent > 90) {
      alerts.push({
        type: 'memory_usage_high',
        severity: 'critical',
        message: `Memory usage is ${derivedMetrics.memoryUsagePercent.toFixed(1)}% (threshold: 90%)`,
        timestamp: new Date().toISOString(),
      });
    }

    const response = {
      timestamp: new Date().toISOString(),
      timeRange,
      health: healthStatus,
      alerts,
      metrics: {
        api: dashboardMetrics.api,
        aiGeneration: dashboardMetrics.aiGeneration,
        cache: {
          ...dashboardMetrics.cache,
          stats: cacheStats,
        },
        system: {
          ...dashboardMetrics.system,
          ...systemMetrics,
          pool: poolStats,
        },
        derived: derivedMetrics,
      },
      ...(databaseReport && { database: databaseReport }),
    };

    logger.info('Metrics dashboard accessed', {
      requestId: context.metrics.requestId,
      userId: context.user?.id,
      timeRange,
      includeDatabase,
      healthStatus: healthStatus.overall,
      alertCount: alerts.length,
    });

    return NextResponse.json(response);

  } catch (error) {
    logger.error('Failed to fetch metrics dashboard', {
      requestId: context.metrics.requestId,
      userId: context.user?.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      {
        error: {
          message: 'Failed to fetch metrics',
          code: 'METRICS_ERROR',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST handler - trigger manual optimization or alerts
async function triggerAction(
  req: AuthenticatedRequest,
  context: MiddlewareContext
) {
  try {
    // Check if user is admin
    if (context.user?.tier !== 'enterprise') {
      return NextResponse.json(
        { error: { message: 'Admin access required', code: 'FORBIDDEN' } },
        { status: 403 }
      );
    }

    const { action, parameters } = await req.json();

    let result;
    switch (action) {
      case 'clear_cache':
        await multiLevelCache.clear();
        result = { message: 'Cache cleared successfully' };
        break;

      case 'optimize_database':
        const { optimizeDatabase } = await import('@/scripts/optimize-database');
        result = await optimizeDatabase();
        break;

      case 'generate_report':
        result = await generateDatabaseReport();
        break;

      default:
        return NextResponse.json(
          { error: { message: 'Unknown action', code: 'INVALID_ACTION' } },
          { status: 400 }
        );
    }

    logger.info('Admin action triggered', {
      requestId: context.metrics.requestId,
      userId: context.user?.id,
      action,
      parameters,
    });

    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Failed to trigger admin action', {
      requestId: context.metrics.requestId,
      userId: context.user?.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      {
        error: {
          message: 'Action failed',
          code: 'ACTION_ERROR',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return adminMiddleware.handle(req, getMetricsDashboard);
}

export async function POST(req: NextRequest) {
  return adminMiddleware.handle(req, triggerAction);
}
