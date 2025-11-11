/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			slate: {
  				'825': '#3A4149',
  				'850': '#353D47',
  				'875': '#2A3039'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		gridTemplateColumns: {
  			'app-desktop': '1fr 480px',
  			'app-tablet': '1fr',
  			calendar: 'repeat(7, 1fr)',
  			'calendar-mobile': 'repeat(7, minmax(48px, 1fr))',
  			roster: '1.2fr 0.5fr 0.8fr',
  			'roster-mobile': '1fr',
  			form: 'auto 1fr',
  			'next-up': 'repeat(3, 1fr)'
  		},
  		gridTemplateRows: {
  			'calendar-desktop': '24px repeat(6, 1fr)',
  			'calendar-tablet': '20px repeat(6, 1fr)',
  			roster: 'repeat(20, 1fr)'
  		},
  		gridTemplateAreas: {
  			'app-layout': 'calendar sidebar"',
  			'app-layout-mobile': 'calendar" "sidebar"'
  		},
  		spacing: {
  			baseline: '8px',
  			'baseline-2': '16px',
  			'baseline-3': '24px',
  			'baseline-4': '32px',
  			'baseline-5': '40px',
  			'baseline-6': '48px',
  			'baseline-8': '64px',
  			section: '32px',
  			sectionLarge: '48px'
  		},
  		aspectRatio: {
  			'calendar-cell': '1 / 1.2',
  			'calendar-mobile': '1 / 1'
  		},
  		minHeight: {
  			'calendar-cell-mobile': '48px',
  			'calendar-cell-tablet': '60px',
  			'calendar-cell-desktop': '80px',
  			'roster-row': '32px',
  			'touch-target': '44px',
  			touch: '44px'
  		},
  		minWidth: {
  			'touch-target': '44px',
  			touch: '44px'
  		},
  		ringWidth: {
  			'3': '3px'
  		},
  		animation: {
  			'slide-up': 'slideUp 0.3s ease-out',
  			'fade-in': 'fadeIn 0.2s ease-out',
  			'scale-in': 'scaleIn 0.2s ease-out',
  			shimmer: 'shimmer 2s infinite'
  		},
  		keyframes: {
  			slideUp: {
  				'0%': {
  					transform: 'translateX(-50%) translateY(100%)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateX(-50%) translateY(0)',
  					opacity: '1'
  				}
  			},
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			scaleIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.95)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			shimmer: {
  				'0%': {
  					backgroundPosition: '-1000px 0'
  				},
  				'100%': {
  					backgroundPosition: '1000px 0'
  				}
  			}
  		},
  		borderRadius: {
  			lg: '12px',           /* Calendr modals, large cards */
  			md: '8px',            /* Calendr buttons, inputs, cards */
  			sm: '4px',            /* Calendr badges, small elements */
  			xl: '16px',           /* Calendr hero sections */
  			full: '9999px'        /* Pills, avatars */
  		}
  	}
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
      require("tailwindcss-animate")
],
};
