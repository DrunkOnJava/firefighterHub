/**
 * Floating Action Button (FAB) Component
 * 
 * Mobile-inspired floating action button for primary actions.
 * Always visible, positioned in corner for easy thumb access.
 * 
 * Features:
 * - Fixed positioning (bottom-right by default)
 * - Responsive sizing (56px mobile, 64px desktop)
 * - Hover tooltip on desktop
 * - Scale animation on hover
 * - Focus ring for keyboard navigation
 * - High z-index (above most content)
 * 
 * Usage:
 * ```tsx
 * <FloatingActionButton
 *   icon={Plus}
 *   label="Quick Add Firefighter"
 *   onClick={handleQuickAdd}
 *   position="bottom-right"
 *   variant="primary"
 * />
 * ```
 */

import { LucideIcon } from 'lucide-react';

interface FABProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left';
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  isDarkMode?: boolean;
}

export const FloatingActionButton = ({
  icon: Icon,
  label,
  onClick,
  position = 'bottom-right',
  variant = 'primary',
  isDarkMode = true,
}: FABProps) => {
  // Position classes - responsive positioning
  const positionClasses = {
    'bottom-right': 'bottom-24 right-6 lg:bottom-8 lg:right-8',
    'bottom-left': 'bottom-24 left-6 lg:bottom-8 lg:left-8',
  };

  // Variant classes - different action types
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-blue-500/30',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-gray-500/30',
    success: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-emerald-500/30',
    danger: 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-500/30',
  };

  // Tooltip classes - desktop only
  const tooltipClasses = `
    hidden lg:block
    absolute right-full mr-3 top-1/2 -translate-y-1/2
    px-3 py-1.5
    rounded-md shadow-lg
    text-sm font-medium
    whitespace-nowrap
    pointer-events-none
    opacity-0 group-hover:opacity-100 group-focus:opacity-100
    transition-opacity duration-200
    ${isDarkMode
      ? 'bg-slate-800 text-white'
      : 'bg-slate-900 text-white'
    }
  `;

  return (
    <button
      onClick={onClick}
      className={`
        fixed ${positionClasses[position]}
        z-40
        w-14 h-14 lg:w-16 lg:h-16
        ${variantClasses[variant]}
        rounded-full shadow-2xl
        hover:scale-110
        focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500
        transition-all duration-200
        group
      `}
      aria-label={label}
      title={label}
      type="button"
    >
      {/* Icon - scales on hover */}
      <Icon 
        className="w-8 h-8 mx-auto group-hover:scale-110 transition-transform" 
        aria-hidden="true"
      />
      
      {/* Tooltip - desktop only, shown on hover/focus */}
      <span className={tooltipClasses}>
        {label}
      </span>
    </button>
  );
};
