'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  helperText?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, resize = 'vertical', autoResize = false, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    
    // Auto-resize functionality
    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        const adjustHeight = () => {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        };
        
        adjustHeight();
        textarea.addEventListener('input', adjustHeight);
        
        return () => textarea.removeEventListener('input', adjustHeight);
      }
    }, [autoResize, props.value]);

    // Combine refs
    React.useImperativeHandle(ref, () => textareaRef.current!);

    return (
      <div className="relative">
        {/* Textarea Field */}
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            // Enhanced states
            'transition-all duration-200',
            'hover:border-primary/50',
            'focus:border-primary',
            // Error state
            error && 'border-destructive focus:border-destructive focus-visible:ring-destructive',
            // Resize options
            resize === 'none' && 'resize-none',
            resize === 'vertical' && 'resize-y',
            resize === 'horizontal' && 'resize-x',
            resize === 'both' && 'resize',
            className
          )}
          ref={textareaRef}
          {...props}
        />
        
        {/* Helper Text */}
        {helperText && (
          <p className={cn(
            'mt-1 text-sm',
            error ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// Auto-growing Textarea variant
const AutoGrowTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        autoResize
        resize="none"
        className={cn('min-h-[40px]', className)}
        {...props}
      />
    );
  }
);
AutoGrowTextarea.displayName = 'AutoGrowTextarea';

// Code Textarea variant (for code input)
const CodeTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        className={cn(
          'font-mono text-sm',
          'bg-muted/30',
          'border-border',
          className
        )}
        spellCheck={false}
        {...props}
      />
    );
  }
);
CodeTextarea.displayName = 'CodeTextarea';

// Message Textarea variant (with character count)
interface MessageTextareaProps extends TextareaProps {
  maxLength?: number;
  showCount?: boolean;
}

const MessageTextarea = React.forwardRef<HTMLTextAreaElement, MessageTextareaProps>(
  ({ className, maxLength, showCount = true, helperText, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    const isNearLimit = maxLength && charCount > maxLength * 0.8;
    const isOverLimit = maxLength && charCount > maxLength;

    return (
      <div className="relative">
        <Textarea
          ref={ref}
          className={cn(
            'pb-6', // Extra padding for character count
            className
          )}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        
        {/* Character Count */}
        {showCount && (
          <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
            <span className={cn(
              isOverLimit && 'text-destructive',
              isNearLimit && !isOverLimit && 'text-warning-600'
            )}>
              {charCount}
            </span>
            {maxLength && (
              <span className="text-muted-foreground">/{maxLength}</span>
            )}
          </div>
        )}
        
        {/* Helper Text */}
        {helperText && (
          <p className={cn(
            'mt-1 text-sm',
            isOverLimit ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
MessageTextarea.displayName = 'MessageTextarea';

export { Textarea, AutoGrowTextarea, CodeTextarea, MessageTextarea };
