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
