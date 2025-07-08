import { NextResponse } from 'next/server';
import { ApiError, MiddlewareContext } from './types';
import { logger, logSecurity } from '@/lib/logging';
import { recordApiCall } from '@/lib/metrics';

export class ApiErrorHandler {
  static createError(
    message: string,
    code: string,
    status: number,
    details?: any
  ): ApiError {
    return {
      message,
      code,
      status,
      details,
    };
  }

  static handleError(error: unknown, context?: MiddlewareContext): NextResponse {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const duration = context ? Date.now() - context.startTime : 0;

    // Enhanced error logging with context
    const errorContext = {
      errorId,
      method: context?.req.method,
      url: context?.req.url,
      userId: context?.user?.id,
      userTier: context?.user?.tier,
      ip: context?.req.headers.get('x-forwarded-for') || context?.req.ip,
      userAgent: context?.req.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
      duration,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };

    logger.error('API Error occurred', errorContext);

    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    let errorMessage = 'Internal server error';
    let errorDetails: any = undefined;

    // Handle known API errors
    if (error instanceof Error && 'status' in error && 'code' in error) {
      const apiError = error as unknown as ApiError;
      statusCode = apiError.status;
      errorCode = apiError.code;
      errorMessage = apiError.message;
      errorDetails = apiError.details;
    }
    // Handle validation errors
    else if (error instanceof Error && error.name === 'ValidationError') {
      statusCode = 400;
      errorCode = 'VALIDATION_ERROR';
      errorMessage = 'Validation failed';
      errorDetails = error.message;
    }
    // Handle authentication errors
    else if (error instanceof Error && (error.message.includes('unauthorized') || error.message.includes('authentication'))) {
      statusCode = 401;
      errorCode = 'AUTH_ERROR';
      errorMessage = 'Authentication failed';

      // Log security event for auth failures
      if (context) {
        logSecurity({
          type: 'auth_failure',
          severity: 'medium',
          userId: context.user?.id,
          ip: context.req.headers.get('x-forwarded-for') || context.req.ip || 'unknown',
          userAgent: context.req.headers.get('user-agent') || 'unknown',
          details: {
            errorId,
            url: context.req.url,
            method: context.req.method,
          },
          timestamp: new Date(),
        });
      }
    }
    // Handle database errors
    else if (error instanceof Error && (error.message.includes('database') || error.message.includes('connection'))) {
      statusCode = 500;
      errorCode = 'DATABASE_ERROR';
      errorMessage = 'Database error occurred';

      // Log critical database errors
      logger.error('Database error', { ...errorContext, severity: 'critical' });
    }
    // Handle timeout errors
    else if (error instanceof Error && error.message.includes('timeout')) {
      statusCode = 504;
      errorCode = 'TIMEOUT_ERROR';
      errorMessage = 'Request timeout';
    }
    // Handle generic errors
    else if (error instanceof Error) {
      errorMessage = process.env.NODE_ENV === 'development' ? error.message : 'Internal server error';
      errorDetails = process.env.NODE_ENV === 'development' ? error.stack : undefined;
    }

    // Record error metrics
    if (context) {
      recordApiCall({
        endpoint: context.req.url || 'unknown',
        method: context.req.method || 'unknown',
        statusCode,
        responseTime: duration,
        timestamp: new Date(),
        userId: context.user?.id,
        userTier: context.user?.tier,
        errorType: errorCode,
      });
    }

    // Create error response
    const errorResponse = {
      error: {
        id: errorId,
        message: errorMessage,
        code: errorCode,
        ...(errorDetails && { details: errorDetails }),
      },
      timestamp: new Date().toISOString(),
      ...(context && { requestId: errorContext.errorId }),
    };

    return NextResponse.json(errorResponse, {
      status: statusCode,
      headers: {
        'X-Error-ID': errorId,
        'X-Response-Time': `${duration}ms`,
      }
    });
  }
}

// Common error creators
export const createValidationError = (message: string, details?: any) =>
  ApiErrorHandler.createError(message, 'VALIDATION_ERROR', 400, details);

export const createAuthError = (message: string = 'Unauthorized') =>
  ApiErrorHandler.createError(message, 'AUTH_ERROR', 401);

export const createForbiddenError = (message: string = 'Forbidden') =>
  ApiErrorHandler.createError(message, 'FORBIDDEN_ERROR', 403);

export const createNotFoundError = (message: string = 'Not found') =>
  ApiErrorHandler.createError(message, 'NOT_FOUND_ERROR', 404);

export const createRateLimitError = (message: string = 'Rate limit exceeded') =>
  ApiErrorHandler.createError(message, 'RATE_LIMIT_ERROR', 429);

export const createInternalError = (message: string = 'Internal server error') =>
  ApiErrorHandler.createError(message, 'INTERNAL_ERROR', 500);