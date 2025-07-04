'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  [
    'flex w-full rounded-lg border bg-surface px-3 py-2',
    'text-base text-on-surface placeholder:text-on-surface-variant',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
  ],
  {
    variants: {
      variant: {
        default: 'border-outline hover:border-outline-variant',
        filled: 'border-transparent bg-surface-container hover:bg-surface-container-high',
        error: 'border-error-500 focus:ring-error-500',
        success: 'border-success-500 focus:ring-success-500',
      },
      size: {
        sm: 'h-9 px-2 text-sm',
        md: 'h-10 px-3 text-base',
        lg: 'h-11 px-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      type = 'text',
      leftIcon,
      rightIcon,
      error,
      helperText,
      label,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const finalVariant = hasError ? 'error' : variant;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="text-on-surface mb-2 block text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="text-on-surface-variant absolute top-1/2 left-3 -translate-y-1/2">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              inputVariants({ variant: finalVariant, size, className }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10'
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="text-on-surface-variant absolute top-1/2 right-3 -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn('mt-1 text-sm', hasError ? 'text-error-600' : 'text-on-surface-variant')}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
