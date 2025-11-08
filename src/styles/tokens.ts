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
      xxl: 'gap-8',   // 32px - for major section separation
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
   * Enhanced with 1.25x type scale and responsive variants for better visual hierarchy.
   */
  typography: {
    /** Heading styles with responsive scaling */
    heading: {
      h1: 'text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight',      // Main page titles (24px → 30px → 36px)
      h2: 'text-xl sm:text-2xl font-semibold leading-snug',                 // Section headers (20px → 24px)
      h3: 'text-xl font-semibold leading-snug',                             // Subsection headers (20px)
      h4: 'text-lg font-semibold leading-normal',                           // Card titles (18px)
      h5: 'text-base font-semibold leading-normal',                         // Small headers (16px)
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
   * 
   * Hierarchy for consistent visual language:
   * - md (6px): Small elements (badges, tags, pills)
   * - lg (8px): Interactive elements (buttons, inputs, dropdowns)
   * - xl (12px): Containers (cards, panels, sections)
   * - 2xl (16px): Overlays (modals, drawers, dialogs)
   * - full (9999px): Circular elements (avatars, indicators)
   * 
   * @see Issue #24 - Border Radius Hierarchy
   */
  borders: {
    radius: {
      none: 'rounded-none',
      sm: 'rounded-sm',                  // 2px - Reserved for special cases
      md: 'rounded-md',                  // 6px - Badges, tags, small elements
      lg: 'rounded-lg',                  // 8px - Buttons, inputs, interactive
      xl: 'rounded-xl',                  // 12px - Cards, panels, containers
      '2xl': 'rounded-2xl',              // 16px - Modals, dialogs, overlays
      full: 'rounded-full',              // 9999px - Circular elements
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
   * Animation System - Micro-interactions
   * 
   * Predefined animations for common UI interactions.
   * All animations respect `prefers-reduced-motion` media query.
   * 
   * Button Interactions:
   * - active:scale-95: Tactile feedback on press
   * - hover:shadow-md: Elevation feedback on hover
   * 
   * Loading States:
   * - animate-spin: Continuous rotation (spinners)
   * - animate-shimmer: Skeleton loader effect
   * 
   * Ripple Effect:
   * - Use 'btn-ripple' class for important actions
   * 
   * Usage:
   * ```tsx
   * <button className="active:scale-95 hover:shadow-md btn-ripple">
   *   Click me
   * </button>
   * ```
   * 
   * @see src/index.css for animation keyframes
   */
  animations: {
    /** Button micro-interactions */
    button: {
      scale: 'active:scale-95',
      hover: 'hover:shadow-md',
      ripple: 'btn-ripple',
    },
    /** Loading animations */
    loading: {
      spin: 'animate-spin',
      shimmer: 'animate-shimmer',
      pulse: 'animate-pulse',
    },
    /** Entrance animations */
    entrance: {
      fadeIn: 'animate-fade-in',
      scaleIn: 'animate-scale-in',
      slideUp: 'animate-slide-up',
      slideInRight: 'animate-slide-in-right',
    },
    /** Modal specific animations */
    modal: {
      slideUpMobile: 'animate-slide-up-mobile',
      fadeIn: 'animate-fade-in',
    },
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

  /**
   * Icon Sizing System
   * 
   * Standardized icon sizes to match text sizes for visual harmony.
   * Use these classes on icon components to ensure consistency.
   * 
   * Matching Guide:
   * - xs (12px): Inline with small/fine print text (text-xs)
   * - sm (16px): Inline with secondary text (text-sm) or small buttons
   * - md (20px): Inline with base text (text-base) or medium buttons
   * - lg (24px): Inline with large text (text-lg) or large buttons, standalone icons
   * - xl (32px): Feature icons, empty states, large touch targets
   * 
   * Usage:
   * ```tsx
   * import { tokens } from '@/styles';
   * import { Calendar } from 'lucide-react';
   * 
   * // Instead of: <Calendar size={20} />
   * <Calendar className={tokens.icons.md} />
   * ```
   */
  icons: {
    xs: 'w-3 h-3',      // 12px - Inline small text
    sm: 'w-4 h-4',      // 16px - Inline base text, small buttons
    md: 'w-5 h-5',      // 20px - Inline large text, medium buttons
    lg: 'w-6 h-6',      // 24px - Standalone icons, large buttons
    xl: 'w-8 h-8',      // 32px - Feature icons, empty states
  },

  /**
   * Focus Ring System (WCAG 2.1 AA Compliant)
   * 
   * Standardized focus indicators for keyboard navigation accessibility.
   * All focus rings use 2px width with 3:1 contrast ratio minimum (WCAG 2.1 AA).
   * 
   * Focus Ring Hierarchy:
   * - default: Blue-500 (primary interactive elements)
   * - primary: Blue-500 (buttons, links, primary actions)
   * - danger: Red-500 (destructive actions, delete buttons)
   * - success: Green-500 (positive actions, save/complete buttons)
   * - input: Blue-500 with ring offset (form inputs)
   * - inset: Blue-500 inset (compact elements like checkboxes)
   * 
   * Usage:
   * ```tsx
   * import { tokens } from '@/styles';
   * 
   * // Standard focus ring
   * <button className={tokens.focus.default}>Click me</button>
   * 
   * // Danger action focus ring
   * <button className={tokens.focus.danger}>Delete</button>
   * 
   * // Input focus ring
   * <input className={tokens.focus.input} />
   * ```
   * 
   * @see Issue #15 - Standardize Focus Ring Indicators
   */
  focus: {
    // Standard focus ring (most common use case)
    default: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
    
    // Semantic focus rings for different action types
    primary: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
    danger: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
    success: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
    warning: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
    
    // Specialized focus rings
    input: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    inset: 'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500',
    
    // Focus ring without offset (for elements with backgrounds)
    noOffset: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
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

