/**
 * AnimatedInput Component (shadcn Input + Label wrapper with animations)
 * 
 * Enhanced input field with floating label and validation animations.
 * Uses semantic colors (no isDarkMode needed).
 * 
 * Features:
 * - Floating label animation
 * - Focus ring expansion effect
 * - Error shake animation
 * - Success checkmark fade-in
 * - Character count animation
 * - Auto-resize for textareas
 * - Respects prefers-reduced-motion
 * 
 * Usage:
 * ```tsx
 * <AnimatedInput
 *   label="Email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={emailError}
 *   success={emailValid}
 *   type="email"
 * />
 * ```
 */

import { InputHTMLAttributes, TextareaHTMLAttributes, useEffect, useRef, useState } from 'react';
import { useAnimation } from '../../hooks/useAnimation';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Check, AlertCircle } from 'lucide-react';
import { Input } from './input';
import { Label } from './label';
import { cn } from '@/lib/utils';
import '../../styles/animations.css';

type InputVariant = 'text' | 'textarea';

interface BaseInputProps {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
  variant?: InputVariant;
  className?: string;
  /** @deprecated No longer needed - uses dark: variants automatically */
  isDarkMode?: boolean;
}

type AnimatedInputProps = BaseInputProps &
  (
    | ({ variant?: 'text' } & InputHTMLAttributes<HTMLInputElement>)
    | ({ variant: 'textarea' } & TextareaHTMLAttributes<HTMLTextAreaElement>)
  );

export function AnimatedInput({
  label,
  error,
  success = false,
  helperText,
  maxLength,
  showCharCount = false,
  variant = 'text',
  className,
  ...props
}: AnimatedInputProps) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { animate } = useAnimation();
  const isReducedMotion = useReducedMotion();
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const hasValue =
    (props.value !== undefined && props.value !== '') ||
    (props.defaultValue !== undefined && props.defaultValue !== '');

  const isLabelFloating = isFocused || hasValue;

  // Trigger shake animation on error
  useEffect(() => {
    if (error && inputRef.current && !isReducedMotion) {
      animate({
        element: inputRef.current,
        keyframes: [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-10px)' },
          { transform: 'translateX(10px)' },
          { transform: 'translateX(-10px)' },
          { transform: 'translateX(10px)' },
          { transform: 'translateX(0)' },
        ],
        duration: 400,
        name: 'input-error-shake',
      });
    }
  }, [error, animate, isReducedMotion]);

  // Auto-resize textarea
  useEffect(() => {
    if (variant === 'textarea' && inputRef.current) {
      const textarea = inputRef.current as HTMLTextAreaElement;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [props.value, variant]);

  // Track character count
  useEffect(() => {
    if (props.value !== undefined) {
      setCharCount(String(props.value).length);
    }
  }, [props.value]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(true);
    if (variant === 'text') {
      (props as InputHTMLAttributes<HTMLInputElement>).onFocus?.(e as React.FocusEvent<HTMLInputElement>);
    } else {
      (props as TextareaHTMLAttributes<HTMLTextAreaElement>).onFocus?.(e as React.FocusEvent<HTMLTextAreaElement>);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    if (variant === 'text') {
      (props as InputHTMLAttributes<HTMLInputElement>).onBlur?.(e as React.FocusEvent<HTMLInputElement>);
    } else {
      (props as TextareaHTMLAttributes<HTMLTextAreaElement>).onBlur?.(e as React.FocusEvent<HTMLTextAreaElement>);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        {/* Input/Textarea */}
        {variant === 'textarea' ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className={cn(
              'w-full px-4 py-3 rounded-lg bg-background text-foreground',
              'border-2',
              error
                ? 'border-destructive focus:border-destructive focus:ring-destructive'
                : success
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                : 'border-input focus:border-ring focus:ring-ring',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              !isReducedMotion && 'transition-all duration-200',
              props.disabled && 'opacity-50 cursor-not-allowed',
              label && 'pt-6',
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={maxLength}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            className={cn(
              'h-auto px-4 py-3 rounded-lg',
              'border-2',
              error
                ? 'border-destructive focus-visible:ring-destructive'
                : success
                ? 'border-green-500 focus-visible:ring-green-500'
                : '',
              !isReducedMotion && 'transition-all duration-200',
              label && 'pt-6',
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={maxLength}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {/* Floating Label */}
        {label && (
          <Label
            className={cn(
              'absolute left-4 pointer-events-none text-muted-foreground',
              !isReducedMotion && 'transition-all duration-200',
              isLabelFloating
                ? 'top-1.5 text-xs'
                : 'top-1/2 -translate-y-1/2 text-base',
              error ? 'text-destructive' : success ? 'text-green-500' : ''
            )}
          >
            {label}
          </Label>
        )}

        {/* Success Icon */}
        {success && !error && (
          <div
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-green-500',
              !isReducedMotion && 'animate-in zoom-in-50 duration-200'
            )}
          >
            <Check className="w-5 h-5" />
          </div>
        )}

        {/* Error Icon */}
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
            <AlertCircle className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Helper Text / Error Message / Character Count */}
      <div className="mt-1.5 flex items-center justify-between text-sm">
        {/* Left side: Helper text or error */}
        <div className="flex-1">
          {error ? (
            <p
              className={cn(
                'text-destructive flex items-center gap-1',
                !isReducedMotion && 'animate-in slide-in-from-top-1 duration-200'
              )}
            >
              {error}
            </p>
          ) : helperText ? (
            <p className="text-muted-foreground">
              {helperText}
            </p>
          ) : null}
        </div>

        {/* Right side: Character count */}
        {showCharCount && maxLength && (
          <p
            className={cn(
              'text-muted-foreground',
              charCount > maxLength * 0.9 && 'text-yellow-500',
              charCount >= maxLength && 'text-destructive font-semibold',
              !isReducedMotion && 'transition-colors duration-200'
            )}
          >
            {charCount} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * AnimatedInputGroup Component
 * Group of related inputs with consistent styling
 */
interface InputGroupItem {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  value?: string;
  onChange?: (value: string) => void;
}

interface AnimatedInputGroupProps {
  inputs: InputGroupItem[];
  /** @deprecated No longer needed - uses dark: variants automatically */
  isDarkMode?: boolean;
  className?: string;
}

export function AnimatedInputGroup({
  inputs,
  className,
}: AnimatedInputGroupProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {inputs.map((input) => (
        <AnimatedInput
          key={input.id}
          label={input.label}
          type={input.type}
          placeholder={input.placeholder}
          error={input.error}
          success={input.success}
          helperText={input.helperText}
          value={input.value}
          onChange={(e) => input.onChange?.(e.target.value)}
        />
      ))}
    </div>
  );
}
