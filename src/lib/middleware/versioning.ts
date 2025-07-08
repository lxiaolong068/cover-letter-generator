// API versioning middleware
import { NextResponse } from 'next/server';
import { MiddlewareContext, MiddlewareFunction } from './types';
import { createValidationError } from './error-handler';
import { 
  extractVersion, 
  isVersionSupported, 
  getVersionInfo, 
  getSupportedVersions,
  apiVersioningService 
} from '@/lib/api-versioning';
import { logger } from '@/lib/logging';

// Versioning middleware
export const versioningMiddleware: MiddlewareFunction = async (
  context: MiddlewareContext
): Promise<MiddlewareContext | NextResponse> => {
  try {
    // Extract API version from request
    const requestedVersion = extractVersion(context.req);
    
    // Validate version support
    if (!isVersionSupported(requestedVersion)) {
      const supportedVersions = getSupportedVersions();
      
      logger.warn('Unsupported API version requested', {
        requestId: context.metrics.requestId,
        requestedVersion,
        supportedVersions,
        userAgent: context.req.headers.get('user-agent'),
      });

      return NextResponse.json(
        {
          error: {
            message: `API version ${requestedVersion} is not supported`,
            code: 'UNSUPPORTED_VERSION',
            details: {
              requestedVersion,
              supportedVersions,
              currentVersion: supportedVersions[supportedVersions.length - 1],
            },
          },
          timestamp: new Date().toISOString(),
        },
        { 
          status: 400,
          headers: {
            'API-Supported-Versions': supportedVersions.join(', '),
            'API-Current-Version': supportedVersions[supportedVersions.length - 1],
          }
        }
      );
    }

    // Get version information
    const versionInfo = getVersionInfo(requestedVersion);
    
    // Check if version is sunset
    if (versionInfo?.status === 'sunset') {
      logger.warn('Sunset API version accessed', {
        requestId: context.metrics.requestId,
        requestedVersion,
        sunsetDate: versionInfo.sunsetDate,
      });

      return NextResponse.json(
        {
          error: {
            message: `API version ${requestedVersion} has been sunset and is no longer available`,
            code: 'VERSION_SUNSET',
            details: {
              requestedVersion,
              sunsetDate: versionInfo.sunsetDate,
              currentVersion: getSupportedVersions()[getSupportedVersions().length - 1],
            },
          },
          timestamp: new Date().toISOString(),
        },
        { 
          status: 410, // Gone
          headers: {
            'API-Supported-Versions': getSupportedVersions().join(', '),
          }
        }
      );
    }

    // Add version information to context
    context.apiVersion = requestedVersion;
    context.versionInfo = versionInfo;
    
    // Log version usage for analytics
    logger.debug('API version accessed', {
      requestId: context.metrics.requestId,
      version: requestedVersion,
      status: versionInfo?.status,
      method: context.req.method,
      url: context.req.url,
    });

    // Add version metrics
    context.metrics.apiVersion = requestedVersion;
    context.metrics.versionStatus = versionInfo?.status;

    return context;
  } catch (error) {
    logger.error('Versioning middleware error', {
      requestId: context.metrics.requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Continue with default version on error
    context.apiVersion = getSupportedVersions()[getSupportedVersions().length - 1];
    return context;
  }
};

// Version-aware response middleware
export const versionedResponseMiddleware = (
  originalHandler: (context: MiddlewareContext) => Promise<NextResponse>
): MiddlewareFunction => {
  return async (context: MiddlewareContext): Promise<MiddlewareContext | NextResponse> => {
    try {
      // Execute the original handler
      const response = await originalHandler(context);
      
      // If it's not a JSON response, return as-is
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        return response;
      }

      // Parse response data
      const responseData = await response.json();
      
      // Create versioned response
      const versionedResponse = await apiVersioningService.createVersionedResponse(
        responseData,
        context.apiVersion || getSupportedVersions()[getSupportedVersions().length - 1],
        context.req
      );

      return versionedResponse;
    } catch (error) {
      logger.error('Versioned response middleware error', {
        requestId: context.metrics.requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Return original response on error
      return await originalHandler(context);
    }
  };
};

// Deprecation warning middleware
export const deprecationWarningMiddleware: MiddlewareFunction = async (
  context: MiddlewareContext
): Promise<MiddlewareContext | NextResponse> => {
  const versionInfo = context.versionInfo;
  
  if (versionInfo?.status === 'deprecated') {
    // Log deprecation usage
    logger.warn('Deprecated API version used', {
      requestId: context.metrics.requestId,
      version: context.apiVersion,
      deprecationDate: versionInfo.deprecationDate,
      sunsetDate: versionInfo.sunsetDate,
      userAgent: context.req.headers.get('user-agent'),
      ip: context.req.headers.get('x-forwarded-for') || context.req.ip,
    });

    // Add deprecation headers to response (will be added by the main middleware)
    context.deprecationWarnings = [
      {
        version: context.apiVersion!,
        message: `API version ${context.apiVersion} is deprecated`,
        deprecationDate: versionInfo.deprecationDate!,
        sunsetDate: versionInfo.sunsetDate!,
        replacement: getSupportedVersions()[getSupportedVersions().length - 1],
      },
    ];
  }

  return context;
};

// Version compatibility middleware for legacy support
export const compatibilityMiddleware: MiddlewareFunction = async (
  context: MiddlewareContext
): Promise<MiddlewareContext | NextResponse> => {
  const requestedVersion = context.apiVersion;
  const currentVersion = getSupportedVersions()[getSupportedVersions().length - 1];

  if (requestedVersion && requestedVersion !== currentVersion) {
    // Add compatibility transformation flag
    context.requiresVersionTransformation = true;
    context.targetVersion = requestedVersion;
    
    logger.debug('Version compatibility required', {
      requestId: context.metrics.requestId,
      requestedVersion,
      currentVersion,
    });
  }

  return context;
};

// Create versioned API middleware stack
export const createVersionedApiMiddleware = () => {
  const { createApiMiddleware } = require('./index');
  
  return createApiMiddleware()
    .use(versioningMiddleware)
    .use(deprecationWarningMiddleware)
    .use(compatibilityMiddleware);
};

// Version-specific middleware factory
export const versionSpecificMiddleware = (
  versionHandlers: Record<string, MiddlewareFunction>
): MiddlewareFunction => {
  return async (context: MiddlewareContext): Promise<MiddlewareContext | NextResponse> => {
    const version = context.apiVersion;
    
    if (version && versionHandlers[version]) {
      return await versionHandlers[version](context);
    }

    // Use latest version handler as default
    const latestVersion = getSupportedVersions()[getSupportedVersions().length - 1];
    if (versionHandlers[latestVersion]) {
      return await versionHandlers[latestVersion](context);
    }

    return context;
  };
};

// Breaking change detection middleware
export const breakingChangeMiddleware: MiddlewareFunction = async (
  context: MiddlewareContext
): Promise<MiddlewareContext | NextResponse> => {
  const versionInfo = context.versionInfo;
  
  if (versionInfo?.breakingChanges.length) {
    // Log breaking change usage
    logger.info('API with breaking changes accessed', {
      requestId: context.metrics.requestId,
      version: context.apiVersion,
      breakingChanges: versionInfo.breakingChanges,
    });

    // Add breaking change warnings
    context.breakingChangeWarnings = versionInfo.breakingChanges.map(change => ({
      version: context.apiVersion!,
      change,
      impact: 'This change may affect your application behavior',
    }));
  }

  return context;
};

// Export all middleware functions
export {
  versioningMiddleware as default,
  versionedResponseMiddleware,
  deprecationWarningMiddleware,
  compatibilityMiddleware,
  createVersionedApiMiddleware,
  versionSpecificMiddleware,
  breakingChangeMiddleware,
};
