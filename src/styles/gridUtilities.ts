/**
 * Grid Utilities - Tailwind Class Generators
 * 
 * Provides utility classes for common grid patterns and alignment.
 * These map to Tailwind classes but maintain systematic consistency.
 */

/**
 * Grid Layout Utilities
 * 
 * Pre-defined class strings for common grid layouts.
 * Use these instead of writing grid classes inline.
 */
export const gridUtilities = {
  /**
   * Application Layout Grid
   * Responsive: Desktop (2-col) → Tablet (1-col stacked) → Mobile (flex)
   */
  appLayout: {
    container: [
      'grid',
      'lg:grid-cols-[1fr_480px]',    // Desktop: calendar + sidebar
      'grid-cols-1',                  // Tablet/Mobile: single column
      'gap-4 lg:gap-4',               // Consistent 16px gap
      'min-h-0',                      // Prevent grid blowout
    ].join(' '),
    
    calendar: 'grid-area-[calendar] min-h-0 flex flex-col',
    sidebar: 'grid-area-[sidebar] min-h-0 flex flex-col',
  },
  
  /**
   * Calendar Grid
   * 7-column grid for weekday layout with responsive sizing
   */
  calendar: {
    container: [
      'grid',
      'grid-cols-7',                  // Always 7 columns (weekdays)
      'gap-2 md:gap-2 lg:gap-2',      // 8px gap (consistent)
      'w-full',
    ].join(' '),
    
    weekdayHeader: [
      'grid',
      'grid-cols-7',
      'gap-2 md:gap-2 lg:gap-2',
      'mb-2',
      'w-full',
    ].join(' '),
    
    dayGrid: [
      'grid',
      'grid-cols-7',
      'auto-rows-fr',                 // Equal height rows
      'gap-2 md:gap-2 lg:gap-2',
      'min-h-0',
      'flex-1',                       // Fill available space
    ].join(' '),
    
    dayCell: [
      'aspect-square',                // Square cells on mobile
      'md:aspect-[1/1.2]',           // Slightly taller on desktop
      'min-h-[48px]',                // Mobile minimum
      'md:min-h-[60px]',             // Tablet minimum
      'lg:min-h-[80px]',             // Desktop minimum
      'flex flex-col',
      'p-2',
      'rounded-lg',
      'border',
      'cursor-pointer',
      'transition-all duration-150',
    ].join(' '),
  },
  
  /**
   * Roster Grid
   * 3-column grid for firefighter list
   */
  roster: {
    header: [
      'grid',
      'grid-cols-[1.2fr_0.5fr_0.8fr]', // Name : Station : Certs
      'gap-2',
      'px-2 py-1',
      'border-b',
    ].join(' '),
    
    row: [
      'grid',
      'grid-cols-[1.2fr_0.5fr_0.8fr]',
      'gap-2',
      'px-2 py-1',
      'items-center',
      'rounded-lg',
      'border',
      'transition-all duration-150',
    ].join(' '),
    
    rows: [
      'grid',
      'grid-rows-[repeat(20,1fr)]',   // 20 visible rows
      'gap-1',
      'min-h-0',
      'flex-1',
    ].join(' '),
  },
  
  /**
   * Form Grid
   * 2-column form layout with labels and inputs
   */
  form: {
    container: [
      'grid',
      'grid-cols-1',
      'md:grid-cols-[auto_1fr]',      // Label : Input
      'gap-4',
      'items-start',
    ].join(' '),
    
    labelColumn: 'md:text-right md:pt-2',
    inputColumn: 'w-full',
    
    // Common filter/checkbox grids
    grid1Col: 'grid grid-cols-1 gap-2',
    grid2Col: 'grid grid-cols-2 gap-2',
    grid3Col: 'grid grid-cols-3 gap-2',
    grid4Col: 'grid grid-cols-4 gap-2',
    
    // Responsive grids
    responsiveGrid2: 'grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4',
    responsiveGrid3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4',
    responsiveGrid4: 'grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4',
  },
  
  /**
   * Next Up Bar Grid
   * 3-column grid for shift indicators
   */
  nextUpBar: {
    container: [
      'grid',
      'grid-cols-1 md:grid-cols-3',
      'gap-3',
      'relative',
    ].join(' '),
    
    chip: [
      'flex items-center gap-2',
      'px-3 py-2',
      'rounded-lg',
      'border',
      'min-h-[34px]',
    ].join(' '),
  },
} as const;

/**
 * Alignment Utilities
 * 
 * Helper classes for common alignment patterns.
 */
export const alignmentUtilities = {
  /**
   * Flex alignment patterns
   */
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-start justify-start',
    end: 'flex items-end justify-end',
    colCenter: 'flex flex-col items-center justify-center',
    colStart: 'flex flex-col items-start',
    colBetween: 'flex flex-col justify-between',
  },
  
  /**
   * Grid alignment patterns
   */
  grid: {
    center: 'place-items-center',
    start: 'place-items-start',
    end: 'place-items-end',
    stretch: 'place-items-stretch',
  },
  
  /**
   * Text alignment
   */
  text: {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  },
  
  /**
   * Self alignment (for grid/flex children)
   */
  self: {
    center: 'self-center',
    start: 'self-start',
    end: 'self-end',
    stretch: 'self-stretch',
  },
} as const;

/**
 * Spacing Utilities
 * 
 * Baseline-aligned spacing utilities.
 * All values are multiples of 8px (BASE_UNIT).
 */
export const spacingUtilities = {
  /**
   * Padding (based on baseline grid)
   */
  padding: {
    xs: 'p-1',      // 4px
    sm: 'p-2',      // 8px
    md: 'p-4',      // 16px
    lg: 'p-6',      // 24px
    xl: 'p-8',      // 32px
    '2xl': 'p-10',  // 40px
    '3xl': 'p-12',  // 48px
  },
  
  /**
   * Margin (based on baseline grid)
   */
  margin: {
    xs: 'm-1',      // 4px
    sm: 'm-2',      // 8px
    md: 'm-4',      // 16px
    lg: 'm-6',      // 24px
    xl: 'm-8',      // 32px
    '2xl': 'm-10',  // 40px
    '3xl': 'm-12',  // 48px
  },
  
  /**
   * Gap (for flex/grid)
   */
  gap: {
    xs: 'gap-1',    // 4px
    sm: 'gap-2',    // 8px
    md: 'gap-4',    // 16px
    lg: 'gap-6',    // 24px
    xl: 'gap-8',    // 32px
    '2xl': 'gap-10', // 40px
    '3xl': 'gap-12', // 48px
  },
} as const;

/**
 * Responsive Grid Utilities
 * 
 * Helpers for responsive grid behavior.
 */
export const responsiveUtilities = {
  /**
   * Container queries (when supported)
   */
  container: {
    sm: '@container/sm',
    md: '@container/md',
    lg: '@container/lg',
  },
  
  /**
   * Responsive visibility
   */
  visibility: {
    mobileOnly: 'block md:hidden',
    tabletUp: 'hidden md:block',
    desktopOnly: 'hidden lg:block',
    hideMobile: 'hidden md:block',
    hideDesktop: 'block lg:hidden',
  },
  
  /**
   * Responsive grid columns
   */
  columns: {
    responsive1to2: 'grid-cols-1 md:grid-cols-2',
    responsive1to3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    responsive2to4: 'grid-cols-2 md:grid-cols-4',
    responsive1to2to3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  },
} as const;

/**
 * Subgrid Utilities
 * 
 * Utilities for nested grids that align to parent.
 */
export const subgridUtilities = {
  /**
   * Subgrid columns (inherit parent columns)
   */
  columns: 'grid-cols-subgrid',
  
  /**
   * Subgrid rows (inherit parent rows)
   */
  rows: 'grid-rows-subgrid',
  
  /**
   * Full subgrid (both columns and rows)
   */
  full: 'grid-cols-subgrid grid-rows-subgrid',
  
  /**
   * Fallback for non-supporting browsers
   */
  fallback: 'grid grid-cols-[inherit] grid-rows-[inherit]',
} as const;

/**
 * Grid Area Utilities
 * 
 * Named grid areas for semantic layouts.
 */
export const gridAreaUtilities = {
  /**
   * Main app layout areas
   */
  app: {
    calendar: 'grid-area-[calendar]',
    sidebar: 'grid-area-[sidebar]',
  },
  
  /**
   * Header areas
   */
  header: {
    brand: 'grid-area-[brand]',
    nav: 'grid-area-[nav]',
    actions: 'grid-area-[actions]',
  },
} as const;

/**
 * Helper: Combine utility classes
 * 
 * Merges multiple utility class strings.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Helper: Responsive class builder
 * 
 * Builds responsive classes with breakpoint prefixes.
 */
export function responsive(
  base: string,
  variants?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  }
): string {
  const classes = [base];
  
  if (variants?.sm) classes.push(`sm:${variants.sm}`);
  if (variants?.md) classes.push(`md:${variants.md}`);
  if (variants?.lg) classes.push(`lg:${variants.lg}`);
  if (variants?.xl) classes.push(`xl:${variants.xl}`);
  
  return classes.join(' ');
}

/**
 * Export all utilities
 */
export const grid = {
  layout: gridUtilities.appLayout,
  calendar: gridUtilities.calendar,
  roster: gridUtilities.roster,
  form: gridUtilities.form,
  nextUpBar: gridUtilities.nextUpBar,
  alignment: alignmentUtilities,
  spacing: spacingUtilities,
  responsive: responsiveUtilities,
  subgrid: subgridUtilities,
  areas: gridAreaUtilities,
  cn,
  makeResponsive: responsive,
} as const;
