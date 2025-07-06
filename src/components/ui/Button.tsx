'use client';

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles with shadcn/ui and Material Design 3.0 principles
  [
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-md text-sm font-medium',
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98] active:transition-transform active:duration-75',
    'relative overflow-hidden',
    'before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:opacity-0 before:transition-opacity before:duration-200',
    'hover:before:opacity-10',
    // Enhanced typography for better readability
    'leading-none tracking-wide',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
          'before:from-white before:to-white',
        ],
        destructive: [
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
          'before:from-white before:to-white',
        ],
        outline: [
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
          'before:from-primary/10 before:to-primary/10',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
          'before:from-foreground/10 before:to-foreground/10',
        ],
        ghost: [
          'hover:bg-accent hover:text-accent-foreground',
          'before:from-primary/10 before:to-primary/10',
        ],
        link: [
          'text-primary underline-offset-4 hover:underline',
          'before:from-primary/10 before:to-primary/10',
        ],
        // Enhanced Material Design 3.0 variants
        primary: [
          'bg-gradient-to-r from-primary to-primary shadow-lg',
          'text-primary-foreground font-semibold',
          'hover:from-primary/90 hover:to-primary/90',
          'hover:shadow-xl hover:shadow-primary/25',
          'before:from-white before:to-white',
          'dark:shadow-primary/20',
        ],
        accent: [
          'bg-gradient-to-r from-hsl(var(--color-accent-500)) to-hsl(var(--color-accent-600))',
          'text-white font-semibold shadow-lg',
          'hover:from-hsl(var(--color-accent-600)) hover:to-hsl(var(--color-accent-700))',
          'hover:shadow-xl hover:shadow-hsl(var(--color-accent-500))/25',
          'before:from-white before:to-white',
        ],
        filled: [
          'bg-primary text-primary-foreground shadow-md',
          'hover:bg-primary/90 hover:shadow-lg',
          'before:from-white before:to-white',
        ],
        'filled-tonal': [
          'bg-primary/10 text-primary shadow-sm',
          'hover:bg-primary/20 hover:shadow-md',
          'before:from-primary/10 before:to-primary/10',
        ],
        elevated: [
          'bg-card shadow-lg border border-border',
          'text-card-foreground hover:bg-accent hover:text-accent-foreground',
          'hover:shadow-xl hover:border-primary/30',
          'before:from-primary/10 before:to-primary/10',
        ],
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-12 rounded-md px-10 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-9 w-9',
        'icon-lg': 'h-11 w-11',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
  ripple?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
      ripple = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;
    const [rippleCoords, setRippleCoords] = React.useState<{ x: number; y: number } | null>(null);

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) return;

        // Ripple effect
        if (ripple) {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setRippleCoords({ x, y });

          // Clear ripple after animation
          setTimeout(() => setRippleCoords(null), 300);
        }

        onClick?.(e);
      },
      [isDisabled, ripple, onClick]
    );

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, fullWidth, className }))}
          ref={ref}
          disabled={isDisabled}
          onClick={handleClick}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple Effect */}
        {rippleCoords && (
          <span
            className="pointer-events-none absolute animate-ping rounded-full bg-white/30"
            style={{
              left: rippleCoords.x - 10,
              top: rippleCoords.y - 10,
              width: 20,
              height: 20,
            }}
          />
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}

        {/* Left Icon */}
        {leftIcon && !loading && (
          <span className="mr-1 flex items-center justify-center">{leftIcon}</span>
        )}

        {/* Content */}
        {children}

        {/* Right Icon */}
        {rightIcon && <span className="ml-1 flex items-center justify-center">{rightIcon}</span>}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
