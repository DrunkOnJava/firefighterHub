/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
