/**
 * IconButton Component
 * 
 * WCAG 2.5.5 compliant icon button with 44×44px minimum touch target.
 * Creates larger clickable area while maintaining 24×24px icon visual size.
 * 
 * Features:
 * - Touch-friendly 44×44px minimum size
 * - Accessible labels via aria-label and title
 * - Focus indicators (ring-2)
 * - Variants for different contexts
 * - Size options (sm: 40px, md: 44px, lg: 48px)
 * 
 * Usage:
 * ```tsx
 * <IconButton
 *   icon={HelpCircle}
 *   label="Open help"
 *   onClick={handleHelp}
 *   variant="default"
 *   size="md"
 * />
 * ```
 */

import { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string; // For aria-label and tooltip
  variant?: 'default' | 'primary' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isDarkMode?: boolean;
}

export const IconButton = ({
  icon: Icon,
  label,
  variant = 'default',
  size = 'md',
  isDarkMode = true,
  className = '',
  ...props
}: IconButtonProps) => {
  // Size classes - ensures WCAG 2.5.5 compliance (44×44px minimum)
  const sizeClasses = {
    xs: 'min-w-[28px] min-h-[28px] p-0.5',      // 28×28px (compact table rows only)
    sm: 'min-w-[40px] min-h-[40px] p-2',        // 40×40px (acceptable for less critical actions)
    md: 'min-w-[44px] min-h-[44px] p-2.5',      // 44×44px (WCAG compliant)
    lg: 'min-w-[48px] min-h-[48px] p-3',        // 48×48px (extra comfortable)
  };

  // Icon sizes - visual size (not touch target)
  const iconSizes = {
    xs: 'w-4 h-4',   // 16px (compact)
    sm: 'w-5 h-5',   // 20px
    md: 'w-6 h-6',   // 24px (standard)
    lg: 'w-7 h-7',   // 28px
  };

  // Variant classes - different contexts
  const variantClasses = {
    default: isDarkMode
      ? 'text-slate-400 hover:text-white hover:bg-slate-700'
      : 'text-gray-600 hover:text-slate-900 hover:bg-slate-100',
    primary: isDarkMode
      ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20'
      : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
    danger: isDarkMode
      ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
      : 'text-red-600 hover:text-red-700 hover:bg-red-50',
    success: isDarkMode
      ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20'
      : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50',
  };

  // Focus ring - always visible on keyboard focus
  const focusClasses = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';
  
  // Focus ring offset background
  const focusRingOffsetClasses = isDarkMode
    ? 'focus-visible:ring-offset-slate-900'
    : 'focus-visible:ring-offset-white';

  return (
    <button
      className={`
        inline-flex items-center justify-center
        ${sizeClasses[size]}
        rounded-md
        ${variantClasses[variant]}
        ${focusClasses}
        ${focusRingOffsetClasses}
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent
        ${className}
      `}
      aria-label={label}
      title={label}
      type="button"
      {...props}
    >
      <Icon className={iconSizes[size]} aria-hidden="true" />
    </button>
  );
};
