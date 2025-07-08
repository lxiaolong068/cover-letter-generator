// Real-time alerting system for monitoring critical events
import { logger, logSecurity } from './logging';
import { multiLevelCache, cacheKeys } from './cache';
import { getDashboardMetrics } from './metrics';

// Alert types and severity levels
export enum AlertType {
  ERROR_RATE_HIGH = 'error_rate_high',
  RESPONSE_TIME_HIGH = 'response_time_high',
  CACHE_HIT_RATE_LOW = 'cache_hit_rate_low',
  MEMORY_USAGE_HIGH = 'memory_usage_high',
  DATABASE_ERROR = 'database_error',
  AI_GENERATION_FAILURE = 'ai_generation_failure',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  SECURITY_INCIDENT = 'security_incident',
  SYSTEM_OVERLOAD = 'system_overload',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  resolved?: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface AlertRule {
  type: AlertType;
  severity: AlertSeverity;
  condition: (metrics: any) => boolean;
  title: string;
  messageTemplate: (metrics: any) => string;
  cooldownMinutes: number; // Minimum time between alerts of same type
  enabled: boolean;
}

// Alert notification channels
export interface NotificationChannel {
  name: string;
  type: 'email' | 'slack' | 'webhook' | 'console';
  config: Record<string, any>;
  enabled: boolean;
  severityFilter: AlertSeverity[];
}

class AlertingSystem {
  private alertRules: AlertRule[] = [];
  private notificationChannels: NotificationChannel[] = [];
  private activeAlerts = new Map<string, Alert>();
  private alertHistory: Alert[] = [];
  private monitoringInterval?: NodeJS.Timeout;

  constructor() {
    this.initializeDefaultRules();
    this.initializeDefaultChannels();
  }

  private initializeDefaultRules(): void {
    this.alertRules = [
      {
        type: AlertType.ERROR_RATE_HIGH,
        severity: AlertSeverity.CRITICAL,
        condition: (metrics) => metrics.api.errorRate > 0.05,
        title: 'High Error Rate Detected',
        messageTemplate: (metrics) => 
          `API error rate is ${(metrics.api.errorRate * 100).toFixed(2)}% (threshold: 5%)`,
        cooldownMinutes: 15,
        enabled: true,
      },
      {
        type: AlertType.RESPONSE_TIME_HIGH,
        severity: AlertSeverity.HIGH,
        condition: (metrics) => metrics.api.averageResponseTime > 2000,
        title: 'High Response Time',
        messageTemplate: (metrics) => 
          `Average response time is ${metrics.api.averageResponseTime.toFixed(0)}ms (threshold: 2000ms)`,
        cooldownMinutes: 10,
        enabled: true,
      },
      {
        type: AlertType.CACHE_HIT_RATE_LOW,
        severity: AlertSeverity.MEDIUM,
        condition: (metrics) => metrics.cache.hitRate < 0.3,
        title: 'Low Cache Hit Rate',
        messageTemplate: (metrics) => 
          `Cache hit rate is ${(metrics.cache.hitRate * 100).toFixed(1)}% (threshold: 30%)`,
        cooldownMinutes: 30,
        enabled: true,
      },
      {
        type: AlertType.MEMORY_USAGE_HIGH,
        severity: AlertSeverity.HIGH,
        condition: (metrics) => {
          const memoryUsage = process.memoryUsage();
          return (memoryUsage.heapUsed / memoryUsage.heapTotal) > 0.85;
        },
        title: 'High Memory Usage',
        messageTemplate: () => {
          const memoryUsage = process.memoryUsage();
          const percentage = ((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100).toFixed(1);
          return `Memory usage is ${percentage}% (threshold: 85%)`;
        },
        cooldownMinutes: 5,
        enabled: true,
      },
      {
        type: AlertType.AI_GENERATION_FAILURE,
        severity: AlertSeverity.HIGH,
        condition: (metrics) => metrics.aiGeneration.errorRate > 0.1,
        title: 'AI Generation Failures',
        messageTemplate: (metrics) => 
          `AI generation error rate is ${(metrics.aiGeneration.errorRate * 100).toFixed(1)}% (threshold: 10%)`,
        cooldownMinutes: 20,
        enabled: true,
      },
    ];
  }

  private initializeDefaultChannels(): void {
    this.notificationChannels = [
      {
        name: 'console',
        type: 'console',
        config: {},
        enabled: true,
        severityFilter: [AlertSeverity.LOW, AlertSeverity.MEDIUM, AlertSeverity.HIGH, AlertSeverity.CRITICAL],
      },
      // Add more channels as needed (email, Slack, etc.)
    ];
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async isInCooldown(alertType: AlertType, cooldownMinutes: number): Promise<boolean> {
    const cacheKey = cacheKeys.config(`alert_cooldown:${alertType}`);
    const lastAlert = await multiLevelCache.get(cacheKey);
    
    if (lastAlert) {
      const cooldownEnd = new Date(lastAlert).getTime() + (cooldownMinutes * 60 * 1000);
      return Date.now() < cooldownEnd;
    }
    
    return false;
  }

  private async setCooldown(alertType: AlertType, cooldownMinutes: number): Promise<void> {
    const cacheKey = cacheKeys.config(`alert_cooldown:${alertType}`);
    await multiLevelCache.set(cacheKey, new Date().toISOString(), {
      memory: cooldownMinutes * 60 * 1000,
      redis: cooldownMinutes * 60 * 1000,
    });
  }

  private async sendNotification(alert: Alert): Promise<void> {
    for (const channel of this.notificationChannels) {
      if (!channel.enabled || !channel.severityFilter.includes(alert.severity)) {
        continue;
      }

      try {
        switch (channel.type) {
          case 'console':
            console.warn(`🚨 ALERT [${alert.severity.toUpperCase()}]: ${alert.title} - ${alert.message}`);
            break;
          
          case 'email':
            // Implement email notification
            logger.info('Email alert sent', { alertId: alert.id, channel: channel.name });
            break;
          
          case 'slack':
            // Implement Slack notification
            logger.info('Slack alert sent', { alertId: alert.id, channel: channel.name });
            break;
          
          case 'webhook':
            // Implement webhook notification
            logger.info('Webhook alert sent', { alertId: alert.id, channel: channel.name });
            break;
        }
      } catch (error) {
        logger.error('Failed to send alert notification', {
          alertId: alert.id,
          channel: channel.name,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  async createAlert(
    type: AlertType,
    severity: AlertSeverity,
    title: string,
    message: string,
    metadata?: Record<string, any>
  ): Promise<Alert> {
    const alert: Alert = {
      id: this.generateAlertId(),
      type,
      severity,
      title,
      message,
      timestamp: new Date(),
      metadata,
      resolved: false,
    };

    // Store alert
    this.activeAlerts.set(alert.id, alert);
    this.alertHistory.push(alert);

    // Send notifications
    await this.sendNotification(alert);

    // Log alert
    logger.warn('Alert created', {
      alertId: alert.id,
      type: alert.type,
      severity: alert.severity,
      title: alert.title,
      message: alert.message,
    });

    return alert;
  }

  async resolveAlert(alertId: string, resolvedBy?: string): Promise<boolean> {
    const alert = this.activeAlerts.get(alertId);
    if (!alert) return false;

    alert.resolved = true;
    alert.resolvedAt = new Date();
    alert.resolvedBy = resolvedBy;

    this.activeAlerts.delete(alertId);

    logger.info('Alert resolved', {
      alertId,
      resolvedBy,
      duration: alert.resolvedAt.getTime() - alert.timestamp.getTime(),
    });

    return true;
  }

  async checkAlertRules(): Promise<void> {
    try {
      const metrics = await getDashboardMetrics();

      for (const rule of this.alertRules) {
        if (!rule.enabled) continue;

        // Check if rule condition is met
        if (rule.condition(metrics)) {
          // Check cooldown
          const inCooldown = await this.isInCooldown(rule.type, rule.cooldownMinutes);
          if (inCooldown) continue;

          // Create alert
          await this.createAlert(
            rule.type,
            rule.severity,
            rule.title,
            rule.messageTemplate(metrics),
            { metrics }
          );

          // Set cooldown
          await this.setCooldown(rule.type, rule.cooldownMinutes);
        }
      }
    } catch (error) {
      logger.error('Failed to check alert rules', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  startMonitoring(intervalMinutes: number = 1): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(() => {
      this.checkAlertRules();
    }, intervalMinutes * 60 * 1000);

    logger.info('Alert monitoring started', { intervalMinutes });
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }

    logger.info('Alert monitoring stopped');
  }

  getActiveAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values());
  }

  getAlertHistory(limit: number = 100): Alert[] {
    return this.alertHistory.slice(-limit);
  }

  getAlertStats(): {
    active: number;
    total: number;
    bySeverity: Record<AlertSeverity, number>;
    byType: Record<AlertType, number>;
  } {
    const bySeverity = Object.values(AlertSeverity).reduce((acc, severity) => {
      acc[severity] = this.alertHistory.filter(a => a.severity === severity).length;
      return acc;
    }, {} as Record<AlertSeverity, number>);

    const byType = Object.values(AlertType).reduce((acc, type) => {
      acc[type] = this.alertHistory.filter(a => a.type === type).length;
      return acc;
    }, {} as Record<AlertType, number>);

    return {
      active: this.activeAlerts.size,
      total: this.alertHistory.length,
      bySeverity,
      byType,
    };
  }
}

// Create singleton instance
export const alertingSystem = new AlertingSystem();

// Convenience functions
export const createAlert = (
  type: AlertType,
  severity: AlertSeverity,
  title: string,
  message: string,
  metadata?: Record<string, any>
) => alertingSystem.createAlert(type, severity, title, message, metadata);

export const resolveAlert = (alertId: string, resolvedBy?: string) => 
  alertingSystem.resolveAlert(alertId, resolvedBy);

export const startAlertMonitoring = (intervalMinutes?: number) => 
  alertingSystem.startMonitoring(intervalMinutes);

export const stopAlertMonitoring = () => alertingSystem.stopMonitoring();

export const getActiveAlerts = () => alertingSystem.getActiveAlerts();

export const getAlertHistory = (limit?: number) => alertingSystem.getAlertHistory(limit);

export const getAlertStats = () => alertingSystem.getAlertStats();
