/**
 * Grid System - Comprehensive Layout and Alignment
 * 
 * Establishes a flexible, responsive grid system that creates visual order
 * and rhythm across all interface elements. Provides both mathematical
 * precision and content-appropriate flexibility.
 * 
 * Key Features:
 * - Baseline grid for vertical rhythm (8px base unit)
 * - Column grid with named lines and template areas
 * - Responsive behavior across all viewports
 * - Modular scale for proportional relationships
 * - Subgrid support for nested alignment
 * 
 * @see docs/GRID_SYSTEM.md for usage guidelines and patterns
 */

/**
 * Base Grid Configuration
 * 
 * 8px base unit provides:
 * - Clean multiples (16px, 24px, 32px, 40px, 48px)
 * - Alignment with most design systems
 * - Easy mental math for developers
 */
export const BASE_UNIT = 8; // 8px

/**
 * Baseline Grid System
 * 
 * All vertical spacing should align to this rhythm for visual harmony.
 * Based on line-height multiples (1.5 = 24px for 16px base font).
 */
export const baseline = {
  unit: BASE_UNIT,
  lineHeight: 1.5, // 24px for 16px font
  
  // Vertical rhythm scale (multiples of baseline)
  scale: {
    xs: BASE_UNIT * 0.5,      // 4px
    sm: BASE_UNIT,             // 8px
    md: BASE_UNIT * 2,         // 16px
    lg: BASE_UNIT * 3,         // 24px
    xl: BASE_UNIT * 4,         // 32px
    '2xl': BASE_UNIT * 5,      // 40px
    '3xl': BASE_UNIT * 6,      // 48px
    '4xl': BASE_UNIT * 8,      // 64px
  },
} as const;

/**
 * Column Grid System
 * 
 * Flexible grid that adapts to content needs while maintaining structure.
 * Uses CSS Grid with named lines for explicit, maintainable layouts.
 */
export const columnGrid = {
  // Desktop: Sidebar layout (Calendar + Roster)
  desktop: {
    columns: '1fr 480px',          // Calendar fills, Roster fixed
    gap: 16,                        // 16px between columns
    areas: '"calendar sidebar"',    // Named grid areas
    lines: {
      start: 1,
      calendarEnd: 2,
      sidebarEnd: 3,
    },
  },
  
  // Tablet: Single column or stacked
  tablet: {
    columns: '1fr',
    gap: 16,
    areas: '"calendar" "sidebar"',
    lines: {
      start: 1,
      end: 2,
    },
  },
  
  // Mobile: Single column, full width
  mobile: {
    columns: '1fr',
    gap: 12,
    areas: '"content"',
    lines: {
      start: 1,
      end: 2,
    },
  },
} as const;

/**
 * Calendar Grid System
 * 
 * Specialized grid for calendar layout with 7 columns (weekdays).
 * Ensures proper aspect ratios and responsive behavior.
 */
export const calendarGrid = {
  // Desktop: Full month view (7x6 grid)
  desktop: {
    columns: 'repeat(7, 1fr)',
    rows: '24px repeat(6, 1fr)',  // Header row + 6 weeks
    gap: 8,
    cellMinHeight: 80,             // Minimum height for day cells
    cellAspectRatio: '1 / 1.2',    // Slightly taller than square
  },
  
  // Tablet: Compact month view
  tablet: {
    columns: 'repeat(7, 1fr)',
    rows: '20px repeat(6, 1fr)',
    gap: 6,
    cellMinHeight: 60,
    cellAspectRatio: '1 / 1.1',
  },
  
  // Mobile: Week view (horizontal scroll)
  mobile: {
    columns: 'repeat(7, minmax(48px, 1fr))',
    rows: 'auto',
    gap: 4,
    cellMinHeight: 48,
    cellAspectRatio: '1 / 1',
  },
} as const;

/**
 * Roster Grid System
 * 
 * Grid for firefighter list with aligned columns.
 * Uses fractional units for proportional sizing.
 */
export const rosterGrid = {
  // Column proportions (name : station : certs)
  columns: '1.2fr 0.5fr 0.8fr',
  gap: 8,
  rowHeight: 'minmax(32px, auto)', // Minimum 32px, grows with content
  
  // 20 visible rows on desktop (all firefighters visible)
  desktopRows: 'repeat(20, 1fr)',
  
  // Mobile: Full width single column
  mobileColumns: '1fr',
  mobileGap: 12,
} as const;

/**
 * Modular Scale
 * 
 * Mathematical relationships for sizing that create visual harmony.
 * Based on 1.25 ratio (Major Third in music theory).
 * 
 * Usage: Component sizes should follow this scale rather than arbitrary values.
 */
export const modularScale = {
  ratio: 1.25, // Major Third
  base: 16,    // Base size (px)
  
  // Scale values (exponential growth)
  scale: {
    '-2': 10,   // 16 / 1.25^2 ≈ 10px
    '-1': 13,   // 16 / 1.25 ≈ 13px
    0: 16,      // Base
    1: 20,      // 16 * 1.25 = 20px
    2: 25,      // 16 * 1.25^2 ≈ 25px
    3: 31,      // 16 * 1.25^3 ≈ 31px
    4: 39,      // 16 * 1.25^4 ≈ 39px
    5: 49,      // 16 * 1.25^5 ≈ 49px
    6: 61,      // 16 * 1.25^6 ≈ 61px
    7: 76,      // 16 * 1.25^7 ≈ 76px
    8: 95,      // 16 * 1.25^8 ≈ 95px
  },
  
  // Semantic aliases
  aliases: {
    tiny: 10,
    small: 13,
    base: 16,
    medium: 20,
    large: 25,
    xlarge: 31,
    xxlarge: 39,
    huge: 49,
  },
} as const;

/**
 * Responsive Breakpoints
 * 
 * Aligned with Tailwind's default breakpoints for consistency.
 */
export const breakpoints = {
  mobile: 640,       // 0-640px
  tablet: 768,       // 641-768px
  desktop: 1024,     // 769-1024px
  wide: 1280,        // 1025-1280px
  ultrawide: 1536,   // 1281px+
} as const;

/**
 * Grid Utilities - Helper Functions
 */

/**
 * Calculate grid column span
 */
export function gridSpan(columns: number): string {
  return `span ${columns} / span ${columns}`;
}

/**
 * Convert pixel value to baseline units
 */
export function toBaselineUnits(px: number): number {
  return Math.round(px / BASE_UNIT);
}

/**
 * Get nearest modular scale value
 */
export function nearestScaleValue(target: number): number {
  const values = Object.values(modularScale.scale);
  return values.reduce((prev, curr) => 
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
  );
}

/**
 * Generate CSS Grid template areas from layout
 */
export function generateGridAreas(layout: string[][]): string {
  return layout.map(row => `"${row.join(' ')}"`).join('\n');
}

/**
 * Grid Configuration Presets
 * 
 * Common layout patterns ready to use.
 */
export const gridPresets = {
  // Main application layout
  appLayout: {
    desktop: {
      display: 'grid',
      gridTemplateColumns: columnGrid.desktop.columns,
      gridTemplateAreas: columnGrid.desktop.areas,
      gap: `${columnGrid.desktop.gap}px`,
    },
    tablet: {
      display: 'grid',
      gridTemplateColumns: columnGrid.tablet.columns,
      gridTemplateAreas: columnGrid.tablet.areas,
      gap: `${columnGrid.tablet.gap}px`,
    },
    mobile: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: `${columnGrid.mobile.gap}px`,
    },
  },
  
  // Calendar grid
  calendar: {
    desktop: {
      display: 'grid',
      gridTemplateColumns: calendarGrid.desktop.columns,
      gridTemplateRows: calendarGrid.desktop.rows,
      gap: `${calendarGrid.desktop.gap}px`,
    },
    tablet: {
      display: 'grid',
      gridTemplateColumns: calendarGrid.tablet.columns,
      gridTemplateRows: calendarGrid.tablet.rows,
      gap: `${calendarGrid.tablet.gap}px`,
    },
    mobile: {
      display: 'grid',
      gridTemplateColumns: calendarGrid.mobile.columns,
      gap: `${calendarGrid.mobile.gap}px`,
    },
  },
  
  // Roster grid
  roster: {
    desktop: {
      display: 'grid',
      gridTemplateColumns: rosterGrid.columns,
      gap: `${rosterGrid.gap}px`,
    },
    mobile: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: `${rosterGrid.mobileGap}px`,
    },
  },
} as const;

/**
 * CSS Custom Properties
 * 
 * Export grid values as CSS variables for use in stylesheets.
 */
export const cssVariables = {
  '--grid-base-unit': `${BASE_UNIT}px`,
  '--grid-desktop-gap': `${columnGrid.desktop.gap}px`,
  '--grid-tablet-gap': `${columnGrid.tablet.gap}px`,
  '--grid-mobile-gap': `${columnGrid.mobile.gap}px`,
  '--calendar-gap-desktop': `${calendarGrid.desktop.gap}px`,
  '--calendar-gap-tablet': `${calendarGrid.tablet.gap}px`,
  '--calendar-gap-mobile': `${calendarGrid.mobile.gap}px`,
  '--roster-gap': `${rosterGrid.gap}px`,
  '--baseline-unit': `${baseline.unit}px`,
} as const;

/**
 * Alignment Rules
 * 
 * Guidelines for when to use grid alignment vs custom positioning.
 */
export const alignmentRules = {
  // Form elements: Left-align labels with inputs
  forms: {
    labelAlign: 'left' as const,
    inputAlign: 'left' as const,
    spacing: baseline.scale.md,
  },
  
  // Page headings: Center-aligned
  headings: {
    pageTitle: 'center' as const,
    sectionTitle: 'left' as const,
  },
  
  // Lists: Left-aligned with consistent spacing
  lists: {
    align: 'left' as const,
    spacing: baseline.scale.sm,
  },
  
  // Cards: Follow grid columns
  cards: {
    align: 'grid' as const,
    padding: baseline.scale.lg,
  },
} as const;

/**
 * Subgrid Support
 * 
 * Configuration for nested grids that align to parent grid lines.
 */
export const subgrid = {
  supported: typeof CSS !== 'undefined' && CSS.supports?.('grid-template-columns', 'subgrid'),
  
  // Fallback for browsers without subgrid support
  fallback: {
    display: 'grid',
    gridTemplateColumns: 'inherit',
  },
  
  // Subgrid declaration
  columns: 'subgrid',
  rows: 'subgrid',
} as const;

export type GridSystem = typeof baseline & typeof columnGrid & typeof calendarGrid & typeof rosterGrid;
