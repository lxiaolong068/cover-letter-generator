'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles with Material Design 3.0 principles
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-xl font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98] active:transition-transform active:duration-75',
    'relative overflow-hidden',
    'before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:opacity-0 before:transition-opacity before:duration-200',
    'hover:before:opacity-10',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-r from-primary-600 to-primary-700',
          'text-white font-semibold shadow-lg',
          'hover:from-primary-700 hover:to-primary-800',
          'hover:shadow-xl hover:shadow-primary-500/25',
          'focus:ring-primary-500 focus:ring-offset-2',
          'before:from-white before:to-white',
          'dark:from-primary-500 dark:to-primary-600',
          'dark:hover:from-primary-600 dark:hover:to-primary-700',
          'dark:shadow-primary-900/50',
          'disabled:from-neutral-300 disabled:to-neutral-400',
          'disabled:shadow-none disabled:text-neutral-500',
        ],
        secondary: [
          'bg-gradient-to-r from-secondary-600 to-secondary-700',
          'text-white font-semibold shadow-lg',
          'hover:from-secondary-700 hover:to-secondary-800',
          'hover:shadow-xl hover:shadow-secondary-500/25',
          'focus:ring-secondary-500 focus:ring-offset-2',
          'before:from-white before:to-white',
          'dark:from-secondary-500 dark:to-secondary-600',
          'dark:hover:from-secondary-600 dark:hover:to-secondary-700',
          'dark:shadow-secondary-900/50',
          'disabled:from-neutral-300 disabled:to-neutral-400',
          'disabled:shadow-none disabled:text-neutral-500',
        ],
        accent: [
          'bg-gradient-to-r from-accent-500 to-accent-600',
          'text-white font-semibold shadow-lg',
          'hover:from-accent-600 hover:to-accent-700',
          'hover:shadow-xl hover:shadow-accent-500/25',
          'focus:ring-accent-500 focus:ring-offset-2',
          'before:from-white before:to-white',
          'dark:from-accent-500 dark:to-accent-600',
          'dark:hover:from-accent-600 dark:hover:to-accent-700',
          'dark:shadow-accent-900/50',
          'disabled:from-neutral-300 disabled:to-neutral-400',
          'disabled:shadow-none disabled:text-neutral-500',
        ],
        outline: [
          'border-2 border-outline bg-surface text-on-surface',
          'hover:bg-surface-container hover:border-primary-300',
          'hover:text-primary-700 hover:shadow-md',
          'focus:ring-primary-500 focus:border-primary-500',
          'before:from-primary-50 before:to-primary-100',
          'dark:border-outline-variant dark:bg-surface-variant',
          'dark:text-on-surface dark:hover:bg-surface-container-high',
          'dark:hover:border-primary-400 dark:hover:text-primary-300',
          'disabled:border-neutral-200 disabled:bg-neutral-50',
          'disabled:text-neutral-400',
        ],
        ghost: [
          'bg-transparent text-on-surface',
          'hover:bg-surface-container hover:text-primary-700',
          'hover:shadow-sm',
          'focus:ring-primary-500 focus:bg-surface-container',
          'before:from-primary-50 before:to-primary-100',
          'dark:text-on-surface dark:hover:bg-surface-container-high',
          'dark:hover:text-primary-300',
          'disabled:text-neutral-400 disabled:bg-transparent',
        ],
        destructive: [
          'bg-gradient-to-r from-error-600 to-error-700',
          'text-white font-semibold shadow-lg',
          'hover:from-error-700 hover:to-error-800',
          'hover:shadow-xl hover:shadow-error-500/25',
          'focus:ring-error-500 focus:ring-offset-2',
          'before:from-white before:to-white',
          'dark:from-error-500 dark:to-error-600',
          'dark:hover:from-error-600 dark:hover:to-error-700',
          'dark:shadow-error-900/50',
          'disabled:from-neutral-300 disabled:to-neutral-400',
          'disabled:shadow-none disabled:text-neutral-500',
        ],
        link: [
          'text-primary-600 underline-offset-4 font-medium',
          'hover:underline hover:text-primary-700',
          'focus:ring-primary-500 focus:ring-offset-2',
          'before:from-primary-50 before:to-primary-100',
          'dark:text-primary-400 dark:hover:text-primary-300',
          'disabled:text-neutral-400 disabled:no-underline',
        ],
        // New Material Design 3.0 variants
        filled: [
          'bg-primary-600 text-on-primary shadow-md',
          'hover:bg-primary-700 hover:shadow-lg',
          'focus:ring-primary-500 focus:ring-offset-2',
          'before:from-white before:to-white',
          'dark:bg-primary-500 dark:hover:bg-primary-600',
          'disabled:bg-neutral-300 disabled:text-neutral-500',
        ],
        'filled-tonal': [
          'bg-primary-100 text-primary-800 shadow-sm',
          'hover:bg-primary-200 hover:shadow-md',
          'focus:ring-primary-500 focus:ring-offset-2',
          'before:from-primary-50 before:to-white',
          'dark:bg-primary-800 dark:text-primary-100',
          'dark:hover:bg-primary-700',
          'disabled:bg-neutral-100 disabled:text-neutral-400',
        ],
        elevated: [
          'bg-surface shadow-lg border border-outline-variant',
          'text-on-surface hover:bg-surface-container',
          'hover:shadow-xl hover:border-primary-300',
          'focus:ring-primary-500 focus:ring-offset-2',
          'before:from-primary-50 before:to-primary-100',
          'dark:bg-surface-variant dark:border-outline',
          'dark:hover:bg-surface-container-high',
          'disabled:bg-neutral-50 disabled:text-neutral-400',
          'disabled:shadow-none disabled:border-neutral-200',
        ],
      },
      size: {
        sm: 'h-9 px-4 text-sm gap-1.5',
        md: 'h-11 px-6 text-base gap-2',
        lg: 'h-12 px-8 text-lg gap-2.5',
        xl: 'h-14 px-10 text-xl gap-3',
        icon: 'h-11 w-11 p-0',
        'icon-sm': 'h-9 w-9 p-0',
        'icon-lg': 'h-12 w-12 p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
      elevation: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      elevation: 'md',
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
  ripple?: boolean;
}

const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        className,
        variant,
        size,
        fullWidth,
        elevation,
        loading = false,
        leftIcon,
        rightIcon,
        children,
        disabled,
        asChild = false,
        ripple = true,
        onClick,
        ...props
      },
      ref
    ) => {
      const isDisabled = disabled || loading;
      const [rippleCoords, setRippleCoords] = React.useState<{ x: number; y: number } | null>(null);

      const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
          if (ripple && !isDisabled) {
            const rect = event.currentTarget.getBoundingClientRect();
            setRippleCoords({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
            });
            setTimeout(() => setRippleCoords(null), 600);
          }
          onClick?.(event);
        },
        [ripple, isDisabled, onClick]
      );

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
          {!loading && leftIcon && (
            <span className="flex items-center justify-center">{leftIcon}</span>
          )}
          <span className="flex items-center justify-center">{children}</span>
          {!loading && rightIcon && (
            <span className="flex items-center justify-center">{rightIcon}</span>
          )}
          {rippleCoords && (
            <span
              className="absolute animate-ping rounded-full bg-current opacity-30"
              style={{
                left: rippleCoords.x - 10,
                top: rippleCoords.y - 10,
                width: 20,
                height: 20,
              }}
            />
          )}
        </>
      );

      if (asChild) {
        return React.cloneElement(
          children as React.ReactElement,
          {
            className: cn(buttonVariants({ variant, size, fullWidth, elevation }), className),
            ref,
            disabled: isDisabled,
            onClick: handleClick,
            ...props,
          } as React.HTMLAttributes<HTMLElement>
        );
      }

      return (
        <button
          className={cn(buttonVariants({ variant, size, fullWidth, elevation, className }))}
          ref={ref}
          disabled={isDisabled}
          onClick={handleClick}
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
