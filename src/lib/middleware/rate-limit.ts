import { NextResponse } from 'next/server';
import { MiddlewareContext, MiddlewareFunction, RateLimitConfig, TieredRateLimitConfig } from './types';
import { createRateLimitError } from './error-handler';
import { UserTier } from '@/lib/auth';
import { redisCache, memoryCache } from '@/lib/cache';
import { logger, logSecurity } from '@/lib/logging';
import { recordApiCall } from '@/lib/metrics';

// In-memory rate limit store (fallback for when Redis is unavailable)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Enhanced rate limiter with Redis support for distributed rate limiting
export class DistributedRateLimiter {
  private config: RateLimitConfig;
  private useRedis: boolean;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.useRedis = redisCache.isConnected();
  }

  async isAllowed(key: string): Promise<{ allowed: boolean; resetTime: number; remaining: number }> {
    const rateLimitKey = `rate_limit:${key}`;

    try {
      if (this.useRedis) {
        return await this.checkRateLimitRedis(rateLimitKey);
      } else {
        return await this.checkRateLimitMemory(key);
      }
    } catch (error) {
      logger.error('Rate limit check failed', { key, error });
      // On error, allow the request but log it
      return { allowed: true, resetTime: Date.now() + this.config.windowMs, remaining: this.config.max };
    }
  }

  private async checkRateLimitRedis(key: string): Promise<{ allowed: boolean; resetTime: number; remaining: number }> {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const resetTime = now + this.config.windowMs;

    // Use Redis sorted set for sliding window rate limiting
    const pipeline = redisCache['redis']?.pipeline();
    if (!pipeline) {
      throw new Error('Redis pipeline not available');
    }

    // Remove expired entries
    pipeline.zremrangebyscore(key, 0, windowStart);

    // Count current requests in window
    pipeline.zcard(key);

    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`);

    // Set expiry for the key
    pipeline.expire(key, Math.ceil(this.config.windowMs / 1000));

    const results = await pipeline.exec();

    if (!results) {
      throw new Error('Redis pipeline execution failed');
    }

    const currentCount = (results[1][1] as number) || 0;

    if (currentCount >= this.config.max) {
      // Remove the request we just added since it's not allowed
      await redisCache['redis']?.zrem(key, `${now}-${Math.random()}`);

      return {
        allowed: false,
        resetTime,
        remaining: 0
      };
    }

    return {
      allowed: true,
      resetTime,
      remaining: this.config.max - currentCount - 1
    };
  }

  private async checkRateLimitMemory(key: string): Promise<{ allowed: boolean; resetTime: number; remaining: number }> {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Clean up old entries
    this.cleanup(windowStart);

    const record = rateLimitStore.get(key);

    if (!record || record.resetTime < now) {
      // First request in window or window expired
      const resetTime = now + this.config.windowMs;
      rateLimitStore.set(key, { count: 1, resetTime });
      return { allowed: true, resetTime, remaining: this.config.max - 1 };
    }

    if (record.count >= this.config.max) {
      // Rate limit exceeded
      return { allowed: false, resetTime: record.resetTime, remaining: 0 };
    }

    // Increment count
    record.count++;
    rateLimitStore.set(key, record);

    return {
      allowed: true,
      resetTime: record.resetTime,
      remaining: this.config.max - record.count
    };
  }

  private cleanup(windowStart: number) {
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetTime < windowStart) {
        rateLimitStore.delete(key);
      }
    }
  }
}

// Backward compatibility
export class RateLimiter extends DistributedRateLimiter {}

export const rateLimitMiddleware = (config: RateLimitConfig): MiddlewareFunction => {
  const limiter = new DistributedRateLimiter(config);

  return async (context: MiddlewareContext): Promise<MiddlewareContext | NextResponse> => {
    const startTime = Date.now();

    try {
      // Use user ID if authenticated, otherwise use IP
      const key = context.user?.id || context.req.ip || context.req.headers.get('x-forwarded-for') || 'anonymous';
      const { allowed, resetTime, remaining } = await limiter.isAllowed(key);

      // Record rate limit metrics
      recordApiCall({
        endpoint: context.req.url || 'unknown',
        method: context.req.method || 'unknown',
        statusCode: allowed ? 200 : 429,
        responseTime: Date.now() - startTime,
        timestamp: new Date(),
        userId: context.user?.id,
        userTier: context.user?.tier,
        errorType: allowed ? undefined : 'RATE_LIMIT_EXCEEDED',
      });

      if (!allowed) {
        // Log security event for rate limit exceeded
        logSecurity({
          type: 'rate_limit_exceeded',
          severity: 'medium',
          userId: context.user?.id,
          ip: context.req.headers.get('x-forwarded-for') || context.req.ip || 'unknown',
          userAgent: context.req.headers.get('user-agent') || 'unknown',
          details: {
            key,
            limit: config.max,
            windowMs: config.windowMs,
            resetTime,
          },
          timestamp: new Date(),
        });

        const error = createRateLimitError(
          config.message || 'Rate limit exceeded. Please try again later.'
        );

        return NextResponse.json(
          {
            error: {
              message: error.message,
              code: error.code,
            },
            timestamp: new Date().toISOString(),
            retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
          },
          {
            status: error.status,
            headers: {
              'X-RateLimit-Limit': config.max.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': new Date(resetTime).toISOString(),
              'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
            }
          }
        );
      }

      // Add rate limit headers to successful responses
      context.metrics.rateLimitRemaining = remaining;
      context.metrics.rateLimitReset = resetTime;
      context.metrics.rateLimitKey = key;

      logger.debug('Rate limit check passed', {
        key,
        remaining,
        resetTime: new Date(resetTime).toISOString(),
        duration: Date.now() - startTime,
      });

      return context;
    } catch (error) {
      logger.error('Rate limit error', {
        error,
        key: context.user?.id || 'anonymous',
        duration: Date.now() - startTime,
      });

      // Don't block requests on rate limit errors, but log them
      return context;
    }
  };
};

// Enhanced tiered rate limiting with distributed support
export const tieredRateLimitMiddleware = (tieredConfig: TieredRateLimitConfig): MiddlewareFunction => {
  const limiters = {
    free: new DistributedRateLimiter(tieredConfig.free),
    premium: new DistributedRateLimiter(tieredConfig.premium),
    enterprise: new DistributedRateLimiter(tieredConfig.enterprise),
  };

  return async (context: MiddlewareContext): Promise<MiddlewareContext | NextResponse> => {
    const startTime = Date.now();

    try {
      // Determine user tier
      const userTier: UserTier = context.user?.tier || 'free';

      // Check if premium/enterprise subscription is still valid
      const effectiveTier = getEffectiveUserTier(context.user);

      const config = tieredConfig[effectiveTier];
      const limiter = limiters[effectiveTier];

      // Use user ID if authenticated, otherwise use IP
      const key = context.user?.id || context.req.ip || context.req.headers.get('x-forwarded-for') || 'anonymous';
      const tieredKey = `${effectiveTier}:${key}`;
      const { allowed, resetTime, remaining } = await limiter.isAllowed(tieredKey);

      // Record tiered rate limit metrics
      recordApiCall({
        endpoint: context.req.url || 'unknown',
        method: context.req.method || 'unknown',
        statusCode: allowed ? 200 : 429,
        responseTime: Date.now() - startTime,
        timestamp: new Date(),
        userId: context.user?.id,
        userTier: effectiveTier,
        errorType: allowed ? undefined : 'TIERED_RATE_LIMIT_EXCEEDED',
      });

      if (!allowed) {
        // Log security event for tiered rate limit exceeded
        logSecurity({
          type: 'rate_limit_exceeded',
          severity: effectiveTier === 'free' ? 'low' : 'medium',
          userId: context.user?.id,
          ip: context.req.headers.get('x-forwarded-for') || context.req.ip || 'unknown',
          userAgent: context.req.headers.get('user-agent') || 'unknown',
          details: {
            key: tieredKey,
            userTier: effectiveTier,
            limit: config.max,
            windowMs: config.windowMs,
            resetTime,
          },
          timestamp: new Date(),
        });

        const error = createRateLimitError(
          config.message || `Rate limit exceeded for ${effectiveTier} tier. Please try again later.`
        );

        return NextResponse.json(
          {
            error: {
              message: error.message,
              code: error.code,
            },
            timestamp: new Date().toISOString(),
            retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
            userTier: effectiveTier,
          },
          {
            status: error.status,
            headers: {
              'X-RateLimit-Limit': config.max.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': new Date(resetTime).toISOString(),
              'X-User-Tier': effectiveTier,
              'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
            }
          }
        );
      }

      // Add rate limit headers to successful responses
      context.metrics.rateLimitRemaining = remaining;
      context.metrics.rateLimitReset = resetTime;
      context.metrics.userTier = effectiveTier;

      logger.debug('Tiered rate limit check passed', {
        key: tieredKey,
        userTier: effectiveTier,
        remaining,
        resetTime: new Date(resetTime).toISOString(),
        duration: Date.now() - startTime,
      });

      return context;
    } catch (error) {
      logger.error('Tiered rate limit error', {
        error,
        userTier: context.user?.tier,
        key: context.user?.id || 'anonymous',
        duration: Date.now() - startTime,
      });

      // Don't block requests on rate limit errors
      return context;
    }
  };
};

// Helper function to determine effective user tier (considering subscription expiry)
function getEffectiveUserTier(user?: any): UserTier {
  if (!user) return 'free';
  
  // Check if premium/enterprise subscription is still valid
  if (user.tier === 'premium' || user.tier === 'enterprise') {
    if (user.subscription_expires_at) {
      const now = new Date();
      const expiryDate = new Date(user.subscription_expires_at);
      
      if (now > expiryDate) {
        return 'free'; // Subscription expired, downgrade to free
      }
    }
  }
  
  return user.tier || 'free';
}

// Predefined rate limit configurations
export const defaultRateLimit: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
};

export const strictRateLimit: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: 'Rate limit exceeded for this endpoint.',
};

export const aiGenerationRateLimit: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 generations per hour
  message: 'AI generation rate limit exceeded. Please try again later.',
};

export const premiumRateLimit: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per window for premium users
  message: 'Premium rate limit exceeded.',
};

// Tiered rate limit configurations
export const tieredGeneralRateLimit: TieredRateLimitConfig = {
  free: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Free tier rate limit exceeded. Upgrade to premium for higher limits.',
  },
  premium: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // 500 requests per window
    message: 'Premium tier rate limit exceeded.',
  },
  enterprise: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000, // 2000 requests per window
    message: 'Enterprise tier rate limit exceeded.',
  },
};

export const tieredAiGenerationRateLimit: TieredRateLimitConfig = {
  free: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 AI generations per hour
    message: 'Free tier AI generation limit exceeded. Upgrade to premium for more generations.',
  },
  premium: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // 100 AI generations per hour
    message: 'Premium tier AI generation limit exceeded.',
  },
  enterprise: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, // 1000 AI generations per hour
    message: 'Enterprise tier AI generation limit exceeded.',
  },
};

export const tieredCoverLetterSaveRateLimit: TieredRateLimitConfig = {
  free: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 20, // 20 cover letters per day
    message: 'Free tier daily cover letter save limit exceeded.',
  },
  premium: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 200, // 200 cover letters per day
    message: 'Premium tier daily cover letter save limit exceeded.',
  },
  enterprise: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 2000, // 2000 cover letters per day
    message: 'Enterprise tier daily cover letter save limit exceeded.',
  },
};