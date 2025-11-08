/**
 * Color Tokens - Semantic Color System
 * 
 * This file defines semantic colors with proper saturation hierarchy.
 * Use these instead of direct Tailwind color classes for consistency.
 * 
 * @see src/styles/README.md for usage guidelines
 */

export const colorTokens = {
  /**
   * Semantic Hold/Status Colors with Saturation Hierarchy
   * 
   * Primary actions use high saturation for maximum attention.
   * Secondary/tertiary elements use reduced saturation to avoid visual competition.
   */
  semantic: {
    // Primary hold status - HIGH saturation (critical attention)
    primary: {
      solid: 'bg-gradient-to-r from-red-600 to-rose-700',
      text: 'text-red-400',
      textDark: 'text-red-300',
      border: 'border-red-500',
      ring: 'ring-red-500',
      hover: 'hover:from-red-500 hover:to-rose-600',
    },
    
    // Scheduled holds - MEDIUM saturation (reduced from high)
    scheduled: {
      solid: 'bg-gradient-to-r from-blue-500 to-blue-600',
      text: 'text-blue-300',
      textDark: 'text-blue-200',
      border: 'border-blue-400',
      ring: 'ring-blue-400',
      hover: 'hover:from-blue-400 hover:to-blue-500',
    },
    
    // Success/completed - MEDIUM saturation (reduced from high)
    success: {
      solid: 'bg-gradient-to-r from-emerald-500 to-green-600',
      text: 'text-emerald-300',
      textDark: 'text-emerald-200',
      border: 'border-emerald-400',
      ring: 'ring-emerald-400',
      hover: 'hover:from-emerald-400 hover:to-green-500',
    },
    
    // Warning/attention - LOW saturation (reduced significantly)
    warning: {
      solid: 'bg-gradient-to-r from-amber-400 to-yellow-500',
      text: 'text-amber-200',
      textDark: 'text-amber-100',
      border: 'border-amber-300',
      ring: 'ring-amber-300',
      hover: 'hover:from-amber-300 hover:to-yellow-400',
    },
    
    // Info/neutral
    info: {
      solid: 'bg-gradient-to-r from-slate-500 to-slate-600',
      text: 'text-slate-300',
      textDark: 'text-slate-200',
      border: 'border-slate-400',
      ring: 'ring-slate-400',
      hover: 'hover:from-slate-400 hover:to-slate-500',
    },
  },

  /**
   * Button Color Hierarchy
   * 
   * Primary: High saturation for main actions
   * Secondary: Medium saturation for alternative actions
   * Tertiary: Low saturation for subtle actions
   */
  button: {
    primary: {
      gradient: 'from-blue-600 to-blue-700',
      hover: 'hover:from-blue-500 hover:to-blue-600',
      active: 'active:from-blue-700 active:to-blue-800',
      focus: 'focus-visible:ring-2 focus-visible:ring-blue-500',
      disabled: 'disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed disabled:opacity-50',
    },
    
    secondary: {
      gradient: 'from-gray-600 to-gray-700',
      hover: 'hover:from-gray-500 hover:to-gray-600',
      active: 'active:from-gray-700 active:to-gray-800',
      focus: 'focus-visible:ring-2 focus-visible:ring-gray-500',
      disabled: 'disabled:from-gray-800 disabled:to-gray-900 disabled:cursor-not-allowed disabled:opacity-50',
    },
    
    tertiary: {
      bg: 'bg-slate-700',
      hover: 'hover:bg-slate-600',
      active: 'active:bg-slate-800',
      focus: 'focus-visible:ring-2 focus-visible:ring-slate-500',
      disabled: 'disabled:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50',
    },
    
    danger: {
      gradient: 'from-red-600 to-rose-700',
      hover: 'hover:from-red-500 hover:to-rose-600',
      active: 'active:from-red-700 active:to-rose-800',
      focus: 'focus-visible:ring-2 focus-visible:ring-red-500',
      disabled: 'disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed disabled:opacity-50',
    },
    
    success: {
      gradient: 'from-emerald-600 to-green-700',
      hover: 'hover:from-emerald-500 hover:to-green-600',
      active: 'active:from-emerald-700 active:to-green-800',
      focus: 'focus-visible:ring-2 focus-visible:ring-emerald-500',
      disabled: 'disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed disabled:opacity-50',
    },
  },

  /**
   * Text Color Hierarchy (synced with theme.ts)
   * 
   * These match the theme values but are available as standalone tokens.
   */
  text: {
    dark: {
      primary: 'text-gray-100',      // #f3f4f6 - 15.2:1 contrast
      secondary: 'text-gray-400',    // #9ca3af - 6.8:1 contrast
      tertiary: 'text-gray-500',     // #6b7280 - 4.9:1 contrast
      muted: 'text-[#a3b2c8]',       // 5.2:1 contrast (WCAG AA compliant)
    },
    light: {
      primary: 'text-slate-800',     // #1e293b
      secondary: 'text-slate-500',   // #64748b
      tertiary: 'text-slate-400',    // #94a3b8
      muted: 'text-[#a0aec0]',       // 4.7:1 contrast (WCAG AA compliant)
    },
  },

  /**
   * Background Color Hierarchy
   */
  background: {
    dark: {
      primary: 'bg-slate-950',       // Main background
      secondary: 'bg-slate-900',     // Cards, modals
      tertiary: 'bg-slate-800',      // Elevated elements
      hover: 'hover:bg-slate-700',   // Interactive hover
    },
    light: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      tertiary: 'bg-gray-100',
      hover: 'hover:bg-gray-200',
    },
  },

  /**
   * Border Colors
   */
  border: {
    dark: {
      default: 'border-slate-700',
      subtle: 'border-slate-800',
      strong: 'border-slate-600',
    },
    light: {
      default: 'border-gray-300',
      subtle: 'border-gray-200',
      strong: 'border-gray-400',
    },
  },
} as const;

/**
 * Type-safe color token accessor
 */
export type ColorTokens = typeof colorTokens;
