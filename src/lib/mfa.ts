// Multi-Factor Authentication (MFA) system
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import crypto from 'crypto';
import { multiLevelCache, cacheKeys } from './cache';
import { logger, logSecurity } from './logging';
import { getUserById, updateUser } from './neon';

// MFA method types
export enum MFAMethod {
  TOTP = 'totp',
  SMS = 'sms',
  EMAIL = 'email',
}

// MFA interfaces
export interface MFASecret {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface MFAVerification {
  userId: string;
  method: MFAMethod;
  code: string;
  timestamp: Date;
  verified: boolean;
  attempts: number;
}

export interface MFAConfig {
  enabled: boolean;
  methods: MFAMethod[];
  totpSecret?: string;
  phoneNumber?: string;
  emailAddress?: string;
  backupCodes?: string[];
  lastUsed?: Date;
}

// Configuration
const MFA_CONFIG = {
  totp: {
    issuer: process.env.MFA_ISSUER || 'AI Cover Letter Generator',
    window: 2, // Allow 2 time windows (60 seconds each)
  },
  sms: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_FROM_NUMBER,
  },
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || 'noreply@coverletter.ai',
  },
  verification: {
    codeLength: 6,
    expiryMinutes: 10,
    maxAttempts: 3,
    cooldownMinutes: 15,
  },
};

class MFAService {
  private twilioClient?: twilio.Twilio;
  private emailTransporter?: nodemailer.Transporter;

  constructor() {
    this.initializeServices();
  }

  private initializeServices(): void {
    // Initialize Twilio for SMS
    if (MFA_CONFIG.sms.accountSid && MFA_CONFIG.sms.authToken) {
      this.twilioClient = twilio(MFA_CONFIG.sms.accountSid, MFA_CONFIG.sms.authToken);
    }

    // Initialize email transporter
    if (MFA_CONFIG.email.host && MFA_CONFIG.email.user) {
      this.emailTransporter = nodemailer.createTransporter({
        host: MFA_CONFIG.email.host,
        port: MFA_CONFIG.email.port,
        secure: MFA_CONFIG.email.secure,
        auth: {
          user: MFA_CONFIG.email.user,
          pass: MFA_CONFIG.email.pass,
        },
      });
    }
  }

  // Generate TOTP secret and QR code
  async generateTOTPSecret(userId: string, userEmail: string): Promise<MFASecret> {
    try {
      const secret = speakeasy.generateSecret({
        name: userEmail,
        issuer: MFA_CONFIG.totp.issuer,
        length: 32,
      });

      if (!secret.otpauth_url) {
        throw new Error('Failed to generate TOTP secret');
      }

      const qrCode = await QRCode.toDataURL(secret.otpauth_url);
      const backupCodes = this.generateBackupCodes();

      // Cache the secret temporarily (user needs to verify before saving)
      const cacheKey = cacheKeys.config(`mfa_setup:${userId}`);
      await multiLevelCache.set(cacheKey, {
        secret: secret.base32,
        backupCodes,
        timestamp: new Date(),
      }, {
        memory: 10 * 60 * 1000, // 10 minutes
        redis: 10 * 60 * 1000,
      });

      logger.info('TOTP secret generated', { userId, userEmail });

      return {
        secret: secret.base32!,
        qrCode,
        backupCodes,
      };
    } catch (error) {
      logger.error('Failed to generate TOTP secret', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Verify TOTP code
  async verifyTOTP(userId: string, code: string, secret?: string): Promise<boolean> {
    try {
      let totpSecret = secret;

      if (!totpSecret) {
        const user = await getUserById(userId);
        if (!user?.mfa_config) return false;
        
        const mfaConfig = JSON.parse(user.mfa_config) as MFAConfig;
        totpSecret = mfaConfig.totpSecret;
      }

      if (!totpSecret) return false;

      const verified = speakeasy.totp.verify({
        secret: totpSecret,
        encoding: 'base32',
        token: code,
        window: MFA_CONFIG.totp.window,
      });

      if (verified) {
        logger.info('TOTP verification successful', { userId });
        
        // Log security event
        logSecurity({
          type: 'auth_success',
          severity: 'low',
          userId,
          ip: 'unknown', // Would be passed from request context
          userAgent: 'unknown',
          details: { method: 'totp' },
          timestamp: new Date(),
        });
      } else {
        logger.warn('TOTP verification failed', { userId });
        
        logSecurity({
          type: 'auth_failure',
          severity: 'medium',
          userId,
          ip: 'unknown',
          userAgent: 'unknown',
          details: { method: 'totp', reason: 'invalid_code' },
          timestamp: new Date(),
        });
      }

      return verified;
    } catch (error) {
      logger.error('TOTP verification error', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  // Enable TOTP for user
  async enableTOTP(userId: string, verificationCode: string): Promise<boolean> {
    try {
      // Get cached setup data
      const cacheKey = cacheKeys.config(`mfa_setup:${userId}`);
      const setupData = await multiLevelCache.get(cacheKey);
      
      if (!setupData) {
        throw new Error('TOTP setup session expired');
      }

      // Verify the code
      const verified = await this.verifyTOTP(userId, verificationCode, setupData.secret);
      if (!verified) {
        return false;
      }

      // Update user's MFA configuration
      const user = await getUserById(userId);
      if (!user) throw new Error('User not found');

      const currentMfaConfig = user.mfa_config ? JSON.parse(user.mfa_config) : {};
      const newMfaConfig: MFAConfig = {
        ...currentMfaConfig,
        enabled: true,
        methods: [...(currentMfaConfig.methods || []), MFAMethod.TOTP],
        totpSecret: setupData.secret,
        backupCodes: setupData.backupCodes,
        lastUsed: new Date(),
      };

      await updateUser(userId, {
        mfa_config: JSON.stringify(newMfaConfig),
      });

      // Clear setup cache
      await multiLevelCache.delete(cacheKey);

      logger.info('TOTP enabled for user', { userId });
      return true;
    } catch (error) {
      logger.error('Failed to enable TOTP', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  // Generate verification code for SMS/Email
  private generateVerificationCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Generate backup codes
  private generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  // Send SMS verification code
  async sendSMSCode(userId: string, phoneNumber: string): Promise<boolean> {
    if (!this.twilioClient) {
      logger.error('Twilio not configured for SMS MFA');
      return false;
    }

    try {
      const code = this.generateVerificationCode();
      const cacheKey = cacheKeys.config(`mfa_sms:${userId}`);

      // Store code in cache
      await multiLevelCache.set(cacheKey, {
        code,
        phoneNumber,
        attempts: 0,
        timestamp: new Date(),
      }, {
        memory: MFA_CONFIG.verification.expiryMinutes * 60 * 1000,
        redis: MFA_CONFIG.verification.expiryMinutes * 60 * 1000,
      });

      // Send SMS
      await this.twilioClient.messages.create({
        body: `Your verification code is: ${code}. This code expires in ${MFA_CONFIG.verification.expiryMinutes} minutes.`,
        from: MFA_CONFIG.sms.fromNumber,
        to: phoneNumber,
      });

      logger.info('SMS verification code sent', { userId, phoneNumber: phoneNumber.slice(-4) });
      return true;
    } catch (error) {
      logger.error('Failed to send SMS code', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  // Send email verification code
  async sendEmailCode(userId: string, emailAddress: string): Promise<boolean> {
    if (!this.emailTransporter) {
      logger.error('Email transporter not configured for email MFA');
      return false;
    }

    try {
      const code = this.generateVerificationCode();
      const cacheKey = cacheKeys.config(`mfa_email:${userId}`);

      // Store code in cache
      await multiLevelCache.set(cacheKey, {
        code,
        emailAddress,
        attempts: 0,
        timestamp: new Date(),
      }, {
        memory: MFA_CONFIG.verification.expiryMinutes * 60 * 1000,
        redis: MFA_CONFIG.verification.expiryMinutes * 60 * 1000,
      });

      // Send email
      await this.emailTransporter.sendMail({
        from: MFA_CONFIG.email.from,
        to: emailAddress,
        subject: 'Your Verification Code',
        html: `
          <h2>Verification Code</h2>
          <p>Your verification code is: <strong>${code}</strong></p>
          <p>This code expires in ${MFA_CONFIG.verification.expiryMinutes} minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        `,
      });

      logger.info('Email verification code sent', { userId, emailAddress });
      return true;
    } catch (error) {
      logger.error('Failed to send email code', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  // Verify SMS/Email code
  async verifyCode(userId: string, method: MFAMethod.SMS | MFAMethod.EMAIL, code: string): Promise<boolean> {
    try {
      const cacheKey = cacheKeys.config(`mfa_${method}:${userId}`);
      const storedData = await multiLevelCache.get(cacheKey);

      if (!storedData) {
        logger.warn('Verification code expired or not found', { userId, method });
        return false;
      }

      // Check attempts
      if (storedData.attempts >= MFA_CONFIG.verification.maxAttempts) {
        logger.warn('Max verification attempts exceeded', { userId, method });
        return false;
      }

      // Verify code
      if (storedData.code !== code) {
        // Increment attempts
        storedData.attempts++;
        await multiLevelCache.set(cacheKey, storedData, {
          memory: MFA_CONFIG.verification.expiryMinutes * 60 * 1000,
          redis: MFA_CONFIG.verification.expiryMinutes * 60 * 1000,
        });

        logger.warn('Invalid verification code', { userId, method, attempts: storedData.attempts });
        return false;
      }

      // Clear the code
      await multiLevelCache.delete(cacheKey);

      logger.info('Verification code verified successfully', { userId, method });
      return true;
    } catch (error) {
      logger.error('Failed to verify code', {
        userId,
        method,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  // Check if user has MFA enabled
  async isMFAEnabled(userId: string): Promise<boolean> {
    try {
      const user = await getUserById(userId);
      if (!user?.mfa_config) return false;

      const mfaConfig = JSON.parse(user.mfa_config) as MFAConfig;
      return mfaConfig.enabled && mfaConfig.methods.length > 0;
    } catch (error) {
      logger.error('Failed to check MFA status', { userId, error });
      return false;
    }
  }

  // Get user's MFA configuration
  async getMFAConfig(userId: string): Promise<MFAConfig | null> {
    try {
      const user = await getUserById(userId);
      if (!user?.mfa_config) return null;

      return JSON.parse(user.mfa_config) as MFAConfig;
    } catch (error) {
      logger.error('Failed to get MFA config', { userId, error });
      return null;
    }
  }

  // Disable MFA for user
  async disableMFA(userId: string): Promise<boolean> {
    try {
      await updateUser(userId, {
        mfa_config: JSON.stringify({
          enabled: false,
          methods: [],
        }),
      });

      logger.info('MFA disabled for user', { userId });
      return true;
    } catch (error) {
      logger.error('Failed to disable MFA', { userId, error });
      return false;
    }
  }
}

// Create singleton instance
export const mfaService = new MFAService();

// Convenience functions
export const generateTOTPSecret = (userId: string, userEmail: string) => 
  mfaService.generateTOTPSecret(userId, userEmail);

export const verifyTOTP = (userId: string, code: string, secret?: string) => 
  mfaService.verifyTOTP(userId, code, secret);

export const enableTOTP = (userId: string, verificationCode: string) => 
  mfaService.enableTOTP(userId, verificationCode);

export const sendSMSCode = (userId: string, phoneNumber: string) => 
  mfaService.sendSMSCode(userId, phoneNumber);

export const sendEmailCode = (userId: string, emailAddress: string) => 
  mfaService.sendEmailCode(userId, emailAddress);

export const verifyCode = (userId: string, method: MFAMethod.SMS | MFAMethod.EMAIL, code: string) => 
  mfaService.verifyCode(userId, method, code);

export const isMFAEnabled = (userId: string) => mfaService.isMFAEnabled(userId);

export const getMFAConfig = (userId: string) => mfaService.getMFAConfig(userId);

export const disableMFA = (userId: string) => mfaService.disableMFA(userId);
