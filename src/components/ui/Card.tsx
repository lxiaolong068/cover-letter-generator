'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  ['rounded-xl bg-surface border border-outline-variant', 'transition-all duration-200'],
  {
    variants: {
      variant: {
        default: 'shadow-sm hover:shadow-md',
        elevated: 'shadow-md hover:shadow-lg',
        outlined: 'border-2 shadow-none hover:shadow-sm',
        filled: 'bg-surface-container border-none shadow-sm',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      interactive: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.memo(
  React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, padding, interactive, ...props }, ref) => (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, interactive, className }))}
        {...props}
      />
    )
  )
);
Card.displayName = 'Card';

const CardHeader = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn('flex flex-col space-y-1.5', className)} {...props} />
    )
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.memo(
  React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h3
        ref={ref}
        className={cn(
          'text-on-surface text-xl leading-none font-semibold tracking-tight',
          className
        )}
        {...props}
      />
    )
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.memo(
  React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
      <p ref={ref} className={cn('text-on-surface-variant text-sm', className)} {...props} />
    )
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => <div ref={ref} className={cn('pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn('flex items-center pt-6', className)} {...props} />
    )
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
