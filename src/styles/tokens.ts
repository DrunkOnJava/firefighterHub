/**
 * Design Tokens - Single Source of Truth for Visual Design
 * 
 * This file defines all spacing, typography, shadows, borders, and other design tokens.
 * Use these instead of hardcoded Tailwind classes for consistency.
 * 
 * @see src/styles/README.md for usage guidelines
 */

export const tokens = {
  /**
   * Spacing System
   * 
   * Reduced by ~30% from previous values for better information density.
   * Based on Tailwind's spacing scale (4px base unit).
   */
  spacing: {
    /** Card padding - use for card containers */
    card: {
      sm: 'p-3',      // 12px (was p-4 = 16px)
      md: 'p-4',      // 16px (was p-5/p-6 = 20px/24px)
      lg: 'p-5',      // 20px (was p-6 = 24px)
      xl: 'p-6',      // 24px
    },
    
    /** Modal padding - slightly more generous than cards */
    modal: {
      sm: 'p-4',      // 16px
      md: 'p-5',      // 20px (was p-6 = 24px)
      lg: 'p-6',      // 24px
      xl: 'p-8',      // 32px
    },
    
    /** Section padding - internal sections within components */
    section: {
      sm: 'p-2',      // 8px
      md: 'p-3',      // 12px (was p-4 = 16px)
      lg: 'p-4',      // 16px
    },
    
    /** Gap between items (flex/grid) */
    gap: {
      xs: 'gap-1',    // 4px
      sm: 'gap-2',    // 8px
      md: 'gap-3',    // 12px
      lg: 'gap-4',    // 16px
      xl: 'gap-6',    // 24px
    },
    
    /** Margin utilities */
    margin: {
      sm: 'mb-2',     // 8px
      md: 'mb-3',     // 12px
      lg: 'mb-4',     // 16px
      xl: 'mb-6',     // 24px
    },
  },

  /**
   * Typography System
   * 
   * Consistent font sizes, weights, and line heights.
   */
  typography: {
    /** Heading styles */
    heading: {
      h1: 'text-3xl font-bold',          // Main page titles
      h2: 'text-2xl font-semibold',      // Section headers
      h3: 'text-xl font-semibold',       // Subsection headers
      h4: 'text-lg font-semibold',       // Card titles
      h5: 'text-base font-semibold',     // Small headers
    },
    
    /** Body text styles */
    body: {
      primary: 'text-base',              // Standard body text (16px)
      secondary: 'text-sm',              // Secondary text (14px)
      small: 'text-xs',                  // Fine print (12px)
      large: 'text-lg',                  // Emphasized text (18px)
    },
    
    /** Font weights */
    weight: {
      light: 'font-light',               // 300
      normal: 'font-normal',             // 400
      medium: 'font-medium',             // 500
      semibold: 'font-semibold',         // 600
      bold: 'font-bold',                 // 700
    },
  },

  /**
   * Border Radius System
   */
  borders: {
    radius: {
      none: 'rounded-none',
      sm: 'rounded-sm',                  // 2px
      md: 'rounded-md',                  // 6px
      lg: 'rounded-lg',                  // 8px
      xl: 'rounded-xl',                  // 12px
      '2xl': 'rounded-2xl',              // 16px
      full: 'rounded-full',              // 9999px
    },
    width: {
      thin: 'border',                    // 1px
      medium: 'border-2',                // 2px
      thick: 'border-4',                 // 4px
    },
  },

  /**
   * Shadow System - Elevation Hierarchy
   * 
   * Apply shadows consistently based on component elevation level:
   * 
   * Level 0 (none) - Flat backgrounds, inline elements
   * Level 1 (sm) - Slightly elevated cards, calendar containers
   * Level 2 (md) - Floating elements (sidebar, dropdowns)
   * Level 3 (lg) - Primary actions (buttons), sticky headers
   * Level 4 (xl) - Overlays (tooltips, popovers)
   * Level 5 (2xl) - Highest priority (modals, toasts)
   * 
   * Usage:
   * - Calendar container: shadow-sm
   * - Sidebar: shadow-md
   * - Header (sticky): shadow-lg
   * - Modals/dialogs: shadow-2xl
   * - Toast notifications: shadow-2xl
   */
  shadows: {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    inner: 'shadow-inner',
  },

  /**
   * Transition System
   */
  transitions: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-300',
    slow: 'transition-all duration-500',
  },

  /**
   * Z-Index System
   */
  zIndex: {
    base: 'z-0',
    dropdown: 'z-10',
    sticky: 'z-20',
    modal: 'z-50',
    toast: 'z-60',
    tooltip: 'z-70',
  },

  /**
   * Layout Patterns
   */
  layout: {
    flex: {
      center: 'flex items-center justify-center',
      between: 'flex items-center justify-between',
      start: 'flex items-start',
      end: 'flex items-end',
      col: 'flex flex-col',
      colCenter: 'flex flex-col items-center justify-center',
    },
    grid: {
      cols2: 'grid grid-cols-2',
      cols3: 'grid grid-cols-3',
      cols4: 'grid grid-cols-4',
      cols7: 'grid grid-cols-7',        // For calendar weekdays
      autoFit: 'grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
    },
  },

  /**
   * Touch Targets (WCAG Accessibility)
   */
  touchTarget: {
    min: 'min-h-[44px]',                // WCAG 2.1 AA minimum
    comfortable: 'min-h-[48px]',
  },
} as const;

/**
 * Type-safe token accessor
 * 
 * Usage:
 * ```tsx
 * import { tokens } from '@/styles';
 * 
 * <div className={`${tokens.spacing.card.md} ${tokens.borders.radius.lg}`}>
 *   Content
 * </div>
 * ```
 */
export type Tokens = typeof tokens;

