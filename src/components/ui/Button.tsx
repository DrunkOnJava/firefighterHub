import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { tokens, colorsM3 } from "../../styles";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
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

    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 relative overflow-hidden";

    const variants = {
      primary: `bg-[${colorsM3.primary.primary}] hover:bg-[#5a4095] active:bg-[#4a3080] text-white focus:ring-[${colorsM3.primary.primary}] shadow-sm hover:shadow-md`,
      secondary: `bg-[${colorsM3.secondary.secondary}] hover:bg-[#54524a] active:bg-[#3f3b35] text-white focus:ring-[${colorsM3.secondary.secondary}] shadow-sm hover:shadow-md`,
      ghost: `bg-transparent hover:bg-white/8 active:bg-white/12 text-[${colorsM3.neutral.onSurface}] focus:ring-[${colorsM3.secondary.secondary}]`,
      danger: `bg-[${colorsM3.error.error}] hover:bg-[#dc2626] active:bg-[#b91c1c] text-white focus:ring-[${colorsM3.error.error}] shadow-sm hover:shadow-md`,
      success: `bg-[${colorsM3.success.success}] hover:bg-[#059669] active:bg-[#047857] text-white focus:ring-[${colorsM3.success.success}] shadow-sm hover:shadow-md`,
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2 text-md gap-2",
      lg: "px-6 py-3 text-lg gap-2.5",
    };

    const iconSizes = {
      sm: tokens.icons.sm,    // 16px - matches text-sm
      md: tokens.icons.md,    // 20px - matches text-base/text-md
      lg: tokens.icons.lg,    // 24px - matches text-lg
    };

    return (
      <button
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? "w-full" : ""}
          ${withRipple ? "btn-ripple" : ""}
          ${className}
        `}
        disabled={disabled || isLoading}
        onClick={onClick}
        {...props}
      >
        {isLoading && (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        )}
        {!isLoading && leftIcon && (
          <span className="flex-shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
