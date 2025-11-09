/**
 * AnimatedButton Component
 * 
 * Enhanced button with micro-interactions:
 * - Press-down scale effect
 * - Ripple effect on click
 * - Loading state with spinner
 * - Success checkmark animation
 * - Error shake animation
 * - Respects prefers-reduced-motion
 * 
 * Usage:
 * ```tsx
 * <AnimatedButton
 *   onClick={handleSubmit}
 *   state="loading"
 *   variant="primary"
 * >
 *   Submit
 * </AnimatedButton>
 * ```
 */

import { ButtonHTMLAttributes, ReactNode, useRef, useEffect, useState } from 'react';
import { useAnimation } from '../../hooks/useAnimation';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { createRipple, shake } from '../../utils/animations';
import { Check } from 'lucide-react';
import '../../styles/animations.css';

export type ButtonState = 'idle' | 'hover' | 'active' | 'loading' | 'success' | 'error' | 'disabled';
export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  state?: ButtonState;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export function AnimatedButton({
  children,
  state = 'idle',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  className = '',
  disabled,
  ...props
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { animate } = useAnimation();
  const isReducedMotion = useReducedMotion();

  const isDisabled = disabled || state === 'disabled' || state === 'loading';

  // Handle click with ripple effect
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;

    // Create ripple effect
    if (!isReducedMotion) {
      const rippleColor = variant === 'primary' 
        ? 'rgba(255, 255, 255, 0.4)' 
        : 'rgba(0, 0, 0, 0.1)';
      createRipple(event, rippleColor);
    }

    // Call original onClick
    onClick?.(event);
  };

  // Trigger shake animation on error state
  useEffect(() => {
    if (state === 'error' && buttonRef.current && !isReducedMotion) {
      animate({
        element: buttonRef.current,
        ...shake(),
        name: 'button-error-shake',
      });
    }
  }, [state, animate, isReducedMotion]);

  // Variant styles
  const variantClasses = {
    default: `
      bg-gradient-to-r from-orange-500 to-orange-600 
      hover:from-orange-600 hover:to-orange-700
      text-white
      shadow-md hover:shadow-lg
      border-2 border-orange-600
    `,
    primary: `
      bg-gradient-to-r from-orange-500 to-orange-600 
      hover:from-orange-600 hover:to-orange-700
      text-white
      shadow-md hover:shadow-lg
      border-2 border-orange-600
    `,
    secondary: `
      bg-slate-700 hover:bg-slate-600
      text-white
      border-2 border-slate-600
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      hover:from-red-600 hover:to-red-700
      text-white
      shadow-md hover:shadow-lg
      border-2 border-red-600
    `,
    success: `
      bg-gradient-to-r from-green-500 to-green-600
      hover:from-green-600 hover:to-green-700
      text-white
      shadow-md hover:shadow-lg
      border-2 border-green-600
    `,
    ghost: `
      bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800
      text-slate-700 dark:text-slate-300
      border-2 border-transparent hover:border-slate-300
    `,
  };

  // Size styles - WCAG 2.5.5 Touch Target Compliance
  const sizeClasses = {
    sm: 'px-3 py-2.5 text-sm min-h-[44px]',      // Updated: 36px → 44px (WCAG AA)
    md: 'px-4 py-2 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[52px]',
  };

  const baseClasses = `
    relative
    inline-flex items-center justify-center gap-2
    font-semibold
    rounded-lg
    transition-all duration-150
    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
    overflow-hidden
    ${!isReducedMotion && !isDisabled ? 'active:scale-95' : ''}
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${fullWidth ? 'w-full' : ''}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <button
      ref={buttonRef}
      className={baseClasses}
      onClick={handleClick}
      disabled={isDisabled}
      aria-busy={state === 'loading'}
      {...props}
    >
      {/* Loading Spinner */}
      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="spinner w-5 h-5 border-2 border-white border-l-transparent" />
        </div>
      )}

      {/* Success Checkmark */}
      {state === 'success' && (
        <div className={`absolute inset-0 flex items-center justify-center bg-inherit ${!isReducedMotion ? 'animate-scale-in' : ''}`}>
          <Check className="w-6 h-6" />
        </div>
      )}

      {/* Content (hidden during loading/success) */}
      <span
        className={`
          flex items-center justify-center gap-2
          ${state === 'loading' || state === 'success' ? 'opacity-0' : 'opacity-100'}
          transition-opacity duration-150
        `}
      >
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </span>
    </button>
  );
}

/**
 * Async button that automatically handles loading/success/error states
 */
export function AsyncButton({
  onClick,
  children,
  successDuration = 2000,
  ...props
}: AnimatedButtonProps & {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  successDuration?: number;
}) {
  const [state, setState] = useState<ButtonState>('idle');

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setState('loading');

    try {
      await onClick(event);
      setState('success');
      
      // Reset to idle after success duration
      setTimeout(() => {
        setState('idle');
      }, successDuration);
    } catch (error) {
      setState('error');
      
      // Reset to idle after error shake
      setTimeout(() => {
        setState('idle');
      }, 500);
      
      throw error;
    }
  };

  return (
    <AnimatedButton
      {...props}
      state={state}
      onClick={(e) => {
        // Prevent multiple clicks during async operation
        if (state === 'loading' || state === 'success') {
          e.preventDefault();
          return;
        }
        handleClick(e);
      }}
    >
      {children}
    </AnimatedButton>
  );
}
