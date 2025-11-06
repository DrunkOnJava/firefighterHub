/**
 * Color System - NOW USES MaterialM OKLCH PALETTE
 *
 * This maintains the legacy structure (colors.structural, colors.semantic, etc.)
 * but outputs MaterialM OKLCH colors from Tailwind config.
 *
 * All existing imports of { colors } now get MaterialM palette!
 */

/**
 * Structural Colors - MaterialM Dark Theme
 */
export const colors = {
  structural: {
    /** Background colors - MaterialM OKLCH */
    bg: {
      app: "bg-materialm-darkgray",
      card: "bg-materialm-dark",
      cardHover: "hover:bg-materialm-dark",
      overlay: "bg-black/75",
      surface: "bg-materialm-dark",
    },

    /** Border colors - MaterialM */
    border: {
      default: "border-materialm-border-dark",
      emphasis: "border-materialm-border-dark",
      subtle: "border-materialm-border-dark",
      hover: "hover:border-materialm-primary",
      strong: "border-materialm-primary",
    },

    /** Text colors */
    text: {
      primary: "text-gray-100",
      secondary: "text-gray-400",
      tertiary: "text-gray-500",
      muted: "text-gray-600",
      surface: "text-materialm-text",
    },
  },

  /** Interactive element colors */
  interactive: {
    hover: {
      bg: "hover:bg-gray-800",
      text: "hover:text-gray-200",
    },
    button: {
      bg: "bg-gray-700 hover:bg-gray-600",
      text: "text-white",
      default: "bg-gray-700 hover:bg-gray-600 text-white",
      disabled: "bg-gray-600 text-gray-400 cursor-not-allowed",
    },
  },

  /** Component-specific colors - MaterialM */
  components: {
    button: {
      primary: "bg-materialm-primary hover:bg-materialm-primary-emphasis text-white",
      secondary: "bg-gray-700 hover:bg-gray-600 text-white",
      danger: "bg-materialm-error hover:opacity-90 text-white",
      success: "bg-materialm-success hover:opacity-90 text-white",
      shadow: "shadow-materialm-2",
      disabled: "bg-gray-600 text-gray-400 cursor-not-allowed",
    },

    input: {
      default: "bg-white dark:bg-materialm-dark border-materialm-border dark:border-materialm-border-dark text-gray-900 dark:text-white",
      error: "bg-white dark:bg-materialm-dark border-materialm-error",
      placeholder: "placeholder:text-gray-500 dark:placeholder:text-gray-400",
    },

    modal: {
      background: "bg-white dark:bg-materialm-dark",
      border: "border-materialm-border dark:border-materialm-border-dark",
      overlay: "bg-black/70 backdrop-blur-sm",
      shadow: "shadow-materialm-5",
    },

    card: {
      default: "bg-white dark:bg-materialm-dark border border-materialm-border-dark",
      shadow: "shadow-materialm-2",
    },

    hold: {
      scheduled: "bg-materialm-primary-light border-l-4 border-materialm-primary",
      completed: "bg-materialm-success-light border-l-4 border-materialm-success",
      border: "border-materialm-border-dark",
    },
  },

  /** Semantic colors - MaterialM OKLCH */
  semantic: {
    primary: {
      solid: "bg-materialm-primary",
      gradient: "bg-materialm-primary",
      hover: "hover:bg-materialm-primary-emphasis",
      text: "text-materialm-primary",
      border: "border-materialm-primary",
      light: "bg-materialm-primary-light",
      shadow: "shadow-materialm-2",
    },

    secondary: {
      solid: "bg-materialm-secondary",
      hover: "hover:bg-materialm-secondary-emphasis",
      text: "text-materialm-secondary",
    },

    success: {
      solid: "bg-materialm-success",
      gradient: "bg-materialm-success",
      hover: "hover:opacity-90",
      text: "text-materialm-success",
      border: "border-materialm-success",
      light: "bg-materialm-success-light",
      shadow: "shadow-materialm-2",
    },

    error: {
      solid: "bg-materialm-error",
      hover: "hover:opacity-90",
      text: "text-materialm-error",
      border: "border-materialm-error",
      light: "bg-materialm-error-light",
      gradient: "bg-materialm-error",
      shadow: "shadow-materialm-2",
    },

    warning: {
      solid: "bg-materialm-warning",
      gradient: "bg-materialm-warning",
      hover: "hover:opacity-90",
      text: "text-materialm-warning",
      border: "border-materialm-warning",
      light: "bg-materialm-warning-light",
    },

    info: {
      solid: "bg-materialm-info",
      gradient: "bg-materialm-info",
      hover: "hover:opacity-90",
      text: "text-materialm-info",
      light: "bg-materialm-info-light",
      border: "border-materialm-info",
      shadow: "shadow-materialm-2",
    },

    scheduled: {
      solid: "bg-materialm-primary",
      gradient: "bg-materialm-primary",
      hover: "hover:bg-materialm-primary-emphasis",
      text: "text-materialm-primary",
      border: "border-materialm-primary",
      light: "bg-materialm-primary-light",
    },

    accent: {
      gradient: "bg-gradient-to-r from-red-500 to-orange-600",
      hover: "hover:from-red-600 hover:to-orange-700",
      shadow: "shadow-lg",
    },
  },
};

export type Colors = typeof colors;
