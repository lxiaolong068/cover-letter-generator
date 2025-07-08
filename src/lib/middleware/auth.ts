import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import { MiddlewareContext, MiddlewareFunction } from './types';
import { createAuthError } from './error-handler';
import { isMFAEnabled } from '@/lib/mfa';
import { logger, logSecurity } from '@/lib/logging';
import { multiLevelCache, cacheKeys } from '@/lib/cache';

// Enhanced auth middleware with MFA support
export const authMiddleware: MiddlewareFunction = async (
  context: MiddlewareContext
): Promise<MiddlewareContext | NextResponse> => {
  try {
    const user = await authenticate(context.req);

    if (!user) {
      const error = createAuthError('Authentication required');

      // Log authentication failure
      logSecurity({
        type: 'auth_failure',
        severity: 'medium',
        userId: undefined,
        ip: context.req.headers.get('x-forwarded-for') || context.req.ip || 'unknown',
        userAgent: context.req.headers.get('user-agent') || 'unknown',
        details: { reason: 'no_token' },
        timestamp: new Date(),
      });

      return NextResponse.json(
        {
          error: {
            message: error.message,
            code: error.code,
          },
          timestamp: new Date().toISOString(),
        },
        { status: error.status }
      );
    }

    // Add user to context with default role
    const userWithRole = { ...user, role: 'user' };
    context.user = userWithRole;
    context.req.user = userWithRole;

    // Log successful authentication
    logger.debug('User authenticated successfully', {
      requestId: context.metrics.requestId,
      userId: user.id,
      userTier: user.tier,
    });

    return context;
  } catch (error) {
    logger.error('Authentication error', {
      requestId: context.metrics.requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Log authentication error
    logSecurity({
      type: 'auth_failure',
      severity: 'high',
      userId: undefined,
      ip: context.req.headers.get('x-forwarded-for') || context.req.ip || 'unknown',
      userAgent: context.req.headers.get('user-agent') || 'unknown',
      details: { reason: 'auth_error', error: error instanceof Error ? error.message : 'Unknown' },
      timestamp: new Date(),
    });

    const authError = createAuthError('Authentication failed');
    return NextResponse.json(
      {
        error: {
          message: authError.message,
          code: authError.code,
        },
        timestamp: new Date().toISOString(),
      },
      { status: authError.status }
    );
  }
};

// MFA-aware authentication middleware
export const mfaAuthMiddleware: MiddlewareFunction = async (
  context: MiddlewareContext
): Promise<MiddlewareContext | NextResponse> => {
  // First run standard authentication
  const authResult = await authMiddleware(context);

  // If auth failed, return the error
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Check if user has MFA enabled
  const userId = context.user!.id;

  try {
    const mfaEnabled = await isMFAEnabled(userId);

    if (mfaEnabled) {
      // Check if MFA session is verified
      const mfaSessionKey = cacheKeys.config(`mfa_session:${userId}`);
      const mfaSession = await multiLevelCache.get(mfaSessionKey);

      if (!mfaSession) {
        // MFA verification required
        logger.info('MFA verification required', {
          requestId: context.metrics.requestId,
          userId,
        });

        return NextResponse.json(
          {
            error: {
              message: 'MFA verification required',
              code: 'MFA_REQUIRED',
            },
            mfaRequired: true,
            timestamp: new Date().toISOString(),
          },
          { status: 401 }
        );
      }

      // Extend MFA session
      await multiLevelCache.set(mfaSessionKey, {
        userId,
        verifiedAt: new Date(),
      }, {
        memory: 30 * 60 * 1000, // 30 minutes
        redis: 30 * 60 * 1000,
      });
    }

    return context;
  } catch (error) {
    logger.error('MFA check failed', {
      requestId: context.metrics.requestId,
      userId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Continue without MFA check on error (fail open for availability)
    return context;
  }
};

// Create MFA session after successful verification
export async function createMFASession(userId: string): Promise<void> {
  const mfaSessionKey = cacheKeys.config(`mfa_session:${userId}`);
  await multiLevelCache.set(mfaSessionKey, {
    userId,
    verifiedAt: new Date(),
  }, {
    memory: 30 * 60 * 1000, // 30 minutes
    redis: 30 * 60 * 1000,
  });

  logger.info('MFA session created', { userId });
}

// Clear MFA session
export async function clearMFASession(userId: string): Promise<void> {
  const mfaSessionKey = cacheKeys.config(`mfa_session:${userId}`);
  await multiLevelCache.delete(mfaSessionKey);

  logger.info('MFA session cleared', { userId });
}

export const optionalAuthMiddleware: MiddlewareFunction = async (
  context: MiddlewareContext
): Promise<MiddlewareContext | NextResponse> => {
  try {
    const user = await authenticate(context.req);
    
    if (user) {
      const userWithRole = { ...user, role: 'user' };
      context.user = userWithRole;
      context.req.user = userWithRole;
    }

    return context;
  } catch (error) {
    console.error('Optional auth error:', error);
    // Continue without authentication for optional auth
    return context;
  }
};

export const roleMiddleware = (requiredRole: string): MiddlewareFunction => {
  return async (context: MiddlewareContext): Promise<MiddlewareContext | NextResponse> => {
    if (!context.user) {
      const error = createAuthError('Authentication required');
      return NextResponse.json(
        {
          error: {
            message: error.message,
            code: error.code,
          },
          timestamp: new Date().toISOString(),
        },
        { status: error.status }
      );
    }

    if (context.user.role !== requiredRole && context.user.role !== 'admin') {
      const error = createAuthError('Insufficient permissions');
      return NextResponse.json(
        {
          error: {
            message: error.message,
            code: error.code,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    return context;
  };
};