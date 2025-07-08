// Data encryption service for sensitive information
import crypto from 'crypto';
import { logger } from './logging';

// Encryption configuration
const ENCRYPTION_CONFIG = {
  algorithm: 'aes-256-cbc',
  keyLength: 32, // 256 bits
  ivLength: 16, // 128 bits
  saltLength: 32, // 256 bits
};

// Environment variables for encryption keys
const MASTER_KEY = process.env.ENCRYPTION_MASTER_KEY;
const FIELD_ENCRYPTION_KEY = process.env.FIELD_ENCRYPTION_KEY;

if (!MASTER_KEY || !FIELD_ENCRYPTION_KEY) {
  logger.warn('Encryption keys not configured - encryption will be disabled');
}

// Encrypted data structure
export interface EncryptedData {
  encrypted: string;
  iv: string;
  salt?: string;
}

// Field encryption metadata
export interface FieldEncryptionMetadata {
  field: string;
  encrypted: boolean;
  algorithm: string;
  keyVersion: string;
  encryptedAt: Date;
}

class EncryptionService {
  private masterKey: Buffer | null = null;
  private fieldKey: Buffer | null = null;

  constructor() {
    this.initializeKeys();
  }

  private initializeKeys(): void {
    try {
      if (MASTER_KEY) {
        this.masterKey = Buffer.from(MASTER_KEY, 'hex');
        if (this.masterKey.length !== ENCRYPTION_CONFIG.keyLength) {
          throw new Error(`Master key must be ${ENCRYPTION_CONFIG.keyLength} bytes`);
        }
      }

      if (FIELD_ENCRYPTION_KEY) {
        this.fieldKey = Buffer.from(FIELD_ENCRYPTION_KEY, 'hex');
        if (this.fieldKey.length !== ENCRYPTION_CONFIG.keyLength) {
          throw new Error(`Field key must be ${ENCRYPTION_CONFIG.keyLength} bytes`);
        }
      }

      logger.info('Encryption service initialized', {
        masterKeyAvailable: !!this.masterKey,
        fieldKeyAvailable: !!this.fieldKey,
      });
    } catch (error) {
      logger.error('Failed to initialize encryption keys', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Generate a random key
  generateKey(): string {
    return crypto.randomBytes(ENCRYPTION_CONFIG.keyLength).toString('hex');
  }

  // Derive key from password using PBKDF2
  deriveKey(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(password, salt, 100000, ENCRYPTION_CONFIG.keyLength, 'sha256');
  }

  // Encrypt data with master key
  encryptWithMasterKey(data: string): EncryptedData | null {
    if (!this.masterKey) {
      logger.warn('Master key not available for encryption');
      return null;
    }

    try {
      const iv = crypto.randomBytes(ENCRYPTION_CONFIG.ivLength);
      const cipher = crypto.createCipheriv(ENCRYPTION_CONFIG.algorithm, this.masterKey, iv);

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      return {
        encrypted,
        iv: iv.toString('hex'),
      };
    } catch (error) {
      logger.error('Encryption with master key failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  // Decrypt data with master key
  decryptWithMasterKey(encryptedData: EncryptedData): string | null {
    if (!this.masterKey) {
      logger.warn('Master key not available for decryption');
      return null;
    }

    try {
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const decipher = crypto.createDecipheriv(ENCRYPTION_CONFIG.algorithm, this.masterKey, iv);

      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      logger.error('Decryption with master key failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  // Encrypt sensitive field data
  encryptField(data: string, fieldName: string): EncryptedData | null {
    if (!this.fieldKey) {
      logger.warn('Field key not available for encryption', { fieldName });
      return null;
    }

    try {
      const iv = crypto.randomBytes(ENCRYPTION_CONFIG.ivLength);
      const cipher = crypto.createCipheriv(ENCRYPTION_CONFIG.algorithm, this.fieldKey, iv);

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      logger.debug('Field encrypted successfully', { fieldName });

      return {
        encrypted,
        iv: iv.toString('hex'),
      };
    } catch (error) {
      logger.error('Field encryption failed', {
        fieldName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  // Decrypt sensitive field data
  decryptField(encryptedData: EncryptedData, fieldName: string): string | null {
    if (!this.fieldKey) {
      logger.warn('Field key not available for decryption', { fieldName });
      return null;
    }

    try {
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const decipher = crypto.createDecipheriv(ENCRYPTION_CONFIG.algorithm, this.fieldKey, iv);

      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      logger.debug('Field decrypted successfully', { fieldName });

      return decrypted;
    } catch (error) {
      logger.error('Field decryption failed', {
        fieldName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  // Encrypt data with password-derived key
  encryptWithPassword(data: string, password: string): EncryptedData | null {
    try {
      const salt = crypto.randomBytes(ENCRYPTION_CONFIG.saltLength);
      const key = this.deriveKey(password, salt);
      const iv = crypto.randomBytes(ENCRYPTION_CONFIG.ivLength);

      const cipher = crypto.createCipheriv(ENCRYPTION_CONFIG.algorithm, key, iv);

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      return {
        encrypted,
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
      };
    } catch (error) {
      logger.error('Password-based encryption failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  // Decrypt data with password-derived key
  decryptWithPassword(encryptedData: EncryptedData, password: string): string | null {
    if (!encryptedData.salt) {
      logger.error('Salt missing for password-based decryption');
      return null;
    }

    try {
      const salt = Buffer.from(encryptedData.salt, 'hex');
      const key = this.deriveKey(password, salt);
      const iv = Buffer.from(encryptedData.iv, 'hex');

      const decipher = crypto.createDecipheriv(ENCRYPTION_CONFIG.algorithm, key, iv);

      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      logger.error('Password-based decryption failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  // Hash sensitive data (one-way)
  hashData(data: string, salt?: string): { hash: string; salt: string } {
    const saltBuffer = salt
      ? Buffer.from(salt, 'hex')
      : crypto.randomBytes(ENCRYPTION_CONFIG.saltLength);
    const hash = crypto.pbkdf2Sync(data, saltBuffer, 100000, 64, 'sha256');

    return {
      hash: hash.toString('hex'),
      salt: saltBuffer.toString('hex'),
    };
  }

  // Verify hashed data
  verifyHash(data: string, hash: string, salt: string): boolean {
    try {
      const { hash: computedHash } = this.hashData(data, salt);
      return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedHash, 'hex'));
    } catch (error) {
      logger.error('Hash verification failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  // Check if encryption is available
  isEncryptionAvailable(): boolean {
    return !!(this.masterKey && this.fieldKey);
  }

  // Get encryption status
  getEncryptionStatus(): {
    available: boolean;
    masterKey: boolean;
    fieldKey: boolean;
    algorithm: string;
  } {
    return {
      available: this.isEncryptionAvailable(),
      masterKey: !!this.masterKey,
      fieldKey: !!this.fieldKey,
      algorithm: ENCRYPTION_CONFIG.algorithm,
    };
  }
}

// Create singleton instance
export const encryptionService = new EncryptionService();

// Convenience functions
export const encryptWithMasterKey = (data: string) => encryptionService.encryptWithMasterKey(data);
export const decryptWithMasterKey = (encryptedData: EncryptedData) =>
  encryptionService.decryptWithMasterKey(encryptedData);
export const encryptField = (data: string, fieldName: string) =>
  encryptionService.encryptField(data, fieldName);
export const decryptField = (encryptedData: EncryptedData, fieldName: string) =>
  encryptionService.decryptField(encryptedData, fieldName);
export const encryptWithPassword = (data: string, password: string) =>
  encryptionService.encryptWithPassword(data, password);
export const decryptWithPassword = (encryptedData: EncryptedData, password: string) =>
  encryptionService.decryptWithPassword(encryptedData, password);
export const hashData = (data: string, salt?: string) => encryptionService.hashData(data, salt);
export const verifyHash = (data: string, hash: string, salt: string) =>
  encryptionService.verifyHash(data, hash, salt);
export const isEncryptionAvailable = () => encryptionService.isEncryptionAvailable();
export const getEncryptionStatus = () => encryptionService.getEncryptionStatus();
