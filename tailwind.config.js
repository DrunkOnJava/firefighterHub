/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js", // Flowbite content
  ],
  theme: {
    extend: {
      /**
       * Custom color palette extensions
       *
       * These custom slate shades bridge the gaps in Tailwind's default palette
       * to match the original design system hex colors.
       *
       * Mapping:
       * - slate-850: #353D47 (surface backgrounds, slight elevation)
       * - slate-825: #3A4149 (card backgrounds, primary surface)
       * - slate-875: #2A3039 (other month days in calendar)
       *
       * @see Issue #16 - Migrate Custom Hex Colors to Tailwind
       */
      colors: {
        slate: {
          825: '#3A4149',  // Card backgrounds (was bg-[#3A4149])
          850: '#353D47',  // Surface backgrounds (was bg-[#353D47])
          875: '#2A3039',  // Darker surfaces (was bg-[#2A3039])
        },
        /**
         * MaterialM OKLCH Color Palette
         *
         * Approximate hex conversions from OKLCH color space.
         * For true OKLCH support, use the CSS custom properties in materialM.css.
         *
         * Theme: BLUE_THEME (recommended for emergency services)
         * Source: MaterialM React/Tailwind Pro Template
         *
         * @see src/styles/materialM.css for exact OKLCH values
         * @see docs/MATERIALM_IMPLEMENTATION_PLAN.md for full documentation
         */
        materialm: {
          // Backgrounds
          dark: '#2a303d',        // oklch(0.23 0.037 258.85)
          darkgray: '#2e3440',    // oklch(0.26 0.0374 260)

          // Primary (BLUE_THEME)
          primary: '#5d87ff',           // oklch(66.93% 0.224 247.87)
          'primary-emphasis': '#4c76ee', // oklch(63.47% 0.213 247.92)
          'primary-light': 'rgba(93, 135, 255, 0.125)', // oklch with 12.5% opacity

          // Secondary (BLUE_THEME)
          secondary: '#764ba2',           // oklch(58.25% 0.213 291.79)
          'secondary-emphasis': '#6a3d93', // oklch(55.04% 0.205 292.12)
          'secondary-light': 'rgba(118, 75, 162, 0.125)', // oklch with 12.5% opacity

          // Semantic Colors
          info: '#49beff',     // oklch(0.78 0.1209 218.04)
          success: '#13deb9',  // oklch(0.76 0.138061 180.4149)
          warning: '#fec90f',  // oklch(0.83 0.1712 81.04)
          error: '#fa896b',    // oklch(0.71 0.1892 5.4)

          // Light Semantic Variants
          'info-light': 'rgba(73, 190, 255, 0.145)',    // 14.51% opacity
          'success-light': 'rgba(19, 222, 185, 0.145)', // 14.51% opacity
          'warning-light': 'rgba(254, 201, 15, 0.145)', // 14.51% opacity
          'error-light': 'rgba(250, 137, 107, 0.188)',  // 18.82% opacity

          // Borders
          border: '#e9ecef',      // oklch(0.92 0.0094 242.84)
          'border-dark': '#464f5c', // oklch(0.37 0.0414 262.29)

          // Text
          link: '#2a3547',        // oklch(0.33 0.0355 260.11)
          'link-dark': '#7c8fac', // oklch(0.62 0.0225 243.61)
        },
      },
      animation: {
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        slideUp: {
          "0%": {
            transform: "translateX(-50%) translateY(100%)",
            opacity: "0",
          },
          "100%": { transform: "translateX(-50%) translateY(0)", opacity: "1" },
        },
      },
      /**
       * MaterialM Border Radius Tokens
       */
      borderRadius: {
        'materialm-sm': '7px',
        'materialm-md': '9px',
        'materialm-lg': '24px',
      },
      /**
       * MaterialM Shadow Elevation System
       */
      boxShadow: {
        'materialm-1': '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)',
        'materialm-2': '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15)',
        'materialm-3': '0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        'materialm-4': '0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px 0 rgba(0, 0, 0, 0.3)',
        'materialm-5': '0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px 0 rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [
    // Flowbite plugin (optional - theme customization happens via Flowbite provider)
    // require('flowbite/plugin')
  ],
};
