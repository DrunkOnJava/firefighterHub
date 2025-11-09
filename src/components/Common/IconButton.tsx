import { type LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'primary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * IconButton - WCAG 2.5.5 compliant icon button with 44×44px minimum touch target
 * 
 * Features:
 * - Minimum 44×44px clickable area (WCAG 2.5.5 AA)
 * - Accessible label for screen readers
 * - Focus-visible ring for keyboard navigation
 * - Hover/active states with smooth transitions
 * - Variant support for different contexts
 * 
 * @example
 * ```tsx
 * <IconButton 
 *   icon={HelpCircle} 
 *   label="Open help documentation" 
 *   onClick={handleHelp}
 *   variant="primary"
 * />
 * ```
 */
export const IconButton = ({
  icon: Icon,
  label,
  onClick,
  className = '',
  variant = 'default',
  size = 'md',
  disabled = false,
  type = 'button',
}: IconButtonProps) => {
  // Size configurations
  const sizeClasses = {
    sm: 'min-w-[44px] min-h-[44px] p-2',    // 24px icon + 10px padding each side = 44px
    md: 'min-w-[44px] min-h-[44px] p-2.5',  // 24px icon + 10px padding each side = 44px
    lg: 'min-w-[48px] min-h-[48px] p-3',    // 24px icon + 12px padding each side = 48px
  };

  const iconSizes = {
    sm: 'w-5 h-5',  // 20px
    md: 'w-6 h-6',  // 24px
    lg: 'w-7 h-7',  // 28px
  };

  // Variant configurations
  const variantClasses = {
    default: `
      text-slate-400 hover:text-white hover:bg-slate-700/50
      dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700/50
    `,
    primary: `
      text-blue-600 hover:text-blue-500 hover:bg-blue-50
      dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30
    `,
    danger: `
      text-red-600 hover:text-red-500 hover:bg-red-50
      dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30
    `,
  };

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        ${sizeClasses[size]}
        rounded-md
        ${variantClasses[variant]}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        dark:focus-visible:ring-offset-slate-900
        transition-all duration-200
        ${disabledClasses}
        ${className}
      `}
      aria-label={label}
    >
      <Icon className={iconSizes[size]} aria-hidden="true" />
    </button>
  );
};
