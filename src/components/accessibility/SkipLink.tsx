'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        // Base styles
        'bg-primary-600 fixed top-4 left-4 z-50 rounded-lg px-4 py-2 text-sm font-medium text-white',
        // Hidden by default, visible on focus
        'focus:ring-primary-500 sr-only focus:not-sr-only focus:ring-2 focus:ring-offset-2 focus:outline-none',
        // Animation
        'transition-all duration-200 ease-in-out',
        className
      )}
      onFocus={e => {
        // Ensure the link is visible when focused
        e.currentTarget.classList.remove('sr-only');
      }}
      onBlur={e => {
        // Hide the link when focus is lost
        e.currentTarget.classList.add('sr-only');
      }}
    >
      {children}
    </a>
  );
}

// Screen reader only text component
interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  id?: string;
}

export function ScreenReaderOnly({
  children,
  as: Component = 'span',
  className,
  id,
}: ScreenReaderOnlyProps) {
  return (
    <Component className={cn('sr-only', className)} id={id}>
      {children}
    </Component>
  );
}

// Focus trap component for modals and dialogs
interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export function FocusTrap({ children, active = true, className }: FocusTrapProps) {
  const trapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!active || !trapRef.current) return;

    const trap = trapRef.current;
    const focusableElements = trap.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // You can add custom escape handling here
        const event = new CustomEvent('focustrap:escape');
        trap.dispatchEvent(event);
      }
    };

    trap.addEventListener('keydown', handleTabKey);
    trap.addEventListener('keydown', handleEscapeKey);

    // Focus the first element when trap becomes active
    firstElement?.focus();

    return () => {
      trap.removeEventListener('keydown', handleTabKey);
      trap.removeEventListener('keydown', handleEscapeKey);
    };
  }, [active]);

  return (
    <div ref={trapRef} className={className}>
      {children}
    </div>
  );
}

// Announcement component for screen readers
interface AnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
  className?: string;
}

export function Announcement({ message, priority = 'polite', className }: AnnouncementProps) {
  return (
    <div role="status" aria-live={priority} aria-atomic="true" className={cn('sr-only', className)}>
      {message}
    </div>
  );
}

// Live region hook for dynamic announcements
export function useLiveRegion() {
  const [message, setMessage] = React.useState('');
  const [priority, setPriority] = React.useState<'polite' | 'assertive'>('polite');

  const announce = React.useCallback((text: string, urgency: 'polite' | 'assertive' = 'polite') => {
    setPriority(urgency);
    setMessage(text);

    // Clear message after announcement to allow for repeated announcements
    setTimeout(() => setMessage(''), 1000);
  }, []);

  const LiveRegion = React.useCallback(
    () => <Announcement message={message} priority={priority} />,
    [message, priority]
  );

  return { announce, LiveRegion };
}

// Accessible button component with proper ARIA attributes
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function AccessibleButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Loading...',
  disabled,
  children,
  className,
  ...props
}: AccessibleButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-describedby={loading ? 'loading-description' : undefined}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
        'focus:ring-2 focus:ring-offset-2 focus:outline-none',
        // Variants
        {
          'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white':
            variant === 'primary',
          'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 text-white':
            variant === 'secondary',
          'text-primary-600 hover:bg-primary-50 focus:ring-primary-500 bg-transparent':
            variant === 'ghost',
        },
        // Sizes
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        // Disabled state
        isDisabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      {loading && (
        <>
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
          <ScreenReaderOnly id="loading-description">{loadingText}</ScreenReaderOnly>
        </>
      )}
      {loading ? loadingText : children}
    </button>
  );
}

// Accessible form field wrapper
interface AccessibleFieldProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactElement;
  className?: string;
}

export function AccessibleField({
  label,
  error,
  helperText,
  required = false,
  children,
  className,
}: AccessibleFieldProps) {
  const fieldId = React.useId();
  const errorId = error ? `${fieldId}-error` : undefined;
  const helperId = helperText ? `${fieldId}-helper` : undefined;

  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-1', className)}>
      <label htmlFor={fieldId} className="text-on-surface block text-sm font-medium">
        {label}
        {required && (
          <span className="text-error-500 ml-1" aria-label="Required">
            *
          </span>
        )}
      </label>

      {React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        id: fieldId,
        'aria-describedby': describedBy,
        'aria-invalid': !!error,
        'aria-required': required,
      })}

      {helperText && (
        <p id={helperId} className="text-on-surface-variant text-sm">
          {helperText}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-error-600 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
