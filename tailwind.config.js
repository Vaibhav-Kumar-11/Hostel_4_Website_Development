import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Resolve content globs against this file rather than process.cwd(), so the
// build produces the same CSS no matter which directory the dev server or CI
// job was launched from. Forward slashes are required even on Windows —
// fast-glob reads a backslash as an escape character, not a separator.
const root = dirname(fileURLToPath(import.meta.url)).replace(/\\/g, '/')

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [`${root}/index.html`, `${root}/src/**/*.{ts,tsx}`],
  theme: {
    extend: {
      colors: {
        // ── MADHOUSE identity ────────────────────────────────────────────
        // Warm amber pulled from the hostel's night photography (sodium
        // lamps, yellow common-room chairs, orange reading-room dividers).
        madhouse: {
          50: '#FFF4EB',
          100: '#FFE4CC',
          200: '#FFC79A',
          300: '#FFA761',
          400: '#FF8B33',
          500: '#FF6F0F', // primary accent
          600: '#EE5A00',
          700: '#C24700',
          800: '#963800',
          900: '#6E2A00',
        },
        // Secondary spark — the yellow of the common-room chairs.
        spark: {
          400: '#FFD233',
          500: '#FFC300',
          600: '#E0A800',
        },
        // Neutral scale tuned warm rather than blue-grey.
        ink: {
          50: '#F7F5F2',
          100: '#EDEAE5',
          200: '#DBD6CE',
          300: '#B9B2A8',
          400: '#8C857B',
          500: '#615B53',
          600: '#443F39',
          700: '#2B2823',
          800: '#1A1815',
          900: '#111010',
          950: '#0A0908',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk Variable"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-sm': ['clamp(2rem, 5.6vw, 3.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(2.5rem, 8.2vw, 6rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(4rem, 15vw, 12rem)', { lineHeight: '0.82', letterSpacing: '-0.05em' }],
      },
      maxWidth: {
        shell: '84rem',
      },
      boxShadow: {
        lift: '0 1px 2px rgba(10,9,8,.06), 0 12px 32px -12px rgba(10,9,8,.24)',
        glow: '0 0 0 1px rgba(255,111,15,.35), 0 18px 48px -18px rgba(255,111,15,.55)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'ticker': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.35', transform: 'scale(.82)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .6s cubic-bezier(.16,1,.3,1) both',
        'ticker': 'ticker var(--ticker-duration, 40s) linear infinite',
        'pulse-dot': 'pulse-dot 1.8s ease-in-out infinite',
        'shimmer': 'shimmer 1.6s infinite',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(.16,1,.3,1)',
      },
    },
  },
  plugins: [],
}
