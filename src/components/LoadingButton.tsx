import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  isDarkMode?: boolean;
}

export function LoadingButton({
  isLoading = false,
  loadingText,
  children,
  variant = 'primary',
  isDarkMode = true,
  className = '',
  disabled,
  ...props
}: LoadingButtonProps) {
  const variantClasses = {
    primary: isDarkMode
      ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white'
      : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white',
    secondary: isDarkMode
      ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white'
      : 'bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white',
    success: 'bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white'
  };

  return (
    <button
      className={`
        relative flex items-center justify-center gap-2 px-4 py-2 rounded-lg
        font-medium transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-60
        ${variantClasses[variant]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      <span>{isLoading && loadingText ? loadingText : children}</span>
    </button>
  );
}
