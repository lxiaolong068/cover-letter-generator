'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-lg font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary-600 text-white shadow-sm',
          'hover:bg-primary-700 hover:shadow-md',
          'focus:ring-primary-500',
          'dark:bg-primary-500 dark:hover:bg-primary-600',
        ],
        secondary: [
          'bg-secondary-600 text-white shadow-sm',
          'hover:bg-secondary-700 hover:shadow-md',
          'focus:ring-secondary-500',
          'dark:bg-secondary-500 dark:hover:bg-secondary-600',
        ],
        outline: [
          'border border-outline bg-transparent text-on-surface',
          'hover:bg-surface-container hover:border-outline-variant',
          'focus:ring-primary-500',
          'dark:border-outline-variant dark:hover:bg-surface-container',
        ],
        ghost: [
          'bg-transparent text-on-surface',
          'hover:bg-surface-container',
          'focus:ring-primary-500',
        ],
        destructive: [
          'bg-error-600 text-white shadow-sm',
          'hover:bg-error-700 hover:shadow-md',
          'focus:ring-error-500',
          'dark:bg-error-500 dark:hover:bg-error-600',
        ],
        link: [
          'text-primary-600 underline-offset-4',
          'hover:underline hover:text-primary-700',
          'focus:ring-primary-500',
          'dark:text-primary-400 dark:hover:text-primary-300',
        ],
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-11 px-6 text-lg',
        xl: 'h-12 px-8 text-xl',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        className,
        variant,
        size,
        fullWidth,
        loading = false,
        leftIcon,
        rightIcon,
        children,
        disabled,
        asChild = false,
        ...props
      },
      ref
    ) => {
      const isDisabled = disabled || loading;

      const LoadingSpinner = React.useMemo(
        () => (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ),
        []
      );

      const content = (
        <>
          {loading && LoadingSpinner}
          {!loading && leftIcon && leftIcon}
          {children}
          {!loading && rightIcon && rightIcon}
        </>
      );

      if (asChild) {
        // When asChild is true, we clone the child element and apply our styles to it
        return React.cloneElement(
          children as React.ReactElement,
          {
            className: cn(buttonVariants({ variant, size, fullWidth }), className),
            ref,
            disabled: isDisabled,
            ...props,
          } as React.HTMLAttributes<HTMLElement>
        );
      }

      return (
        <button
          className={cn(buttonVariants({ variant, size, fullWidth, className }))}
          ref={ref}
          disabled={isDisabled}
          {...props}
        >
          {content}
        </button>
      );
    }
  )
);

Button.displayName = 'Button';

export { Button, buttonVariants };
