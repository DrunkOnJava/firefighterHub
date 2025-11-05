/**
 * Color System - Hybrid Approach
 *
 * This color system uses a hybrid approach with clear rules:
 * - GRAY palette → Structural elements (backgrounds, containers, borders)
 * - SLATE palette → Interactive elements (buttons, inputs, hover states)
 * - SEMANTIC colors → Contextual meaning (red=danger, blue=scheduled, emerald=success)
 *
 * This provides flexibility while maintaining consistency through clear guidelines.
 *
 * @see src/styles/README.md for detailed usage rules
 */

/**
 * Structural Colors (Gray palette)
 *
 * Use for:
 * - Page backgrounds
 * - Card backgrounds
 * - Container backgrounds
 * - Divider lines
 * - Border colors (default state)
 * - Text color hierarchy
 */
export const colors = {
  structural: {
    /** Background colors */
    bg: {
      app: "bg-slate-900", // Main app background (was #2F3640)
      card: "bg-slate-825", // Card backgrounds (was #3A4149) - custom shade
      cardHover: "bg-slate-700", // Card hover state (was #424A54)
      overlay: "bg-black/75", // Modal overlay
      surface: "bg-slate-850", // Subtle surface difference (was #353D47) - custom shade
    },

    /** Border colors */
    border: {
      default: "border-slate-900", // Standard borders (was #252A32)
      emphasis: "border-slate-950", // Emphasized borders (was #1E2329)
      subtle: "border-slate-900", // Subtle borders (was #2F3640)
      hover: "border-slate-600", // Hover state (was #4A5360)
      strong: "border-slate-600", // Strong borders (was #4A5360)
    },

    /** Text colors */
    text: {
      primary: "text-gray-100", // Main text (high contrast)
      secondary: "text-gray-400", // Secondary text (medium contrast)
      tertiary: "text-gray-500", // Tertiary text (low contrast)
      muted: "text-gray-600", // Very subtle text
      surface: "text-gray-300", // Text on surface backgrounds
    },
  },

  /**
   * Interactive Colors (Slate palette)
   *
   * Use for:
   * - Button backgrounds (non-primary)
   * - Input fields
   * - Dropdown menus
   * - Hover/focus states
   * - Active selections
   */
  interactive: {
    /** Button states */
    button: {
      default: "bg-slate-700", // Default button background
      hover: "bg-slate-600", // Button hover
      active: "bg-slate-500", // Button active/pressed
      disabled: "bg-slate-800", // Disabled state
    },

    /** Input field states */
    input: {
      default: "bg-slate-800 border-slate-600",
      hover: "bg-slate-750 border-slate-500",
      focus: "bg-slate-800 border-blue-500 ring-2 ring-blue-500/20",
      disabled: "bg-slate-900 border-slate-700",
      error: "bg-slate-800 border-red-500",
    },

    /** Hover states for various elements */
    hover: {
      bg: "hover:bg-slate-700",
      text: "hover:text-slate-200",
      border: "hover:border-slate-500",
    },
  },

  /**
   * Semantic Colors
   *
   * Use for:
   * - Primary actions (red gradient)
   * - Scheduled holds (blue)
   * - Completed holds (emerald/green)
   * - Warnings (yellow/amber)
   * - Errors (red)
   * - Success messages (green)
   */
  semantic: {
    /** Primary actions (red/rose theme) */
    primary: {
      gradient: "bg-gradient-to-br from-red-600 to-rose-700",
      solid: "bg-red-600",
      hover: "hover:from-red-500 hover:to-rose-600",
      text: "text-red-500",
      border: "border-red-600",
      shadow: "shadow-lg shadow-red-900/50",
      light: "bg-red-500/20",
    },

    /** Scheduled holds (blue) */
    scheduled: {
      gradient: "bg-gradient-to-br from-blue-600 to-blue-700",
      solid: "bg-blue-600",
      hover: "hover:from-blue-500 hover:to-blue-600",
      text: "text-blue-400",
      border: "border-blue-600",
      light: "bg-blue-500/20",
      shadow: "shadow-lg shadow-blue-900/50",
    },

    /** Completed/success (emerald/green) */
    success: {
      gradient: "bg-gradient-to-br from-emerald-600 to-green-700",
      solid: "bg-emerald-600",
      hover: "hover:from-emerald-500 hover:to-green-600",
      text: "text-emerald-400",
      border: "border-emerald-600",
      light: "bg-emerald-500/20",
      shadow: "shadow-lg shadow-emerald-900/50",
    },

    /** Warning states (amber/yellow) */
    warning: {
      gradient: "bg-gradient-to-br from-amber-500 to-yellow-600",
      solid: "bg-amber-500",
      hover: "hover:from-amber-400 hover:to-yellow-500",
      text: "text-white",
      border: "border-amber-500",
      light: "bg-amber-500/20",
      shadow: "shadow-lg shadow-amber-900/50",
    },

    /** Error states (red) */
    error: {
      gradient: "bg-gradient-to-br from-red-600 to-red-700",
      solid: "bg-red-600",
      hover: "hover:from-red-500 hover:to-red-600",
      text: "text-red-400",
      border: "border-red-600",
      light: "bg-red-500/20",
      shadow: "shadow-lg shadow-red-900/50",
    },

    /** Info states (cyan/teal) */
    info: {
      gradient: "bg-gradient-to-br from-cyan-600 to-teal-700",
      solid: "bg-cyan-600",
      hover: "hover:from-cyan-500 hover:to-teal-600",
      text: "text-cyan-400",
      border: "border-cyan-600",
      light: "bg-cyan-500/20",
      shadow: "shadow-lg shadow-cyan-900/50",
    },

    /** Accent/Action color (red-orange gradient) */
    accent: {
      gradient: "bg-gradient-to-r from-red-500 to-orange-600",
      hover: "hover:from-red-600 hover:to-orange-700",
      text: "text-orange-500",
      border: "border-orange-600",
      light: "bg-orange-500/20",
      shadow: "shadow-lg",
    },
  },

  /**
   * Component-Specific Colors
   *
   * Pre-configured combinations for common components.
   */
  components: {
    /** Button styles */
    button: {
      primary:
        "bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-900/50 transition-all duration-150",
      secondary:
        "bg-slate-700 hover:bg-slate-600 text-gray-100 border border-slate-600 transition-all duration-150",
      danger:
        "bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-900/50 transition-all duration-150",
      success:
        "bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white shadow-lg shadow-emerald-900/50 transition-all duration-150",
      ghost:
        "bg-transparent hover:bg-slate-700 text-gray-300 transition-all duration-150",
      disabled: "bg-slate-800 text-gray-600 cursor-not-allowed opacity-50",
      shadow: "shadow-lg shadow-gray-900/50",
    },

    /** Input field styles */
    input: {
      default:
        "bg-slate-800 border border-slate-600 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-150",
      error:
        "bg-slate-800 border border-red-500 text-gray-100 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-150",
      border: "border-slate-600",
      placeholder: "placeholder-gray-500",
    },

    /** Modal styles */
    modal: {
      background: "bg-slate-825",
      border: "border border-slate-900",
      shadow: "shadow-2xl",
      overlay: "bg-black/75 backdrop-blur-sm",
    },

    /** Card styles */
    card: {
      default: "bg-slate-825 border border-slate-900",
      hover:
        "bg-slate-825 border border-slate-900 hover:border-slate-600 hover:shadow-lg transition-all duration-150",
      elevated: "bg-slate-825 border border-slate-900 shadow-xl",
      shadow: "shadow-lg shadow-black/50",
    },

    /** Day cell styles (Calendar-specific) */
    dayCell: {
      scheduled: "bg-blue-500/20 border-2 border-blue-500",
      completed: "bg-slate-850/80 border-2 border-slate-900",
      both: "bg-gradient-to-br from-blue-500/20 to-slate-850/80 border-2 border-blue-500",
      empty: "bg-slate-825 border border-slate-900 hover:border-slate-600",
      today: "ring-2 ring-blue-400",
    },

    /** Hold card styles */
    hold: {
      border: "border-l-4",
      scheduled: "border-l-blue-500 bg-slate-825",
      completed: "border-l-emerald-500 bg-slate-825",
    },
  },

  /**
   * Gradient Presets
   *
   * Common gradient combinations used throughout the app.
   */
  gradients: {
    primary: "bg-gradient-to-br from-red-600 to-rose-700",
    scheduled: "bg-gradient-to-br from-blue-600 to-blue-700",
    success: "bg-gradient-to-br from-emerald-600 to-green-700",
    calendarHeader: "bg-gradient-to-r from-slate-950 to-slate-900",
    cardHover: "bg-gradient-to-br from-slate-825 to-slate-850",
  },
} as const;

/**
 * Type-safe color accessor
 */
export type Colors = typeof colors;

/**
 * Usage Examples:
 *
 * ```tsx
 * import { colors } from '@/styles';
 *
 * // Structural (backgrounds, borders)
 * <div className={`${colors.structural.bg.card} ${colors.structural.border.default}`}>
 *   Content
 * </div>
 *
 * // Interactive (buttons, inputs)
 * <button className={colors.components.button.primary}>
 *   Click Me
 * </button>
 *
 * // Semantic (meaning)
 * <div className={`${colors.semantic.scheduled.gradient} ${colors.semantic.scheduled.shadow}`}>
 *   Scheduled Hold
 * </div>
 * ```
 */
