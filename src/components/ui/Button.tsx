import { Loader2, Check, X } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef, useRef, useEffect } from "react";
import { tokens } from "../../styles";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useAnimation } from "../../hooks/useAnimation";
import { createRipple, shake } from "../../utils/animations";

export type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  /** @deprecated Use state="loading" instead */
  isLoading?: boolean;
  /** Button state for async operations */
  state?: ButtonState;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /**
   * Enable ripple effect on click for important actions.
   * Automatically respects prefers-reduced-motion.
   * @default false
   */
  withRipple?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      state = 'idle',
      fullWidth = false,
      withRipple = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const buttonRef = (ref as React.RefObject<HTMLButtonElement>) || internalRef;
    const isReducedMotion = useReducedMotion();
    const { animate } = useAnimation();

    // Support both isLoading prop (backward compat) and state prop
    const effectiveState = isLoading ? 'loading' : state;
    const isButtonDisabled = disabled || effectiveState === 'loading';

    // Handle ripple effect on click
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isButtonDisabled) return;

      // Create ripple effect if enabled
      if (withRipple && !isReducedMotion) {
        const rippleColor = variant === 'primary' || variant === 'danger' || variant === 'success'
          ? 'rgba(255, 255, 255, 0.4)'
          : 'rgba(0, 0, 0, 0.1)';
        createRipple(event, rippleColor);
      }

      onClick?.(event);
    };

    // Trigger shake animation on error state
    useEffect(() => {
      if (effectiveState === 'error' && buttonRef.current && !isReducedMotion) {
        animate({
          element: buttonRef.current,
          ...shake(),
          name: 'button-error-shake',
        });
      }
    }, [effectiveState, animate, isReducedMotion, buttonRef]);

    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";
    
    // Add scale animation unless reduced motion is preferred
    const scaleAnimation = !isReducedMotion && !isButtonDisabled ? 'active:scale-95' : '';

    const variants = {
      primary:
        "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md",
      secondary:
        "bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-sm hover:shadow-md",
      ghost:
        "bg-transparent hover:bg-accent text-foreground",
      danger:
        "bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm hover:shadow-md",
      success:
        "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5 min-h-[40px]",
      md: "px-4 py-2 text-md gap-2 min-h-[44px]",
      lg: "px-6 py-3 text-lg gap-2.5 min-h-[48px]",
    };

    const iconSizes = {
      sm: tokens.icons.sm,    // 16px - matches text-sm
      md: tokens.icons.md,    // 20px - matches text-base/text-md
      lg: tokens.icons.lg,    // 24px - matches text-lg
    };

    // Determine what icon to show based on state
    const getStateIcon = () => {
      if (effectiveState === 'loading') {
        return <Loader2 className={`${iconSizes[size]} animate-spin`} />;
      }
      if (effectiveState === 'success') {
        return <Check className={`${iconSizes[size]} text-success-500`} />;
      }
      if (effectiveState === 'error') {
        return <X className={`${iconSizes[size]} text-error-500`} />;
      }
      return null;
    };

    const stateIcon = getStateIcon();
    const showLeftIcon = !stateIcon && leftIcon;
    const showRightIcon = !stateIcon && rightIcon;

    return (
      <button
        ref={buttonRef}
        className={`
          ${baseStyles}
          ${scaleAnimation}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? "w-full" : ""}
          ${withRipple ? "btn-ripple" : ""}
          ${className}
        `}
        disabled={isButtonDisabled}
        onClick={handleClick}
        aria-busy={effectiveState === 'loading'}
        aria-live={effectiveState === 'success' || effectiveState === 'error' ? 'polite' : undefined}
        {...props}
      >
        {stateIcon && <span className="flex-shrink-0">{stateIcon}</span>}
        {showLeftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {showRightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
