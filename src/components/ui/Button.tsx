import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { tokens } from "../../styles";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
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
      primary:
        "bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white focus:ring-primary-500 shadow-sm hover:shadow-md",
      secondary:
        "bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-text-primary dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-text-dark-primary focus:ring-gray-400 shadow-sm hover:shadow-md",
      ghost:
        "bg-transparent hover:bg-gray-100 active:bg-gray-200 text-text-secondary dark:hover:bg-gray-800 dark:text-text-dark-secondary focus:ring-gray-400",
      danger:
        "bg-error-500 hover:bg-error-600 active:bg-error-700 text-white focus:ring-error-500 shadow-sm hover:shadow-md",
      success:
        "bg-success-500 hover:bg-success-600 active:bg-success-700 text-white focus:ring-success-500 shadow-sm hover:shadow-md",
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
