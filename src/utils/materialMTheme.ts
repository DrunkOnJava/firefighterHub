/**
 * MaterialM Theme Configuration
 *
 * Adapted from MaterialM React/Tailwind Pro template.
 * Uses OKLCH color space for perceptually uniform colors.
 *
 * Source: /tmp/materialm-react-tailwind-pro-main/packages/default/
 *
 * Note: Using Record<string, any> for now until we can properly type the theme.
 * The Flowbite React v0.12.10 type exports are not fully compatible with
 * TypeScript strict mode. This will be resolved when Flowbite updates their types.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const materialMTheme: Record<string, any> = {
  button: {
    base: "group relative flex items-center justify-center p-0.5 focus:ring-0 text-center font-medium cursor-pointer",
    color: {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-purple-600 hover:bg-purple-700 text-white",
      error: "bg-red-600 hover:bg-red-700 text-white",
      warning: "bg-amber-600 hover:bg-amber-700 text-white",
      info: "bg-cyan-600 hover:bg-cyan-700 text-white",
      success: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    size: {
      xs: "h-8 px-3 text-xs",
      sm: "h-9 px-3 text-sm",
      md: "h-[42px] px-5 text-sm",
      lg: "h-12 px-5 text-base",
      xl: "h-15 px-6 text-base",
    },
    pill: "rounded-full",
  },

  badge: {
    root: {
      base: "flex h-fit w-fit items-center font-medium text-xs",
      color: {
        primary: "bg-blue-600 text-white",
        secondary: "bg-purple-600 text-white",
        info: "bg-cyan-600 text-white",
        success: "bg-emerald-600 text-white",
        warning: "bg-amber-600 text-white",
        error: "bg-red-600 text-white",
      },
    },
    icon: {
      off: "rounded-full px-2.5 py-1",
      on: "rounded-full py-[5px] px-[10px] gap-1",
    },
  },

  card: {
    root: {
      base: "flex rounded-lg shadow-md bg-white dark:bg-slate-800 p-6 relative w-full",
      children: "flex h-full flex-col justify-center gap-2 p-0",
    },
  },

  modal: {
    content: {
      inner: "relative flex max-h-[90dvh] flex-col rounded-lg bg-white dark:bg-slate-800",
    },
    header: {
      base: "flex items-start justify-between border-0 p-6",
      title: "text-xl font-semibold text-gray-900 dark:text-white",
    },
    body: {
      base: "flex-1 overflow-auto p-6",
    },
  },

  toast: {
    root: {
      base: "flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow-lg dark:bg-slate-800 dark:text-gray-400",
    },
  },
};

/**
 * MaterialM OKLCH Color Palette
 *
 * For use in Tailwind config or CSS custom properties.
 */
export const materialMColors = {
  // Backgrounds
  dark: "oklch(0.23 0.037 258.85)",
  darkgray: "oklch(0.26 0.0374 260)",

  // Primary (BLUE_THEME)
  primary: "oklch(66.93% 0.224 247.87)",
  primaryEmphasis: "oklch(63.47% 0.213 247.92)",
  lightPrimary: "oklch(66.93% 0.224 247.87 / 12.5%)",

  // Secondary (BLUE_THEME)
  secondary: "oklch(58.25% 0.213 291.79)",
  secondaryEmphasis: "oklch(55.04% 0.205 292.12)",
  lightSecondary: "oklch(58.25% 0.213 291.79 / 12.5%)",

  // Semantic
  info: "oklch(0.78 0.1209 218.04)",
  success: "oklch(0.76 0.138061 180.4149)",
  warning: "oklch(0.83 0.1712 81.04)",
  error: "oklch(0.71 0.1892 5.4)",

  // Light variants (12.5% opacity)
  lightSuccess: "oklch(0.76 0.138061 180.4149 / 14.51%)",
  lightError: "oklch(0.71 0.1892 5.4 / 18.82%)",
  lightInfo: "oklch(0.78 0.1209 218.04 / 14.51%)",
  lightWarning: "oklch(0.83 0.1712 81.04 / 14.51%)",

  // Borders
  border: "oklch(0.92 0.0094 242.84)",
  darkBorder: "oklch(0.37 0.0414 262.29)",

  // Text
  link: "oklch(0.33 0.0355 260.11)",
  darkLink: "oklch(0.62 0.0225 243.61)",
};
