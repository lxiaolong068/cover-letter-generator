import { NextResponse } from 'next/server';
import { MiddlewareContext, MiddlewareFunction, ValidationSchema } from './types';
import { createValidationError } from './error-handler';

export class RequestValidator {
  static validate(data: any, schema: ValidationSchema): string[] {
    const errors: string[] = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      // Check required fields
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      // Skip validation for optional fields that are not provided
      if (!rules.required && (value === undefined || value === null)) {
        continue;
      }

      // Type validation
      if (rules.type && !this.validateType(value, rules.type)) {
        errors.push(`${field} must be of type ${rules.type}`);
        continue;
      }

      // String validations
      if (rules.type === 'string' && typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters long`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} must be at most ${rules.maxLength} characters long`);
        }
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
        }
      }

      // Number validations
      if (rules.type === 'number' && typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push(`${field} must be at least ${rules.min}`);
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push(`${field} must be at most ${rules.max}`);
        }
      }
    }

    return errors;
  }

  private static validateType(value: any, type: string): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      default:
        return true;
    }
  }
}

export const validationMiddleware = (schema: ValidationSchema): MiddlewareFunction => {
  return async (context: MiddlewareContext): Promise<MiddlewareContext | NextResponse> => {
    try {
      const body = await context.req.json();
      const errors = RequestValidator.validate(body, schema);

      if (errors.length > 0) {
        const error = createValidationError('Validation failed', errors);
        return NextResponse.json(
          {
            error: {
              message: error.message,
              code: error.code,
              details: error.details,
            },
            timestamp: new Date().toISOString(),
          },
          { status: error.status }
        );
      }

      // Add parsed body to request
      context.req.parsedBody = body;
      return context;
    } catch (error) {
      console.error('Validation error:', error);
      const validationError = createValidationError('Invalid JSON body');
      return NextResponse.json(
        {
          error: {
            message: validationError.message,
            code: validationError.code,
          },
          timestamp: new Date().toISOString(),
        },
        { status: validationError.status }
      );
    }
  };
};

// Common validation schemas
export const coverLetterGenerationSchema: ValidationSchema = {
  jobDescription: {
    required: true,
    type: 'string',
    minLength: 50,
    maxLength: 10000,
  },
  userProfile: {
    required: true,
    type: 'string',
    minLength: 100,
    maxLength: 5000,
  },
  coverLetterType: {
    required: false,
    type: 'string',
    enum: ['professional', 'creative', 'technical', 'executive'],
  },
};

export const coverLetterSaveSchema: ValidationSchema = {
  title: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 200,
  },
  content: {
    required: true,
    type: 'string',
    minLength: 100,
    maxLength: 10000,
  },
  jobDescription: {
    required: true,
    type: 'string',
    minLength: 50,
    maxLength: 10000,
  },
  userProfile: {
    required: true,
    type: 'string',
    minLength: 100,
    maxLength: 5000,
  },
  coverLetterType: {
    required: false,
    type: 'string',
    enum: ['professional', 'creative', 'technical', 'executive'],
  },
  modelUsed: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 100,
  },
  tokensUsed: {
    required: false,
    type: 'number',
    min: 0,
  },
  generationTime: {
    required: true,
    type: 'number',
    min: 0,
  },
};