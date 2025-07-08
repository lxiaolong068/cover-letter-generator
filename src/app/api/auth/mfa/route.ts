// MFA management API endpoints
import { NextRequest, NextResponse } from 'next/server';
import {
  fullStackApiMiddleware,
  AuthenticatedRequest,
  MiddlewareContext,
  createValidationError,
} from '@/lib/middleware';
import {
  generateTOTPSecret,
  enableTOTP,
  verifyTOTP,
  sendSMSCode,
  sendEmailCode,
  verifyCode,
  isMFAEnabled,
  getMFAConfig,
  disableMFA,
  MFAMethod,
} from '@/lib/mfa';
import { logger } from '@/lib/logging';

// Middleware for authenticated MFA endpoints
const mfaMiddleware = fullStackApiMiddleware();

// GET handler - get MFA status and configuration
async function getMFAStatus(
  req: AuthenticatedRequest,
  context: MiddlewareContext
) {
  try {
    const userId = context.user!.id;
    
    const [enabled, config] = await Promise.all([
      isMFAEnabled(userId),
      getMFAConfig(userId),
    ]);

    const response = {
      enabled,
      methods: config?.methods || [],
      hasBackupCodes: config?.backupCodes && config.backupCodes.length > 0,
      lastUsed: config?.lastUsed,
    };

    logger.info('MFA status retrieved', {
      requestId: context.metrics.requestId,
      userId,
      enabled,
      methods: response.methods,
    });

    return NextResponse.json(response);
  } catch (error) {
    logger.error('Failed to get MFA status', {
      requestId: context.metrics.requestId,
      userId: context.user?.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { error: { message: 'Failed to get MFA status', code: 'MFA_STATUS_ERROR' } },
      { status: 500 }
    );
  }
}

// POST handler - setup or verify MFA
async function handleMFAAction(
  req: AuthenticatedRequest,
  context: MiddlewareContext
) {
  try {
    const userId = context.user!.id;
    const userEmail = context.user!.email;
    const { action, method, code, phoneNumber, emailAddress } = await req.json();

    switch (action) {
      case 'setup_totp':
        const totpSecret = await generateTOTPSecret(userId, userEmail);
        
        logger.info('TOTP setup initiated', {
          requestId: context.metrics.requestId,
          userId,
        });

        return NextResponse.json({
          secret: totpSecret.secret,
          qrCode: totpSecret.qrCode,
          backupCodes: totpSecret.backupCodes,
        });

      case 'enable_totp':
        if (!code) {
          throw createValidationError('Verification code is required');
        }

        const totpEnabled = await enableTOTP(userId, code);
        if (!totpEnabled) {
          return NextResponse.json(
            { error: { message: 'Invalid verification code', code: 'INVALID_CODE' } },
            { status: 400 }
          );
        }

        logger.info('TOTP enabled successfully', {
          requestId: context.metrics.requestId,
          userId,
        });

        return NextResponse.json({ success: true, message: 'TOTP enabled successfully' });

      case 'send_sms':
        if (!phoneNumber) {
          throw createValidationError('Phone number is required');
        }

        const smsSent = await sendSMSCode(userId, phoneNumber);
        if (!smsSent) {
          return NextResponse.json(
            { error: { message: 'Failed to send SMS code', code: 'SMS_SEND_ERROR' } },
            { status: 500 }
          );
        }

        logger.info('SMS verification code sent', {
          requestId: context.metrics.requestId,
          userId,
          phoneNumber: phoneNumber.slice(-4),
        });

        return NextResponse.json({ success: true, message: 'SMS code sent' });

      case 'send_email':
        if (!emailAddress) {
          throw createValidationError('Email address is required');
        }

        const emailSent = await sendEmailCode(userId, emailAddress);
        if (!emailSent) {
          return NextResponse.json(
            { error: { message: 'Failed to send email code', code: 'EMAIL_SEND_ERROR' } },
            { status: 500 }
          );
        }

        logger.info('Email verification code sent', {
          requestId: context.metrics.requestId,
          userId,
          emailAddress,
        });

        return NextResponse.json({ success: true, message: 'Email code sent' });

      case 'verify_totp':
        if (!code) {
          throw createValidationError('Verification code is required');
        }

        const totpValid = await verifyTOTP(userId, code);
        if (!totpValid) {
          return NextResponse.json(
            { error: { message: 'Invalid TOTP code', code: 'INVALID_TOTP' } },
            { status: 400 }
          );
        }

        logger.info('TOTP verification successful', {
          requestId: context.metrics.requestId,
          userId,
        });

        return NextResponse.json({ success: true, verified: true });

      case 'verify_sms':
        if (!code) {
          throw createValidationError('Verification code is required');
        }

        const smsValid = await verifyCode(userId, MFAMethod.SMS, code);
        if (!smsValid) {
          return NextResponse.json(
            { error: { message: 'Invalid SMS code', code: 'INVALID_SMS' } },
            { status: 400 }
          );
        }

        logger.info('SMS verification successful', {
          requestId: context.metrics.requestId,
          userId,
        });

        return NextResponse.json({ success: true, verified: true });

      case 'verify_email':
        if (!code) {
          throw createValidationError('Verification code is required');
        }

        const emailValid = await verifyCode(userId, MFAMethod.EMAIL, code);
        if (!emailValid) {
          return NextResponse.json(
            { error: { message: 'Invalid email code', code: 'INVALID_EMAIL' } },
            { status: 400 }
          );
        }

        logger.info('Email verification successful', {
          requestId: context.metrics.requestId,
          userId,
        });

        return NextResponse.json({ success: true, verified: true });

      default:
        return NextResponse.json(
          { error: { message: 'Invalid action', code: 'INVALID_ACTION' } },
          { status: 400 }
        );
    }
  } catch (error) {
    logger.error('MFA action failed', {
      requestId: context.metrics.requestId,
      userId: context.user?.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    if (error instanceof Error && 'status' in error) {
      return NextResponse.json(
        { error: { message: error.message, code: 'VALIDATION_ERROR' } },
        { status: (error as any).status }
      );
    }

    return NextResponse.json(
      { error: { message: 'MFA action failed', code: 'MFA_ACTION_ERROR' } },
      { status: 500 }
    );
  }
}

// DELETE handler - disable MFA
async function disableMFAHandler(
  req: AuthenticatedRequest,
  context: MiddlewareContext
) {
  try {
    const userId = context.user!.id;
    const { confirmationCode } = await req.json();

    // Require current MFA verification to disable
    if (!confirmationCode) {
      return NextResponse.json(
        { error: { message: 'Confirmation code required to disable MFA', code: 'CONFIRMATION_REQUIRED' } },
        { status: 400 }
      );
    }

    // Verify the confirmation code (could be TOTP, SMS, or email)
    const totpValid = await verifyTOTP(userId, confirmationCode);
    const smsValid = await verifyCode(userId, MFAMethod.SMS, confirmationCode);
    const emailValid = await verifyCode(userId, MFAMethod.EMAIL, confirmationCode);

    if (!totpValid && !smsValid && !emailValid) {
      return NextResponse.json(
        { error: { message: 'Invalid confirmation code', code: 'INVALID_CONFIRMATION' } },
        { status: 400 }
      );
    }

    const disabled = await disableMFA(userId);
    if (!disabled) {
      return NextResponse.json(
        { error: { message: 'Failed to disable MFA', code: 'DISABLE_MFA_ERROR' } },
        { status: 500 }
      );
    }

    logger.info('MFA disabled successfully', {
      requestId: context.metrics.requestId,
      userId,
    });

    return NextResponse.json({ success: true, message: 'MFA disabled successfully' });
  } catch (error) {
    logger.error('Failed to disable MFA', {
      requestId: context.metrics.requestId,
      userId: context.user?.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { error: { message: 'Failed to disable MFA', code: 'DISABLE_MFA_ERROR' } },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return mfaMiddleware.handle(req, getMFAStatus);
}

export async function POST(req: NextRequest) {
  return mfaMiddleware.handle(req, handleMFAAction);
}

export async function DELETE(req: NextRequest) {
  return mfaMiddleware.handle(req, disableMFAHandler);
}
