// Enhanced logging system for comprehensive monitoring
import { createLogger, format, transports, Logger } from 'winston';
import { NextRequest } from 'next/server';

// Log levels and configuration
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  DEBUG = 'debug',
}

// Log context interface
export interface LogContext {
  requestId?: string;
  userId?: string;
  userAgent?: string;
  ip?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  error?: Error | string;
  metadata?: Record<string, any>;
  [key: string]: any;
}

// Performance metrics interface
export interface PerformanceMetrics {
  requestId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  duration: number;
  timestamp: Date;
  userId?: string;
  userTier?: string;
  cacheHit?: boolean;
  dbQueryTime?: number;
  aiGenerationTime?: number;
  memoryUsage?: NodeJS.MemoryUsage;
}

// Security event interface
export interface SecurityEvent {
  type:
    | 'auth_failure'
    | 'auth_success'
    | 'rate_limit_exceeded'
    | 'suspicious_activity'
    | 'data_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ip: string;
  userAgent: string;
  details: Record<string, any>;
  timestamp: Date;
}

// Business metrics interface
export interface BusinessMetrics {
  event: 'cover_letter_generated' | 'user_registered' | 'subscription_upgraded' | 'api_call';
  userId?: string;
  userTier?: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

class EnhancedLogger {
  private logger: Logger;
  private performanceLogger: Logger;
  private securityLogger: Logger;
  private businessLogger: Logger;

  constructor() {
    // Main application logger
    this.logger = createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          return JSON.stringify({
            timestamp,
            level,
            message,
            ...meta,
          });
        })
      ),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
        // In production, add file transports or external logging services
        ...(process.env.NODE_ENV === 'production'
          ? [
              new transports.File({ filename: 'logs/error.log', level: 'error' }),
              new transports.File({ filename: 'logs/combined.log' }),
            ]
          : []),
      ],
    });

    // Performance metrics logger
    this.performanceLogger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.Console({ level: 'info' }),
        ...(process.env.NODE_ENV === 'production'
          ? [new transports.File({ filename: 'logs/performance.log' })]
          : []),
      ],
    });

    // Security events logger
    this.securityLogger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.Console({ level: 'warn' }),
        ...(process.env.NODE_ENV === 'production'
          ? [new transports.File({ filename: 'logs/security.log' })]
          : []),
      ],
    });

    // Business metrics logger
    this.businessLogger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.Console({ level: 'info' }),
        ...(process.env.NODE_ENV === 'production'
          ? [new transports.File({ filename: 'logs/business.log' })]
          : []),
      ],
    });
  }

  // Generate unique request ID
  generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Extract context from request
  extractRequestContext(req: NextRequest, requestId?: string): LogContext {
    return {
      requestId: requestId || this.generateRequestId(),
      method: req.method,
      url: req.url,
      userAgent: req.headers.get('user-agent') || undefined,
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    };
  }

  // Standard logging methods
  error(message: string, context?: LogContext): void {
    this.logger.error(message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, context);
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, context);
  }

  // HTTP request logging
  logRequest(req: NextRequest, context?: Partial<LogContext>): string {
    const requestId = this.generateRequestId();
    const requestContext = {
      ...this.extractRequestContext(req, requestId),
      ...context,
    };

    this.logger.info('HTTP Request', requestContext);
    return requestId;
  }

  logResponse(
    requestId: string,
    statusCode: number,
    duration: number,
    context?: Partial<LogContext>
  ): void {
    this.logger.info('HTTP Response', {
      requestId,
      statusCode,
      duration,
      ...context,
    });
  }

  // Performance metrics logging
  logPerformanceMetrics(metrics: PerformanceMetrics): void {
    this.performanceLogger.info('Performance Metrics', metrics);
  }

  // Security event logging
  logSecurityEvent(event: SecurityEvent): void {
    this.securityLogger.warn('Security Event', event);
  }

  // Business metrics logging
  logBusinessMetrics(metrics: BusinessMetrics): void {
    this.businessLogger.info('Business Metrics', metrics);
  }

  // AI generation logging
  logAiGeneration(data: {
    requestId: string;
    userId?: string;
    model: string;
    tokensUsed?: number;
    generationTime: number;
    success: boolean;
    error?: string;
  }): void {
    this.info('AI Generation', {
      requestId: data.requestId,
      userId: data.userId,
      metadata: {
        model: data.model,
        tokensUsed: data.tokensUsed,
        generationTime: data.generationTime,
        success: data.success,
        error: data.error,
      },
    });

    // Also log as business metrics
    this.logBusinessMetrics({
      event: 'cover_letter_generated',
      userId: data.userId,
      metadata: {
        model: data.model,
        tokensUsed: data.tokensUsed,
        generationTime: data.generationTime,
        success: data.success,
      },
      timestamp: new Date(),
    });
  }

  // Database operation logging
  logDatabaseOperation(data: {
    requestId: string;
    operation: string;
    table: string;
    duration: number;
    success: boolean;
    error?: string;
  }): void {
    this.debug('Database Operation', {
      requestId: data.requestId,
      metadata: data,
    });
  }

  // Cache operation logging
  logCacheOperation(data: {
    operation: 'get' | 'set' | 'delete' | 'clear';
    key: string;
    hit?: boolean;
    level?: 'memory' | 'redis' | 'multi';
    duration?: number;
  }): void {
    this.debug('Cache Operation', {
      metadata: data,
    });
  }
}

// Create singleton instance
export const logger = new EnhancedLogger();

// Convenience functions
export const logRequest = (req: NextRequest, context?: Partial<LogContext>) =>
  logger.logRequest(req, context);

export const logResponse = (
  requestId: string,
  statusCode: number,
  duration: number,
  context?: Partial<LogContext>
) => logger.logResponse(requestId, statusCode, duration, context);

export const logError = (message: string, context?: LogContext) => logger.error(message, context);

export const logInfo = (message: string, context?: LogContext) => logger.info(message, context);

export const logPerformance = (metrics: PerformanceMetrics) =>
  logger.logPerformanceMetrics(metrics);

export const logSecurity = (event: SecurityEvent) => logger.logSecurityEvent(event);

export const logBusiness = (metrics: BusinessMetrics) => logger.logBusinessMetrics(metrics);

// Audit logging interfaces and functions
export interface AuditEvent {
  eventType:
    | 'data_access'
    | 'data_modification'
    | 'user_action'
    | 'system_action'
    | 'security_event';
  action: string;
  userId?: string;
  targetUserId?: string;
  resourceType?: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}

class AuditLogger {
  private auditLogger: Logger;

  constructor() {
    this.auditLogger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          return JSON.stringify({
            timestamp,
            level,
            message,
            audit: true,
            ...meta,
          });
        })
      ),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
        // In production, add dedicated audit log files or external audit services
        ...(process.env.NODE_ENV === 'production'
          ? [new transports.File({ filename: 'logs/audit.log' })]
          : []),
      ],
    });
  }

  logAuditEvent(event: AuditEvent): void {
    this.auditLogger.info('Audit Event', {
      eventType: event.eventType,
      action: event.action,
      userId: event.userId,
      targetUserId: event.targetUserId,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      oldValues: event.oldValues,
      newValues: event.newValues,
      metadata: event.metadata,
      ip: event.ip,
      userAgent: event.userAgent,
      timestamp: event.timestamp.toISOString(),
      success: event.success,
      errorMessage: event.errorMessage,
    });
  }

  // Data access audit
  logDataAccess(data: {
    userId?: string;
    resourceType: string;
    resourceId: string;
    action: 'read' | 'list' | 'search';
    success: boolean;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
    errorMessage?: string;
  }): void {
    this.logAuditEvent({
      eventType: 'data_access',
      action: data.action,
      userId: data.userId,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      metadata: data.metadata,
      ip: data.ip,
      userAgent: data.userAgent,
      timestamp: new Date(),
      success: data.success,
      errorMessage: data.errorMessage,
    });
  }

  // Data modification audit
  logDataModification(data: {
    userId?: string;
    resourceType: string;
    resourceId: string;
    action: 'create' | 'update' | 'delete';
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    success: boolean;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
    errorMessage?: string;
  }): void {
    this.logAuditEvent({
      eventType: 'data_modification',
      action: data.action,
      userId: data.userId,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      oldValues: data.oldValues,
      newValues: data.newValues,
      metadata: data.metadata,
      ip: data.ip,
      userAgent: data.userAgent,
      timestamp: new Date(),
      success: data.success,
      errorMessage: data.errorMessage,
    });
  }

  // User action audit
  logUserAction(data: {
    userId: string;
    action: string;
    targetUserId?: string;
    success: boolean;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
    errorMessage?: string;
  }): void {
    this.logAuditEvent({
      eventType: 'user_action',
      action: data.action,
      userId: data.userId,
      targetUserId: data.targetUserId,
      metadata: data.metadata,
      ip: data.ip,
      userAgent: data.userAgent,
      timestamp: new Date(),
      success: data.success,
      errorMessage: data.errorMessage,
    });
  }

  // System action audit
  logSystemAction(data: {
    action: string;
    resourceType?: string;
    resourceId?: string;
    success: boolean;
    metadata?: Record<string, any>;
    errorMessage?: string;
  }): void {
    this.logAuditEvent({
      eventType: 'system_action',
      action: data.action,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      metadata: data.metadata,
      timestamp: new Date(),
      success: data.success,
      errorMessage: data.errorMessage,
    });
  }
}

// Create audit logger instance
const auditLogger = new AuditLogger();

// Export audit logging functions
export const logAuditEvent = (event: AuditEvent) => auditLogger.logAuditEvent(event);
export const logDataAccess = (data: Parameters<typeof auditLogger.logDataAccess>[0]) =>
  auditLogger.logDataAccess(data);
export const logDataModification = (data: Parameters<typeof auditLogger.logDataModification>[0]) =>
  auditLogger.logDataModification(data);
export const logUserAction = (data: Parameters<typeof auditLogger.logUserAction>[0]) =>
  auditLogger.logUserAction(data);
export const logSystemAction = (data: Parameters<typeof auditLogger.logSystemAction>[0]) =>
  auditLogger.logSystemAction(data);
