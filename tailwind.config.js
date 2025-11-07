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
      
      /**
       * Grid System Extensions
       * 
       * Custom grid configurations for app layout, calendar, and roster.
       * 
       * @see src/styles/gridSystem.ts for full configuration
       */
      gridTemplateColumns: {
        // App layout: Calendar (1fr) + Sidebar (480px)
        'app-desktop': '1fr 480px',
        'app-tablet': '1fr',
        
        // Calendar: 7 columns for weekdays
        'calendar': 'repeat(7, 1fr)',
        'calendar-mobile': 'repeat(7, minmax(48px, 1fr))',
        
        // Roster: Name (1.2fr) + Station (0.5fr) + Certs (0.8fr)
        'roster': '1.2fr 0.5fr 0.8fr',
        'roster-mobile': '1fr',
        
        // Form: Label (auto) + Input (1fr)
        'form': 'auto 1fr',
        
        // Next Up Bar: 3 equal columns
        'next-up': 'repeat(3, 1fr)',
      },
      
      gridTemplateRows: {
        // Calendar: Header (24px) + 6 weeks (equal)
        'calendar-desktop': '24px repeat(6, 1fr)',
        'calendar-tablet': '20px repeat(6, 1fr)',
        
        // Roster: 20 equal rows (all firefighters visible)
        'roster': 'repeat(20, 1fr)',
      },
      
      /**
       * Grid Template Areas
       * 
       * Named areas for semantic layout declarations.
       */
      gridTemplateAreas: {
        'app-layout': '"calendar sidebar"',
        'app-layout-mobile': '"calendar" "sidebar"',
      },
      
      /**
       * Spacing Extensions
       * 
       * Based on 8px baseline grid for vertical rhythm.
       * Added design token support for section separation.
       */
      spacing: {
        // Baseline units
        'baseline': '8px',
        'baseline-2': '16px',
        'baseline-3': '24px',
        'baseline-4': '32px',
        'baseline-5': '40px',
        'baseline-6': '48px',
        'baseline-8': '64px',
        // Design token additions
        'section': '32px',      // gap-section token
        'sectionLarge': '48px', // gap-sectionLarge token
      },
      
      /**
       * Aspect Ratios
       * 
       * Calendar cells use custom aspect ratios for better layout.
       */
      aspectRatio: {
        'calendar-cell': '1 / 1.2',  // Slightly taller than square
        'calendar-mobile': '1 / 1',   // Square on mobile
      },
      
      /**
       * Min/Max Dimensions
       * 
       * Content-responsive sizing constraints.
       * Touch target dimensions comply with WCAG 2.5.5.
       */
      minHeight: {
        'calendar-cell-mobile': '48px',
        'calendar-cell-tablet': '60px',
        'calendar-cell-desktop': '80px',
        'roster-row': '32px',
        'touch-target': '44px',      // WCAG 2.5.5 minimum
        'touch': '44px',             // Design token alias
      },
      minWidth: {
        'touch-target': '44px',      // WCAG 2.5.5 minimum
        'touch': '44px',             // Design token alias
      },
      ringWidth: {
        '3': '3px',                  // Enhanced focus indicator
      },
      
      /**
       * Animations
       */
      animation: {
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.2s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "shimmer": "shimmer 2s infinite",
      },
      
      keyframes: {
        slideUp: {
          "0%": {
            transform: "translateX(-50%) translateY(100%)",
            opacity: "0",
          },
          "100%": { 
            transform: "translateX(-50%) translateY(0)", 
            opacity: "1" 
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { 
            opacity: "0",
            transform: "scale(0.95)",
          },
          "100%": { 
            opacity: "1",
            transform: "scale(1)",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [
    // Design token utility classes
    function({ addUtilities }) {
      addUtilities({
        // Touch target enforcement
        '.touch-target': {
          minWidth: '44px',
          minHeight: '44px',
        },
        '.touch-target-comfortable': {
          minWidth: '48px',
          minHeight: '48px',
        },
        // Enhanced focus indicator
        '.focus-enhanced': {
          outline: 'none',
          '&:focus-visible': {
            ringWidth: '3px',
            ringColor: '#3b82f6', // blue-500
          },
        },
      });
    },
  ],
};
