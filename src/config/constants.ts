/**
 * Application-wide constants and configuration
 * Following best practices: centralized configuration, no magic numbers/strings
 */

// Layout Constants
export const LAYOUT = {
  MAX_WIDTH: "1920px",
  PADDING: {
    MOBILE: "px-3 py-4",
    DESKTOP: "sm:px-6 sm:py-8",
  },
  GRID_GAP: {
    MOBILE: "gap-4",
    DESKTOP: "sm:gap-8",
  },
  SPACING: {
    SECTION: "mb-8",
  },
} as const;

// Grid Layout
export const GRID_COLS = {
  CALENDAR: "xl:col-span-9",
  SIDEBAR: "xl:col-span-3",
} as const;

// Animation/Loading
export const SPINNER = {
  SIZE: "w-16 h-16",
  BORDER: "border-4",
  COLOR: "border-orange-500",
  TRANSPARENT_SIDE: "border-t-transparent",
  ANIMATION: "animate-spin",
} as const;

// Accessibility
export const A11Y = {
  SKIP_LINK_ID: "main-content",
  ARIA_LIVE: {
    POLITE: "polite" as const,
    ASSERTIVE: "assertive" as const,
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  DARK_MODE: "isDarkMode",
  CURRENT_SHIFT: "currentShift",
} as const;

// Default Values
export const DEFAULTS = {
  DARK_MODE: true,
  SHIFT: "A" as const,
} as const;

// Z-Index Layers (prevent conflicts)
export const Z_INDEX = {
  SKIP_LINK: 60,
  MODAL_OVERLAY: 50,
  MODAL: 51,
  TOAST: 100,
  DROPDOWN: 40,
} as const;

// Scroll Behavior
export const SCROLL_BEHAVIOR = {
  SMOOTH: "smooth" as const,
  CENTER: "center" as const,
} as const;

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  SEARCH: { key: "k", ctrl: true, meta: true },
  QUICK_ADD: { key: "n", ctrl: true, meta: true },
  EXPORT: { key: "e", ctrl: true, meta: true },
  HELP: { key: "h", ctrl: true, meta: true },
  SHORTCUTS_MODAL: { key: "?" },
  ESCAPE: { key: "Escape" },
} as const;
/**
 * Responsive Breakpoints for FirefighterHub Mobile Optimization
 *
 * Based on common device widths and mobile-first design principles.
 * Aligned with Tailwind CSS breakpoints for consistency.
 */

export const BREAKPOINTS = {
  /** Small mobile devices (320px - 639px) */
  mobile: {
    min: 320,
    max: 639,
    query: '(max-width: 639px)',
  },

  /** Tablets and large phones in portrait (640px - 767px) */
  tablet: {
    min: 640,
    max: 767,
    query: '(min-width: 640px) and (max-width: 767px)',
  },

  /** Tablets in landscape and small laptops (768px - 1023px) */
  desktop: {
    min: 768,
    max: 1023,
    query: '(min-width: 768px) and (max-width: 1023px)',
  },

  /** Laptops and larger screens (1024px+) */
  large: {
    min: 1024,
    max: Infinity,
    query: '(min-width: 1024px)',
  },
} as const;

/**
 * Common device-specific breakpoints for testing
 */
export const DEVICE_BREAKPOINTS = {
  // Mobile devices (portrait)
  'iPhone SE': 320,
  'iPhone 12/13': 390,
  'iPhone 14 Pro': 393,
  'Samsung Galaxy S23': 360,
  'Google Pixel 5': 393,

  // Tablets
  'iPad Mini': 768,
  'iPad Air': 820,
  'iPad Pro 11"': 834,
  'iPad Pro 12.9"': 1024,

  // Responsive design thresholds
  'Mobile Max': 639,
  'Tablet Max': 767,
  'Desktop Min': 768,
} as const;

/**
 * Touch target minimum sizes (WCAG AA compliance)
 */
export const TOUCH_TARGETS = {
  /** Minimum size for all touch targets (WCAG 2.5.5) */
  minimum: 44, // pixels

  /** Recommended comfortable size for primary actions */
  comfortable: 48, // pixels

  /** Large touch targets for critical actions */
  large: 56, // pixels

  /** Minimum spacing between touch targets */
  spacing: 8, // pixels
} as const;

/**
 * Font size ranges for mobile readability
 */
export const MOBILE_TYPOGRAPHY = {
  /** Minimum font size to prevent iOS zoom on input focus */
  minimumInput: 16, // pixels

  /** Minimum for body text readability */
  minimumBody: 14, // pixels

  /** Optimal line height for mobile reading */
  lineHeight: 1.5,

  /** Maximum line length for readability (characters) */
  maxLineLength: 66,
} as const;

/**
 * Safe area insets for notched devices (iPhone X+, etc.)
 */
export const SAFE_AREA_INSETS = {
  top: 'env(safe-area-inset-top, 0px)',
  right: 'env(safe-area-inset-right, 0px)',
  bottom: 'env(safe-area-inset-bottom, 0px)',
  left: 'env(safe-area-inset-left, 0px)',
} as const;

/**
 * Helper to check if current viewport matches a breakpoint
 */
export function matchesBreakpoint(breakpointName: keyof typeof BREAKPOINTS): boolean {
  if (typeof window === 'undefined') return false;
  const breakpoint = BREAKPOINTS[breakpointName];
  return window.matchMedia(breakpoint.query).matches;
}

/**
 * Get current device category based on viewport width
 */
export function getDeviceCategory(): keyof typeof BREAKPOINTS {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;

  if (width < BREAKPOINTS.tablet.min) return 'mobile';
  if (width < BREAKPOINTS.desktop.min) return 'tablet';
  if (width < BREAKPOINTS.large.min) return 'desktop';
  return 'large';
}

/**
 * Check if device is in portrait or landscape orientation
 */
export function getOrientation(): 'portrait' | 'landscape' {
  if (typeof window === 'undefined') return 'portrait';
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}
