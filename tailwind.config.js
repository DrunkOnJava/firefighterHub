/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
    },
  },
  plugins: [],
};
