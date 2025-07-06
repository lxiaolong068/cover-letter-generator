'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      'transition-all duration-200 hover:shadow-md',
      'border-border/50 hover:border-border',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      'text-card-foreground',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-muted-foreground',
      'leading-relaxed',
      className
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pt-0', className)}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Enhanced Card variants for specific use cases
const FeatureCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode;
    title: string;
    description: string;
    gradient?: boolean;
  }
>(({ className, icon, title, description, gradient = false, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      'group cursor-pointer transition-all duration-300',
      'hover:shadow-xl hover:shadow-primary/10',
      'hover:border-primary/20',
      gradient && 'bg-gradient-to-br from-card to-muted/20',
      'relative overflow-hidden',
      className
    )}
    {...props}
  >
    {/* Background gradient overlay */}
    {gradient && (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    )}
    
    <CardHeader className="relative z-10">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20">
          {icon}
        </div>
      )}
      <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
        {title}
      </CardTitle>
      <CardDescription className="text-base leading-relaxed">
        {description}
      </CardDescription>
    </CardHeader>
  </Card>
));
FeatureCard.displayName = 'FeatureCard';

const StatsCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string;
    label: string;
    icon?: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
  }
>(({ className, value, label, icon, trend, trendValue, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      'group transition-all duration-300',
      'hover:shadow-lg hover:shadow-primary/10',
      'border-border/50 hover:border-primary/20',
      'bg-gradient-to-br from-card to-muted/10',
      className
    )}
    {...props}
  >
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-3xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">
            {value}
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>
          {trend && trendValue && (
            <div className={cn(
              'flex items-center text-xs font-medium',
              trend === 'up' && 'text-green-600',
              trend === 'down' && 'text-red-600',
              trend === 'neutral' && 'text-muted-foreground'
            )}>
              <span className="mr-1">
                {trend === 'up' && '↗'}
                {trend === 'down' && '↘'}
                {trend === 'neutral' && '→'}
              </span>
              {trendValue}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20">
            {icon}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
));
StatsCard.displayName = 'StatsCard';

const InteractiveCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hoverable?: boolean;
    clickable?: boolean;
    selected?: boolean;
  }
>(({ className, hoverable = true, clickable = false, selected = false, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      'transition-all duration-300',
      hoverable && 'hover:shadow-lg hover:shadow-primary/10',
      clickable && 'cursor-pointer active:scale-[0.98]',
      selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
      'border-border/50',
      hoverable && 'hover:border-primary/20',
      className
    )}
    {...props}
  />
));
InteractiveCard.displayName = 'InteractiveCard';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  FeatureCard,
  StatsCard,
  InteractiveCard,
};
