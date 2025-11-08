import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  variant?: 'default' | 'primary';
}

/**
 * FloatingActionButton (FAB) - Material Design inspired floating action button
 * 
 * Features:
 * - 56×56px touch target (exceeds WCAG 2.5.5 44px minimum)
 * - Fixed positioning in bottom-right (Z-pattern endpoint)
 * - Prominent gradient styling for primary actions
 * - Smooth scale animation on hover
 * - High z-index for visibility above content
 * - Mobile-optimized positioning
 * 
 * Usage: Primary action that should be accessible from any scroll position
 * 
 * @example
 * ```tsx
 * <FloatingActionButton 
 *   onClick={handleQuickAdd}
 *   label="Quick Add Firefighter"
 * />
 * ```
 */
export const FloatingActionButton = ({
  onClick,
  label = 'Quick Add',
  icon: Icon = Plus,
  className = '',
  variant = 'primary',
}: FloatingActionButtonProps) => {
  const variantClasses = {
    default: `
      bg-slate-700 text-white
      hover:bg-slate-600
      shadow-lg hover:shadow-xl
    `,
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700
      text-white
      hover:from-blue-500 hover:to-blue-600
      shadow-2xl hover:shadow-3xl
    `,
  };

  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-24 right-6 lg:bottom-8 lg:right-8
        z-40
        w-14 h-14
        ${variantClasses[variant]}
        rounded-full
        inline-flex items-center justify-center
        hover:scale-110
        focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        dark:focus-visible:ring-offset-slate-900
        active:scale-95
        transition-all duration-200
        ${className}
      `}
      aria-label={label}
      type="button"
    >
      <Icon className="w-8 h-8" aria-hidden="true" />
    </button>
  );
};
