import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  center?: boolean;
}

const containerSizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-screen-2xl',
  full: 'max-w-full',
};

const containerPadding = {
  none: '',
  sm: 'px-4 sm:px-6',
  md: 'px-4 sm:px-6 lg:px-8',
  lg: 'px-6 sm:px-8 lg:px-12',
};

export function Container({
  size = 'lg',
  padding = 'md',
  center = true,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full',
        containerSizes[size],
        containerPadding[padding],
        center && 'mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Grid System Components
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  };
}

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

const gridGaps = {
  none: 'gap-0',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

export function Grid({
  cols = 1,
  gap = 'md',
  responsive,
  className,
  children,
  ...props
}: GridProps) {
  const responsiveClasses = responsive
    ? [
        responsive.sm && `sm:grid-cols-${responsive.sm}`,
        responsive.md && `md:grid-cols-${responsive.md}`,
        responsive.lg && `lg:grid-cols-${responsive.lg}`,
        responsive.xl && `xl:grid-cols-${responsive.xl}`,
      ].filter(Boolean)
    : [];

  return (
    <div
      className={cn('grid', gridCols[cols], gridGaps[gap], ...responsiveClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Flex utilities
interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const flexDirections = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
};

const alignItems = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyContent = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const flexGaps = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

export function Flex({
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 'none',
  className,
  children,
  ...props
}: FlexProps) {
  return (
    <div
      className={cn(
        'flex',
        flexDirections[direction],
        alignItems[align],
        justifyContent[justify],
        wrap && 'flex-wrap',
        flexGaps[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Stack component for vertical spacing
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

const stackSpacing = {
  none: 'space-y-0',
  xs: 'space-y-1',
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-6',
  xl: 'space-y-8',
  '2xl': 'space-y-12',
};

const stackAlign = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

export function Stack({
  spacing = 'md',
  align = 'stretch',
  className,
  children,
  ...props
}: StackProps) {
  return (
    <div
      className={cn('flex flex-col', stackSpacing[spacing], stackAlign[align], className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Responsive visibility utilities
interface ShowProps {
  above?: 'sm' | 'md' | 'lg' | 'xl';
  below?: 'sm' | 'md' | 'lg' | 'xl';
  only?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export function Show({ above, below, only, children }: ShowProps) {
  let className = '';

  if (above) {
    className = `hidden ${above}:block`;
  } else if (below) {
    const breakpoints = { sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' };
    className = `block ${breakpoints[below]}:hidden`;
  } else if (only) {
    const breakpoints = {
      sm: 'block sm:hidden',
      md: 'hidden sm:block md:hidden',
      lg: 'hidden md:block lg:hidden',
      xl: 'hidden lg:block xl:hidden',
    };
    className = breakpoints[only];
  }

  return <div className={className}>{children}</div>;
}
