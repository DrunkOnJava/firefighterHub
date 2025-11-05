import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { colors, tokens } from '../styles';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export function LoadingButton({
  isLoading = false,
  loadingText,
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: LoadingButtonProps) {
  const variantClasses = {
    primary: `${colors.semantic.primary.solid} ${colors.semantic.primary.hover} disabled:bg-blue-800 text-white`,
    secondary: `${colors.components.button.secondary} disabled:bg-gray-800`,
    danger: `${colors.semantic.error.solid} ${colors.semantic.error.hover} disabled:bg-red-800 text-white`,
    success: `${colors.semantic.success.solid} ${colors.semantic.success.hover} disabled:bg-green-800 text-white`
  };

  return (
    <button
      className={`
        relative flex items-center justify-center ${tokens.spacing.gap.sm} px-4 py-2 ${tokens.borders.radius.lg}
        font-medium transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-60
        ${variantClasses[variant]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className={`${tokens.icons.sm} animate-spin`} />
      )}
      <span>{isLoading && loadingText ? loadingText : children}</span>
    </button>
  );
}
