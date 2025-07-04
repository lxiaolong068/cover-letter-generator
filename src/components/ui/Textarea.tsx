'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  [
    'flex min-h-[80px] w-full rounded-lg border bg-surface px-3 py-2',
    'text-base text-on-surface placeholder:text-on-surface-variant',
    'transition-all duration-200 resize-vertical',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    'disabled:cursor-not-allowed disabled:opacity-50',
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
        sm: 'min-h-[60px] px-2 py-1 text-sm',
        md: 'min-h-[80px] px-3 py-2 text-base',
        lg: 'min-h-[100px] px-4 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: string;
  helperText?: string;
  label?: string;
  maxLength?: number;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      size,
      error,
      helperText,
      label,
      id,
      maxLength,
      showCount = false,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const finalVariant = hasError ? 'error' : variant;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="text-on-surface mb-2 block text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            className={cn(textareaVariants({ variant: finalVariant, size, className }))}
            ref={ref}
            maxLength={maxLength}
            value={value}
            {...props}
          />
          {showCount && maxLength && (
            <div className="text-on-surface-variant absolute right-2 bottom-2 text-xs">
              {currentLength}/{maxLength}
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

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
