/**
 * Material Design 3 Color System
 *
 * Parallel color system based on MaterialM.fig design file.
 * Uses Material Design 3 principles: dynamic color, tonal palettes, and semantic roles.
 *
 * Source: MaterialM.fig (#2a303d base surface)
 * Reference: https://m3.material.io/styles/color/system/overview
 *
 * @see docs/MATERIAL_DESIGN_3_MIGRATION.md for migration guide
 */

/**
 * Surface Colors - Material Design 3 Hierarchy
 *
 * Derived from Figma background color #2a303d (RGB: 42, 48, 61)
 * Follows M3 surface elevation system with proper tonal variations.
 */
export const m3Surface = {
  /** Dimmest surface (modals, overlays) */
  dim: "#252b36",

  /** Default surface (main background) - from Figma */
  base: "#2a303d",

  /** Brightest surface (emphasized elements) */
  bright: "#303746",

  /** Lowest elevation container */
  containerLowest: "#1e2329",

  /** Low elevation container */
  containerLow: "#242a35",

  /** Standard container (cards, panels) */
  container: "#2a303d",

  /** High elevation container (elevated cards) */
  containerHigh: "#2e3443",

  /** Highest elevation container (floating elements) */
  containerHighest: "#323949",
};

/**
 * Primary Color Roles
 *
 * Material Design 3 purple-blue primary (typical M3 default)
 * Can be customized to match firefighter theme if needed.
 */
export const m3Primary = {
  /** Primary brand color */
  primary: "#6750a4",

  /** Color for content on primary */
  onPrimary: "#ffffff",

  /** Container for primary accent */
  primaryContainer: "#eaddff",

  /** Color for content on primary container */
  onPrimaryContainer: "#21005e",
};

/**
 * Secondary Color Roles
 *
 * Supporting accent colors for hierarchy and variety.
 */
export const m3Secondary = {
  /** Secondary accent color */
  secondary: "#625b71",

  /** Color for content on secondary */
  onSecondary: "#ffffff",

  /** Container for secondary accent */
  secondaryContainer: "#e8def8",

  /** Color for content on secondary container */
  onSecondaryContainer: "#1e192b",
};

/**
 * Tertiary Color Roles
 *
 * Additional accent for contrast and interest.
 */
export const m3Tertiary = {
  /** Tertiary accent color */
  tertiary: "#7d5260",

  /** Color for content on tertiary */
  onTertiary: "#ffffff",

  /** Container for tertiary accent */
  tertiaryContainer: "#ffd8e4",

  /** Color for content on tertiary container */
  onTertiaryContainer: "#31111d",
};

/**
 * Error Color Roles
 *
 * Aligned with current red-500 for consistency.
 */
export const m3Error = {
  /** Error state color */
  error: "#ef4444",

  /** Color for content on error */
  onError: "#ffffff",

  /** Container for error state */
  errorContainer: "#fee2e2",

  /** Color for content on error container */
  onErrorContainer: "#7f1d1d",
};

/**
 * Success Color Roles (Extension)
 *
 * Not standard M3 but needed for FirefighterHub semantics.
 * Aligned with current emerald-500.
 */
export const m3Success = {
  /** Success state color */
  success: "#10b981",

  /** Color for content on success */
  onSuccess: "#ffffff",

  /** Container for success state */
  successContainer: "#d1fae5",

  /** Color for content on success container */
  onSuccessContainer: "#064e3b",
};

/**
 * Warning Color Roles (Extension)
 *
 * For non-critical alerts and warnings.
 */
export const m3Warning = {
  /** Warning state color */
  warning: "#f59e0b",

  /** Color for content on warning */
  onWarning: "#ffffff",

  /** Container for warning state */
  warningContainer: "#fef3c7",

  /** Color for content on warning container */
  onWarningContainer: "#78350f",
};

/**
 * Neutral Colors
 *
 * For text, icons, and dividers. Material Design 3 neutral tonal palette.
 */
export const m3Neutral = {
  /** Highest emphasis text (87% opacity equivalent) */
  onSurface: "#e5e7eb",

  /** Medium emphasis text (60% opacity equivalent) */
  onSurfaceVariant: "#9ca3af",

  /** Outline color (borders, dividers) */
  outline: "#4b5563",

  /** Subtle outline variant */
  outlineVariant: "#374151",
};

/**
 * State Layer Opacities
 *
 * Material Design 3 interaction state system.
 * Applied as overlays on base colors for hover, pressed, etc.
 */
export const m3StateLayer = {
  /** Hover state overlay */
  hover: 0.08,

  /** Focus state overlay */
  focus: 0.12,

  /** Pressed/active state overlay */
  pressed: 0.12,

  /** Dragged state overlay */
  dragged: 0.16,
};

/**
 * Elevation & Shadow System
 *
 * Material Design 3 elevation shadows.
 * Replaced hard-coded shadows with M3 system.
 */
export const m3Elevation = {
  level0: "none",
  level1: "0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)",
  level2: "0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15)",
  level3: "0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.3)",
  level4: "0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px 0 rgba(0, 0, 0, 0.3)",
  level5: "0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px 0 rgba(0, 0, 0, 0.3)",
};

/**
 * Motion Tokens
 *
 * Material Design 3 motion system with emphasized easing.
 */
export const m3Motion = {
  /** Emphasized easing (enter/exit animations) */
  emphasized: "cubic-bezier(0.2, 0, 0, 1)",

  /** Standard easing (simple transitions) */
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",

  /** Decelerated easing (enter animations) */
  decelerated: "cubic-bezier(0, 0, 0, 1)",

  /** Accelerated easing (exit animations) */
  accelerated: "cubic-bezier(0.3, 0, 1, 1)",

  /** Duration tokens */
  duration: {
    short1: "50ms",
    short2: "100ms",
    short3: "150ms",
    short4: "200ms",
    medium1: "250ms",
    medium2: "300ms",
    medium3: "350ms",
    medium4: "400ms",
    long1: "450ms",
    long2: "500ms",
    long3: "550ms",
    long4: "600ms",
  },
};

/**
 * Complete M3 Color System Export
 *
 * Organized by Material Design 3 color roles.
 */
export const colorsM3 = {
  surface: m3Surface,
  primary: m3Primary,
  secondary: m3Secondary,
  tertiary: m3Tertiary,
  error: m3Error,
  success: m3Success,
  warning: m3Warning,
  neutral: m3Neutral,
  stateLayer: m3StateLayer,
  elevation: m3Elevation,
  motion: m3Motion,
};

/**
 * Tailwind Class Utilities
 *
 * Pre-built Tailwind class strings for common M3 patterns.
 */
export const m3Classes = {
  /** Surface backgrounds */
  surface: {
    dim: "bg-[#252b36]",
    base: "bg-[#2a303d]",
    bright: "bg-[#303746]",
    containerLowest: "bg-[#1e2329]",
    containerLow: "bg-[#242a35]",
    container: "bg-[#2a303d]",
    containerHigh: "bg-[#2e3443]",
    containerHighest: "bg-[#323949]",
  },

  /** Text colors on surfaces */
  onSurface: {
    high: "text-[#e5e7eb]",      // 87% emphasis
    medium: "text-[#9ca3af]",    // 60% emphasis
    disabled: "text-[#6b7280]",  // 38% emphasis
  },

  /** Primary accent */
  primary: {
    bg: "bg-[#6750a4]",
    text: "text-[#6750a4]",
    onPrimary: "text-white",
    container: "bg-[#eaddff]",
    onContainer: "text-[#21005e]",
  },

  /** State layers (hover, pressed) */
  stateLayer: {
    hover: "hover:bg-white/[0.08]",
    pressed: "active:bg-white/[0.12]",
    focus: "focus:bg-white/[0.12]",
  },
};

/**
 * Helper: Apply State Layer
 *
 * Utility to add M3 state layer to any element.
 */
export function withStateLayer(baseClasses: string): string {
  return `${baseClasses} ${m3Classes.stateLayer.hover} ${m3Classes.stateLayer.pressed} transition-colors duration-200`;
}
