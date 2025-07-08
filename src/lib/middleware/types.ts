import { NextRequest, NextResponse } from 'next/server';
import { AuthenticatedUser, UserTier } from '@/lib/auth';

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthenticatedUser & { role?: string };
  parsedBody?: any;
  ip?: string;
}

export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: string[];
  };
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}

export interface TieredRateLimitConfig {
  free: RateLimitConfig;
  premium: RateLimitConfig;
  enterprise: RateLimitConfig;
}

export interface MiddlewareContext {
  req: AuthenticatedRequest;
  res: NextResponse;
  user?: AuthenticatedUser & { role?: string };
  startTime: number;
  apiVersion?: string;
  versionInfo?: any; // ApiVersion interface from api-versioning
  requiresVersionTransformation?: boolean;
  targetVersion?: string;
  deprecationWarnings?: Array<{
    version: string;
    message: string;
    deprecationDate: Date;
    sunsetDate: Date;
    replacement: string;
  }>;
  breakingChangeWarnings?: Array<{
    version: string;
    change: string;
    impact: string;
  }>;
  metrics: {
    requestId?: string;
    rateLimitRemaining?: number;
    rateLimitReset?: number;
    rateLimitKey?: string;
    userTier?: string;
    apiVersion?: string;
    versionStatus?: string;
    middlewareTimings?: Array<{
      index: number;
      name: string;
      duration: number;
    }>;
    cacheHit?: boolean;
    dbQueryTime?: number;
    aiGenerationTime?: number;
    [key: string]: any;
  };
}

export type MiddlewareFunction = (
  context: MiddlewareContext
) => Promise<MiddlewareContext | NextResponse>;

export interface ApiHandler {
  (req: AuthenticatedRequest, context: MiddlewareContext): Promise<NextResponse>;
}