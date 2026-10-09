/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF6B2C',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          accent: '#FF6B2C',
          glow: 'rgba(255, 107, 44, 0.25)',
          hover: '#FF7A33',
        },
        dark: {
          base: '#0c0d11',
          surface: '#12141a',
          card: '#161821',
          cardHover: '#1c1f2b',
          border: '#232736',
          borderLight: 'rgba(255, 255, 255, 0.08)',
          muted: '#687087',
          text: '#f3f4f6',
          subtext: '#9ba3b8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        'orange-glow': '0 0 20px -4px rgba(255, 107, 44, 0.35)',
        'orange-glow-sm': '0 0 10px -2px rgba(255, 107, 44, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flash-row': 'flashRow 1.5s ease-out',
      },
      keyframes: {
        flashRow: {
          '0%': { backgroundColor: 'rgba(255, 107, 44, 0.18)' },
          '100%': { backgroundColor: 'transparent' },
        }
      }
    },
  },
  plugins: [],
}
