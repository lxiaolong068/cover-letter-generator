import { NextRequest, NextResponse } from 'next/server';
import { MiddlewareContext, MiddlewareFunction, ApiHandler, AuthenticatedRequest } from './types';
import { ApiErrorHandler } from './error-handler';
import { logger, logRequest, logResponse } from '@/lib/logging';
import { recordApiCall } from '@/lib/metrics';

export class ApiMiddleware {
  private middlewares: MiddlewareFunction[] = [];

  use(middleware: MiddlewareFunction): this {
    this.middlewares.push(middleware);
    return this;
  }

  async handle(req: NextRequest, handler: ApiHandler): Promise<NextResponse> {
    const startTime = Date.now();

    // Generate request ID and log request
    const requestId = logRequest(req);

    // Initialize enhanced context
    const context: MiddlewareContext = {
      req: req as AuthenticatedRequest,
      res: new NextResponse(),
      startTime,
      metrics: {
        requestId,
        middlewareTimings: [],
      },
    };

    try {
      // Run middleware chain with timing
      let currentContext = context;

      for (let i = 0; i < this.middlewares.length; i++) {
        const middlewareStartTime = Date.now();
        const middleware = this.middlewares[i];

        const result = await middleware(currentContext);

        const middlewareDuration = Date.now() - middlewareStartTime;
        currentContext.metrics.middlewareTimings.push({
          index: i,
          name: middleware.name || `middleware_${i}`,
          duration: middlewareDuration,
        });

        if (result instanceof NextResponse) {
          // Middleware returned a response (error or redirect)
          const totalDuration = Date.now() - startTime;

          // Log response for middleware-terminated requests
          logResponse(requestId, result.status, totalDuration, {
            userId: currentContext.user?.id,
            terminatedBy: `middleware_${i}`,
          });

          // Record metrics
          recordApiCall({
            endpoint: req.url || 'unknown',
            method: req.method || 'unknown',
            statusCode: result.status,
            responseTime: totalDuration,
            timestamp: new Date(),
            userId: currentContext.user?.id,
            userTier: currentContext.user?.tier,
          });

          return result;
        }

        currentContext = result;
      }

      // Run the actual handler
      const handlerStartTime = Date.now();
      const response = await handler(currentContext.req, currentContext);
      const handlerDuration = Date.now() - handlerStartTime;

      // Calculate total duration
      const totalDuration = Date.now() - startTime;

      // Add comprehensive performance headers
      response.headers.set('X-Response-Time', `${totalDuration}ms`);
      response.headers.set('X-Handler-Time', `${handlerDuration}ms`);
      response.headers.set('X-Request-ID', requestId);

      // Add rate limit headers if available
      if (currentContext.metrics.rateLimitRemaining !== undefined) {
        response.headers.set('X-RateLimit-Remaining', currentContext.metrics.rateLimitRemaining.toString());
      }
      if (currentContext.metrics.rateLimitReset !== undefined) {
        response.headers.set('X-RateLimit-Reset', new Date(currentContext.metrics.rateLimitReset).toISOString());
      }
      if (currentContext.metrics.userTier) {
        response.headers.set('X-User-Tier', currentContext.metrics.userTier);
      }

      // Log successful response
      logResponse(requestId, response.status, totalDuration, {
        userId: currentContext.user?.id,
        userTier: currentContext.user?.tier,
        handlerDuration,
        middlewareCount: this.middlewares.length,
      });

      // Record successful API call metrics
      recordApiCall({
        endpoint: req.url || 'unknown',
        method: req.method || 'unknown',
        statusCode: response.status,
        responseTime: totalDuration,
        timestamp: new Date(),
        userId: currentContext.user?.id,
        userTier: currentContext.user?.tier,
      });

      return response;
    } catch (error) {
      const totalDuration = Date.now() - startTime;

      // Log error response
      logResponse(requestId, 500, totalDuration, {
        userId: context.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return ApiErrorHandler.handleError(error, context);
    }
  }
}

// Convenience function to create a new middleware chain
export const createApiMiddleware = () => new ApiMiddleware();

// Export all middleware functions and utilities
export * from './types';
export * from './error-handler';
export * from './auth';
export * from './validation';
export * from './rate-limit';

// Enhanced middleware combinations with comprehensive logging
export const basicApiMiddleware = () =>
  createApiMiddleware()
    .use(async (context) => {
      // Enhanced request logging with context
      logger.debug('API Request', {
        requestId: context.metrics.requestId,
        method: context.req.method,
        url: context.req.url,
        userAgent: context.req.headers.get('user-agent'),
        ip: context.req.headers.get('x-forwarded-for') || context.req.ip,
        timestamp: new Date().toISOString(),
      });
      return context;
    });

export const authenticatedApiMiddleware = (rateLimit?: any) => {
  const { authMiddleware } = require('./auth');
  const { rateLimitMiddleware, defaultRateLimit } = require('./rate-limit');

  const middleware = createApiMiddleware()
    .use(authMiddleware);

  if (rateLimit !== false) {
    middleware.use(rateLimitMiddleware(rateLimit || defaultRateLimit));
  }

  return middleware;
};

export const validatedApiMiddleware = (schema: any, rateLimit?: any) => {
  const { validationMiddleware } = require('./validation');
  const { rateLimitMiddleware, defaultRateLimit } = require('./rate-limit');

  const middleware = createApiMiddleware()
    .use(validationMiddleware(schema));

  if (rateLimit !== false) {
    middleware.use(rateLimitMiddleware(rateLimit || defaultRateLimit));
  }

  return middleware;
};

// New enhanced middleware combinations
export const monitoredApiMiddleware = () =>
  createApiMiddleware()
    .use(async (context) => {
      // Add monitoring and health check middleware
      const memoryUsage = process.memoryUsage();
      context.metrics.memoryUsage = memoryUsage;

      logger.debug('API Request with system metrics', {
        requestId: context.metrics.requestId,
        memoryUsage: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
        },
      });

      return context;
    });

export const fullStackApiMiddleware = (schema?: any, rateLimit?: any) => {
  const { authMiddleware } = require('./auth');
  const { validationMiddleware } = require('./validation');
  const { rateLimitMiddleware, defaultRateLimit } = require('./rate-limit');
  const { versioningMiddleware } = require('./versioning');

  const middleware = createApiMiddleware()
    .use(versioningMiddleware) // Add API versioning first
    .use(monitoredApiMiddleware().middlewares[0]) // Add monitoring
    .use(authMiddleware); // Add authentication

  if (schema) {
    middleware.use(validationMiddleware(schema)); // Add validation if schema provided
  }

  if (rateLimit !== false) {
    middleware.use(rateLimitMiddleware(rateLimit || defaultRateLimit)); // Add rate limiting
  }

  return middleware;
};