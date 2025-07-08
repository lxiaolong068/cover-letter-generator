// Secure data access layer with encryption and audit logging
import { encryptField, decryptField, EncryptedData, isEncryptionAvailable } from './encryption';
import { logDataAccess, logDataModification } from './logging';
import { executeQuery } from './neon';
import { logger } from './logging';

// Sensitive field configuration
export interface SensitiveFieldConfig {
  tableName: string;
  fieldName: string;
  encryptionRequired: boolean;
  auditAccess: boolean;
  auditModification: boolean;
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
}

// Default sensitive field configurations
const SENSITIVE_FIELDS: SensitiveFieldConfig[] = [
  {
    tableName: 'users',
    fieldName: 'email',
    encryptionRequired: false, // Email needs to be searchable
    auditAccess: true,
    auditModification: true,
    dataClassification: 'confidential',
  },
  {
    tableName: 'users',
    fieldName: 'password',
    encryptionRequired: true,
    auditAccess: true,
    auditModification: true,
    dataClassification: 'restricted',
  },
  {
    tableName: 'users',
    fieldName: 'mfa_config',
    encryptionRequired: true,
    auditAccess: true,
    auditModification: true,
    dataClassification: 'restricted',
  },
  {
    tableName: 'cover_letters',
    fieldName: 'content',
    encryptionRequired: false, // Content needs to be searchable
    auditAccess: true,
    auditModification: true,
    dataClassification: 'confidential',
  },
  {
    tableName: 'cover_letters',
    fieldName: 'job_description',
    encryptionRequired: false,
    auditAccess: true,
    auditModification: true,
    dataClassification: 'confidential',
  },
  {
    tableName: 'cover_letters',
    fieldName: 'user_profile',
    encryptionRequired: true,
    auditAccess: true,
    auditModification: true,
    dataClassification: 'confidential',
  },
];

// Audit context for tracking access
export interface AuditContext {
  userId?: string;
  ip?: string;
  userAgent?: string;
  action: string;
  metadata?: Record<string, any>;
}

class SecureDataService {
  private sensitiveFields: Map<string, SensitiveFieldConfig> = new Map();

  constructor() {
    this.initializeSensitiveFields();
  }

  private initializeSensitiveFields(): void {
    for (const config of SENSITIVE_FIELDS) {
      const key = `${config.tableName}.${config.fieldName}`;
      this.sensitiveFields.set(key, config);
    }

    logger.info('Secure data service initialized', {
      sensitiveFieldCount: this.sensitiveFields.size,
      encryptionAvailable: isEncryptionAvailable(),
    });
  }

  private getSensitiveFieldConfig(tableName: string, fieldName: string): SensitiveFieldConfig | null {
    const key = `${tableName}.${fieldName}`;
    return this.sensitiveFields.get(key) || null;
  }

  // Encrypt sensitive data before storage
  private encryptSensitiveData(tableName: string, data: Record<string, any>): Record<string, any> {
    const encryptedData = { ...data };

    for (const [fieldName, value] of Object.entries(data)) {
      const config = this.getSensitiveFieldConfig(tableName, fieldName);
      
      if (config?.encryptionRequired && value !== null && value !== undefined) {
        if (!isEncryptionAvailable()) {
          logger.warn('Encryption required but not available', {
            tableName,
            fieldName,
            dataClassification: config.dataClassification,
          });
          continue;
        }

        const encrypted = encryptField(String(value), fieldName);
        if (encrypted) {
          encryptedData[fieldName] = JSON.stringify(encrypted);
          logger.debug('Field encrypted for storage', { tableName, fieldName });
        } else {
          logger.error('Failed to encrypt sensitive field', { tableName, fieldName });
        }
      }
    }

    return encryptedData;
  }

  // Decrypt sensitive data after retrieval
  private decryptSensitiveData(tableName: string, data: Record<string, any>): Record<string, any> {
    const decryptedData = { ...data };

    for (const [fieldName, value] of Object.entries(data)) {
      const config = this.getSensitiveFieldConfig(tableName, fieldName);
      
      if (config?.encryptionRequired && value !== null && value !== undefined) {
        try {
          const encryptedData: EncryptedData = JSON.parse(String(value));
          const decrypted = decryptField(encryptedData, fieldName);
          
          if (decrypted !== null) {
            decryptedData[fieldName] = decrypted;
            logger.debug('Field decrypted from storage', { tableName, fieldName });
          } else {
            logger.error('Failed to decrypt sensitive field', { tableName, fieldName });
          }
        } catch (error) {
          logger.error('Invalid encrypted data format', {
            tableName,
            fieldName,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }

    return decryptedData;
  }

  // Audit data access
  private auditDataAccess(
    tableName: string,
    resourceId: string,
    action: 'read' | 'list' | 'search',
    context: AuditContext,
    success: boolean,
    errorMessage?: string
  ): void {
    logDataAccess({
      userId: context.userId,
      resourceType: tableName,
      resourceId,
      action,
      success,
      ip: context.ip,
      userAgent: context.userAgent,
      metadata: {
        ...context.metadata,
        dataClassification: this.getTableDataClassification(tableName),
      },
      errorMessage,
    });
  }

  // Audit data modification
  private auditDataModification(
    tableName: string,
    resourceId: string,
    action: 'create' | 'update' | 'delete',
    context: AuditContext,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
    success: boolean = true,
    errorMessage?: string
  ): void {
    // Filter sensitive data from audit logs
    const filteredOldValues = this.filterSensitiveDataForAudit(tableName, oldValues);
    const filteredNewValues = this.filterSensitiveDataForAudit(tableName, newValues);

    logDataModification({
      userId: context.userId,
      resourceType: tableName,
      resourceId,
      action,
      oldValues: filteredOldValues,
      newValues: filteredNewValues,
      success,
      ip: context.ip,
      userAgent: context.userAgent,
      metadata: {
        ...context.metadata,
        dataClassification: this.getTableDataClassification(tableName),
      },
      errorMessage,
    });
  }

  // Filter sensitive data for audit logs
  private filterSensitiveDataForAudit(tableName: string, data?: Record<string, any>): Record<string, any> | undefined {
    if (!data) return undefined;

    const filtered = { ...data };

    for (const [fieldName, value] of Object.entries(data)) {
      const config = this.getSensitiveFieldConfig(tableName, fieldName);
      
      if (config && config.dataClassification === 'restricted') {
        // Don't log restricted data values, just indicate they were changed
        filtered[fieldName] = value !== null && value !== undefined ? '[REDACTED]' : null;
      } else if (config && config.dataClassification === 'confidential') {
        // Hash confidential data for audit trail
        if (value !== null && value !== undefined) {
          const hash = require('crypto').createHash('sha256').update(String(value)).digest('hex');
          filtered[fieldName] = `[HASH:${hash.substring(0, 8)}]`;
        }
      }
    }

    return filtered;
  }

  // Get table data classification
  private getTableDataClassification(tableName: string): string {
    const classifications = Array.from(this.sensitiveFields.values())
      .filter(config => config.tableName === tableName)
      .map(config => config.dataClassification);

    if (classifications.includes('restricted')) return 'restricted';
    if (classifications.includes('confidential')) return 'confidential';
    if (classifications.includes('internal')) return 'internal';
    return 'public';
  }

  // Secure data insertion
  async secureInsert<T>(
    tableName: string,
    data: Record<string, any>,
    context: AuditContext,
    options: {
      returning?: string;
      auditEnabled?: boolean;
    } = {}
  ): Promise<T[]> {
    const { returning = '*', auditEnabled = true } = options;

    try {
      // Encrypt sensitive data
      const encryptedData = this.encryptSensitiveData(tableName, data);

      // Build insert query
      const columns = Object.keys(encryptedData);
      const values = Object.values(encryptedData);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

      const query = `
        INSERT INTO ${tableName} (${columns.join(', ')})
        VALUES (${placeholders})
        RETURNING ${returning}
      `;

      const result = await executeQuery<T>(query, values, { logQuery: true });

      // Decrypt result if needed
      const decryptedResult = result.map(row => 
        this.decryptSensitiveData(tableName, row as any)
      ) as T[];

      // Audit the operation
      if (auditEnabled) {
        const resourceId = (result[0] as any)?.id || 'unknown';
        this.auditDataModification(
          tableName,
          resourceId,
          'create',
          context,
          undefined,
          data,
          true
        );
      }

      return decryptedResult;
    } catch (error) {
      // Audit the failed operation
      if (auditEnabled) {
        this.auditDataModification(
          tableName,
          'unknown',
          'create',
          context,
          undefined,
          data,
          false,
          error instanceof Error ? error.message : 'Unknown error'
        );
      }

      throw error;
    }
  }

  // Secure data selection
  async secureSelect<T>(
    tableName: string,
    whereClause: string,
    params: any[],
    context: AuditContext,
    options: {
      columns?: string;
      auditEnabled?: boolean;
    } = {}
  ): Promise<T[]> {
    const { columns = '*', auditEnabled = true } = options;

    try {
      const query = `SELECT ${columns} FROM ${tableName} WHERE ${whereClause}`;
      const result = await executeQuery<T>(query, params, { logQuery: true });

      // Decrypt sensitive data
      const decryptedResult = result.map(row => 
        this.decryptSensitiveData(tableName, row as any)
      ) as T[];

      // Audit the access
      if (auditEnabled) {
        const resourceIds = result.map(row => (row as any)?.id || 'unknown').join(',');
        this.auditDataAccess(
          tableName,
          resourceIds,
          'read',
          context,
          true
        );
      }

      return decryptedResult;
    } catch (error) {
      // Audit the failed access
      if (auditEnabled) {
        this.auditDataAccess(
          tableName,
          'unknown',
          'read',
          context,
          false,
          error instanceof Error ? error.message : 'Unknown error'
        );
      }

      throw error;
    }
  }

  // Secure data update
  async secureUpdate<T>(
    tableName: string,
    updates: Record<string, any>,
    whereClause: string,
    params: any[],
    context: AuditContext,
    options: {
      returning?: string;
      auditEnabled?: boolean;
    } = {}
  ): Promise<T[]> {
    const { returning = '*', auditEnabled = true } = options;

    try {
      // Get old values for audit
      let oldValues: Record<string, any> | undefined;
      if (auditEnabled) {
        const oldData = await this.secureSelect(tableName, whereClause, params, context, { auditEnabled: false });
        oldValues = oldData[0] as any;
      }

      // Encrypt sensitive data in updates
      const encryptedUpdates = this.encryptSensitiveData(tableName, updates);

      // Build update query
      const setClause = Object.keys(encryptedUpdates)
        .map((key, index) => `${key} = $${params.length + index + 1}`)
        .join(', ');

      const updateValues = [...params, ...Object.values(encryptedUpdates)];

      const query = `
        UPDATE ${tableName}
        SET ${setClause}
        WHERE ${whereClause}
        RETURNING ${returning}
      `;

      const result = await executeQuery<T>(query, updateValues, { logQuery: true });

      // Decrypt result
      const decryptedResult = result.map(row => 
        this.decryptSensitiveData(tableName, row as any)
      ) as T[];

      // Audit the operation
      if (auditEnabled) {
        const resourceId = (result[0] as any)?.id || 'unknown';
        this.auditDataModification(
          tableName,
          resourceId,
          'update',
          context,
          oldValues,
          updates,
          true
        );
      }

      return decryptedResult;
    } catch (error) {
      // Audit the failed operation
      if (auditEnabled) {
        this.auditDataModification(
          tableName,
          'unknown',
          'update',
          context,
          undefined,
          updates,
          false,
          error instanceof Error ? error.message : 'Unknown error'
        );
      }

      throw error;
    }
  }

  // Get sensitive field configurations
  getSensitiveFieldConfigs(): SensitiveFieldConfig[] {
    return Array.from(this.sensitiveFields.values());
  }

  // Add or update sensitive field configuration
  addSensitiveField(config: SensitiveFieldConfig): void {
    const key = `${config.tableName}.${config.fieldName}`;
    this.sensitiveFields.set(key, config);
    
    logger.info('Sensitive field configuration added', {
      tableName: config.tableName,
      fieldName: config.fieldName,
      dataClassification: config.dataClassification,
    });
  }
}

// Create singleton instance
export const secureDataService = new SecureDataService();

// Convenience functions
export const secureInsert = <T>(
  tableName: string,
  data: Record<string, any>,
  context: AuditContext,
  options?: Parameters<typeof secureDataService.secureInsert>[3]
) => secureDataService.secureInsert<T>(tableName, data, context, options);

export const secureSelect = <T>(
  tableName: string,
  whereClause: string,
  params: any[],
  context: AuditContext,
  options?: Parameters<typeof secureDataService.secureSelect>[4]
) => secureDataService.secureSelect<T>(tableName, whereClause, params, context, options);

export const secureUpdate = <T>(
  tableName: string,
  updates: Record<string, any>,
  whereClause: string,
  params: any[],
  context: AuditContext,
  options?: Parameters<typeof secureDataService.secureUpdate>[5]
) => secureDataService.secureUpdate<T>(tableName, updates, whereClause, params, context, options);
