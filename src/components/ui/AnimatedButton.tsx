/**
 * AnimatedButton Component (shadcn Button wrapper with animations)
 * 
 * Enhanced button with micro-interactions:
 * - Press-down scale effect
 * - Ripple effect on click
 * - Loading state with spinner (Loader2 icon)
 * - Success checkmark animation
 * - Error shake animation
 * - Respects prefers-reduced-motion
 * - Uses semantic colors (no isDarkMode needed)
 * 
 * Usage:
 * ```tsx
 * <AnimatedButton
 *   onClick={handleSubmit}
 *   state="loading"
 *   variant="default"
 * >
 *   Submit
 * </AnimatedButton>
 * ```
 */

import { ReactNode, useRef, useEffect, useState } from 'react';
import { useAnimation } from '../../hooks/useAnimation';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { createRipple, shake } from '../../utils/animations';
import { Check, Loader2 } from 'lucide-react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

export type ButtonState = 'idle' | 'hover' | 'active' | 'loading' | 'success' | 'error' | 'disabled';
export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface AnimatedButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  children: ReactNode;
  state?: ButtonState;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

// Map legacy variants to shadcn variants
const variantMap: Record<ButtonVariant, ButtonProps['variant']> = {
  default: 'default',
  primary: 'default',
  secondary: 'secondary',
  danger: 'destructive',
  ghost: 'ghost',
  success: 'default',
};

// Map legacy sizes to shadcn sizes
const sizeMap: Record<ButtonSize, ButtonProps['size']> = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
};

export function AnimatedButton({
  children,
  state = 'idle',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  className,
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
      const rippleColor = variant === 'primary' || variant === 'default'
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

  // Success variant uses green colors
  const successClasses = variant === 'success' 
    ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
    : '';

  return (
    <Button
      ref={buttonRef}
      variant={variantMap[variant]}
      size={sizeMap[size]}
      className={cn(
        'relative overflow-hidden transition-all duration-150 min-h-[44px]',
        !isReducedMotion && !isDisabled && 'active:scale-95',
        fullWidth && 'w-full',
        successClasses,
        className
      )}
      onClick={handleClick}
      disabled={isDisabled}
      aria-busy={state === 'loading'}
      {...props}
    >
      {/* Loading Spinner */}
      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      )}

      {/* Success Checkmark */}
      {state === 'success' && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center bg-inherit',
          !isReducedMotion && 'animate-in zoom-in-50 duration-200'
        )}>
          <Check className="w-6 h-6" />
        </div>
      )}

      {/* Content (hidden during loading/success) */}
      <span
        className={cn(
          'flex items-center justify-center gap-2 transition-opacity duration-150',
          (state === 'loading' || state === 'success') ? 'opacity-0' : 'opacity-100'
        )}
      >
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </span>
    </Button>
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
}: Omit<AnimatedButtonProps, 'onClick'> & {
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
