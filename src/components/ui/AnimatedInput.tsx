/**
 * AnimatedInput Component
 * 
 * Enhanced input field with floating label and validation animations.
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
import { shake } from '../../utils/animations';
import { Check, AlertCircle } from 'lucide-react';
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
  className = '',
  isDarkMode = true,
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
        ...shake(),
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

  const baseClasses = `
    w-full px-4 py-3 rounded-lg
    ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}
    border-2
    ${
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : success
        ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
        : isDarkMode
        ? 'border-slate-700 focus:border-blue-500 focus:ring-blue-500'
        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
    }
    focus:outline-none focus:ring-2 focus:ring-offset-0
    ${!isReducedMotion ? 'transition-all duration-200' : ''}
    ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${label ? 'pt-6' : ''}
    ${className}
  `;

  const labelClasses = `
    absolute left-4 pointer-events-none
    ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}
    ${!isReducedMotion ? 'transition-all duration-200' : ''}
    ${
      isLabelFloating
        ? 'top-1.5 text-xs'
        : 'top-1/2 -translate-y-1/2 text-base'
    }
    ${error ? 'text-red-500' : success ? 'text-green-500' : ''}
  `;

  return (
    <div className="relative">
      <div className="relative">
        {/* Input/Textarea */}
        {variant === 'textarea' ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className={baseClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={maxLength}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            className={baseClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={maxLength}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {/* Floating Label */}
        {label && (
          <label className={labelClasses}>
            {label}
          </label>
        )}

        {/* Success Icon */}
        {success && !error && (
          <div
            className={`
              absolute right-3 top-1/2 -translate-y-1/2
              text-green-500
              ${!isReducedMotion ? 'animate-scale-in' : ''}
            `}
          >
            <Check className="w-5 h-5" />
          </div>
        )}

        {/* Error Icon */}
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
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
              className={`
                text-red-500 flex items-center gap-1
                ${!isReducedMotion ? 'animate-slide-in-down' : ''}
              `}
            >
              {error}
            </p>
          ) : helperText ? (
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
              {helperText}
            </p>
          ) : null}
        </div>

        {/* Right side: Character count */}
        {showCharCount && maxLength && (
          <p
            className={`
              ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}
              ${charCount > maxLength * 0.9 ? 'text-yellow-500' : ''}
              ${charCount >= maxLength ? 'text-red-500 font-semibold' : ''}
              ${!isReducedMotion ? 'transition-colors duration-200' : ''}
            `}
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
  isDarkMode?: boolean;
  className?: string;
}

export function AnimatedInputGroup({
  inputs,
  isDarkMode = true,
  className = '',
}: AnimatedInputGroupProps) {
  return (
    <div className={`space-y-4 ${className}`}>
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
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
}
