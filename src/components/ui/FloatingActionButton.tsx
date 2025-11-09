/**
 * Floating Action Button (FAB) Component
 * 
 * Mobile-inspired floating action button for primary actions.
 * Always visible, positioned in corner for easy thumb access.
 * Migrated to use shadcn Button with semantic colors.
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
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const fabVariants = cva(
  'fixed z-40 w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-2xl hover:scale-110 focus-visible:ring-4 transition-all duration-200 group',
  {
    variants: {
      position: {
        'bottom-right': 'bottom-24 right-6 lg:bottom-8 lg:right-8',
        'bottom-left': 'bottom-24 left-6 lg:bottom-8 lg:left-8',
      },
      variant: {
        primary: 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-primary/30',
        secondary: 'bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary/80 text-secondary-foreground shadow-secondary/30',
        success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-green-500/30',
        danger: 'bg-gradient-to-r from-destructive to-destructive/90 hover:from-destructive/90 hover:to-destructive/80 text-destructive-foreground shadow-destructive/30',
      },
    },
    defaultVariants: {
      position: 'bottom-right',
      variant: 'primary',
    },
  }
);

interface FABProps extends VariantProps<typeof fabVariants> {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  /** @deprecated No longer needed - uses Tailwind dark: variants */
  isDarkMode?: boolean;
}

export const FloatingActionButton = ({
  icon: Icon,
  label,
  onClick,
  position = 'bottom-right',
  variant = 'primary',
}: FABProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(fabVariants({ position, variant }))}
      aria-label={label}
      title={label}
      type="button"
    >
      <Icon 
        className="w-8 h-8 mx-auto group-hover:scale-110 transition-transform" 
        aria-hidden="true"
      />
      
      <span className="hidden lg:block absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md shadow-lg text-sm font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 bg-popover text-popover-foreground">
        {label}
      </span>
    </button>
  );
};
