'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  [
    'rounded-2xl bg-surface border border-outline-variant',
    'transition-all duration-200 ease-out',
    'relative overflow-hidden',
    'before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-primary-50/30 before:to-secondary-50/20 before:opacity-0 before:transition-opacity before:duration-300',
    'hover:before:opacity-100',
  ],
  {
    variants: {
      variant: {
        default: [
          'shadow-elevation-1 hover:shadow-elevation-2',
          'hover:border-primary-200',
          'hover:-translate-y-1',
        ],
        elevated: [
          'shadow-elevation-3 hover:shadow-elevation-4',
          'hover:border-primary-300',
          'hover:-translate-y-2',
        ],
        outlined: [
          'border-2 shadow-none hover:shadow-elevation-1',
          'hover:border-primary-400',
          'hover:bg-surface-container',
        ],
        filled: [
          'bg-surface-container border-none shadow-elevation-1',
          'hover:bg-surface-container-high hover:shadow-elevation-2',
        ],
        tonal: [
          'bg-primary-50 border-primary-200 shadow-elevation-1',
          'hover:bg-primary-100 hover:shadow-elevation-2',
          'dark:bg-primary-900/20 dark:border-primary-800',
        ],
        glass: [
          'backdrop-blur-md bg-surface/80 border-outline-variant/50',
          'shadow-lg hover:shadow-xl',
          'hover:bg-surface/90',
        ],
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      interactive: {
        true: [
          'cursor-pointer',
          'active:scale-[0.98] active:transition-transform active:duration-75',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        ],
        false: '',
      },
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      interactive: false,
      size: 'full',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.memo(
  React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, padding, interactive, size, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(cardVariants({ variant, padding, interactive, size, className }))}
          {...props}
        />
      );
    }
  )
);
Card.displayName = 'Card';

const CardHeader = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn('relative z-10 flex flex-col space-y-2', className)}
        {...props}
      />
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
          'text-xl font-bold leading-tight tracking-tight text-on-surface',
          'relative z-10',
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
      <p
        ref={ref}
        className={cn(
          'text-sm leading-relaxed text-on-surface-variant',
          'relative z-10',
          className
        )}
        {...props}
      />
    )
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn('relative z-10 pt-0', className)} {...props} />
    )
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn('relative z-10 flex items-center pt-6', className)} {...props} />
    )
  )
);
CardFooter.displayName = 'CardFooter';

// Additional Card Components for Material Design 3.0
const CardMedia = React.memo(
  React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
      src?: string;
      alt?: string;
      aspectRatio?: 'square' | 'video' | 'wide' | 'tall';
    }
  >(({ className, src, alt, aspectRatio = 'video', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden bg-surface-container',
        {
          'aspect-square': aspectRatio === 'square',
          'aspect-video': aspectRatio === 'video',
          'aspect-[21/9]': aspectRatio === 'wide',
          'aspect-[3/4]': aspectRatio === 'tall',
        },
        className
      )}
      {...props}
    >
      {src && (
        <Image
          src={src}
          alt={alt || ''}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      )}
    </div>
  ))
);
CardMedia.displayName = 'CardMedia';

const CardActions = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 border-t border-outline-variant/50 pt-4',
          'relative z-10',
          className
        )}
        {...props}
      />
    )
  )
);
CardActions.displayName = 'CardActions';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardMedia,
  CardActions,
};
