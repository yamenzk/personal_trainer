/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          DEFAULT: '#e03a08',
          50: '#fff5f2',
          100: '#ffe6df',
          200: '#ffc6b5',
          300: '#ff9c80',
          400: '#ff6544',
          500: '#ff3a15',
          600: '#e03a08',
          700: '#c42a04',
          800: '#a12408',
          900: '#84220d',
        },
        // Enhanced Dark Theme
        dark: {
          bg: '#0a0a0a',
          card: '#141414',
          elevated: '#1c1c1c',
          border: '#2a2a2a',
          hover: '#1f1f1f',
          active: '#262626',
          text: {
            primary: '#ffffff',
            secondary: '#a1a1a1',
            tertiary: '#737373',
          }
        },
        // Enhanced Light Theme
        light: {
          bg: '#f8f8f8',
          card: '#ffffff',
          elevated: '#ffffff',
          border: '#e5e5e5',
          hover: '#f3f3f3',
          active: '#e9e9e9',
          text: {
            primary: '#171717',
            secondary: '#525252',
            tertiary: '#737373',
          }
        },
        // Status Colors
        status: {
          success: {
            text: '#16a34a',
            bg: '#f0fdf4',
            border: '#86efac',
            dark: {
              text: '#4ade80',
              bg: '#052e16',
              border: '#166534',
            }
          },
          error: {
            text: '#dc2626',
            bg: '#fef2f2',
            border: '#fecaca',
            dark: {
              text: '#f87171',
              bg: '#450a0a',
              border: '#991b1b',
            }
          },
          warning: {
            text: '#d97706',
            bg: '#fffbeb',
            border: '#fde68a',
            dark: {
              text: '#fbbf24',
              bg: '#451a03',
              border: '#92400e',
            }
          },
          info: {
            text: '#2563eb',
            bg: '#eff6ff',
            border: '#bfdbfe',
            dark: {
              text: '#60a5fa',
              bg: '#172554',
              border: '#1e40af',
            }
          }
        }
      },
      // Typography
      fontFamily: {
        sans: [
          'SF Pro Display',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.005em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.005em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.005em' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.005em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.015em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
      },
      // Spacing & Layout
      spacing: {
        'header': '64px',
        'footer': '72px',
      },
      // Animations
      animation: {
        'slide-up': 'slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-left': 'slide-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-right': 'slide-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-out': 'fade-out 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-out': 'scale-out 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shake': {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-3px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(3px, 0, 0)' },
        },
      },
      // Effects
      blur: {
        xs: '2px',
      },
      backdropBlur: {
        xs: '2px',
      },
      // Shadows
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'dropdown': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}