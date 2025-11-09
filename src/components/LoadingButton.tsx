import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

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
    primary: 'bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground',
    secondary: 'bg-secondary hover:bg-secondary/80 disabled:bg-secondary/50 text-secondary-foreground',
    danger: 'bg-destructive hover:bg-destructive/90 disabled:bg-destructive/50 text-destructive-foreground',
    success: 'bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 dark:bg-green-700 dark:hover:bg-green-800 text-white'
  };

  return (
    <button
      className={`
        relative flex items-center justify-center gap-2 px-4 py-2 rounded-lg
        font-medium transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-60
        active:scale-95 overflow-hidden
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring
        shadow-sm hover:shadow-md
        ${variantClasses[variant]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
      <span>{isLoading && loadingText ? loadingText : children}</span>
    </button>
  );
}
