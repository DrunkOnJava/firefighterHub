/**
 * Spacing Tokens - Comprehensive Spacing System
 * 
 * This file defines all spacing values for consistent layout.
 * Use these instead of magic numbers or inconsistent Tailwind classes.
 * 
 * @see src/styles/README.md for usage guidelines
 */

export const spacingTokens = {
  /**
   * Component Internal Padding
   * 
   * Use these for consistent padding within components.
   */
  component: {
    card: {
      sm: 'p-3',           // 12px - Compact cards
      md: 'p-4',           // 16px - Standard cards (default)
      lg: 'p-5',           // 20px - Spacious cards
      xl: 'p-6',           // 24px - Large containers
    },
    
    modal: {
      sm: 'p-4',           // 16px - Compact modals
      md: 'p-5',           // 20px - Standard modals (default)
      lg: 'p-6',           // 24px - Spacious modals
      xl: 'p-8',           // 32px - Large dialogs
    },
    
    section: {
      sm: 'p-2',           // 8px - Tight sections
      md: 'p-3',           // 12px - Standard sections
      lg: 'p-4',           // 16px - Spacious sections
      xl: 'p-6',           // 24px - Large sections
    },
    
    button: {
      sm: 'px-3 py-1.5',   // Small button (28px height)
      md: 'px-4 py-2',     // Medium button (36px height)
      lg: 'px-6 py-3',     // Large button (48px height)
      xl: 'px-8 py-4',     // Extra large button (56px height)
    },
  },

  /**
   * Gap Spacing (Flex/Grid)
   * 
   * Use for consistent spacing between elements.
   */
  gap: {
    tight: 'gap-2',        // 8px - Very tight grouping
    default: 'gap-4',      // 16px - Default spacing
    relaxed: 'gap-6',      // 24px - Relaxed spacing
    section: 'gap-8',      // 32px - Section separation (NEW - fixes missing token)
    sectionLarge: 'gap-12', // 48px - Page-level separation (NEW)
  },

  /**
   * Margin Utilities
   * 
   * Bottom margins for vertical rhythm.
   */
  margin: {
    xs: 'mb-1',            // 4px
    sm: 'mb-2',            // 8px
    md: 'mb-3',            // 12px
    lg: 'mb-4',            // 16px
    xl: 'mb-6',            // 24px
    xxl: 'mb-8',           // 32px
  },

  /**
   * Stack Spacing (Vertical Rhythm)
   * 
   * Combines flex-col with gap for vertical stacking.
   */
  stack: {
    tight: 'flex flex-col gap-2',       // 8px
    default: 'flex flex-col gap-4',     // 16px
    relaxed: 'flex flex-col gap-6',     // 24px
    loose: 'flex flex-col gap-8',       // 32px
  },

  /**
   * Inline Spacing (Horizontal Rhythm)
   * 
   * Combines flex-row with gap for horizontal grouping.
   */
  inline: {
    tight: 'flex flex-row gap-2',       // 8px
    default: 'flex flex-row gap-4',     // 16px
    relaxed: 'flex flex-row gap-6',     // 24px
  },

  /**
   * Touch Target Enforcement (WCAG 2.5.5)
   * 
   * Ensures minimum 44×44px touch targets for accessibility.
   */
  touchTarget: {
    min: 'min-w-[44px] min-h-[44px]',
    button: 'min-h-[44px] px-4',
    iconButton: 'min-w-[44px] min-h-[44px] p-2.5',
    comfortable: 'min-w-[48px] min-h-[48px]',
    fab: 'min-w-[56px] min-h-[56px]',   // Floating Action Button
  },

  /**
   * Container Max Widths
   */
  container: {
    xs: 'max-w-xs',        // 320px
    sm: 'max-w-sm',        // 384px
    md: 'max-w-md',        // 448px
    lg: 'max-w-lg',        // 512px
    xl: 'max-w-xl',        // 576px
    '2xl': 'max-w-2xl',    // 672px
    '4xl': 'max-w-4xl',    // 896px
    '6xl': 'max-w-6xl',    // 1152px
  },

  /**
   * Grid Gaps (Calendar-specific)
   */
  grid: {
    calendar: 'gap-1',     // 4px - Tight calendar grid
    roster: 'gap-3',       // 12px - Roster list spacing
    card: 'gap-4',         // 16px - Card grid spacing
  },
} as const;

/**
 * Type-safe spacing token accessor
 */
export type SpacingTokens = typeof spacingTokens;
