/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#080C12',
          2: '#0E1420',
          3: '#141B28',
        },
        accent: {
          DEFAULT: '#3B82F6',
          2: '#10B981',
        },
        border: 'rgba(255,255,255,0.07)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'draw-line': 'drawLine 1.2s ease forwards',
        'blink': 'blink 1s step-end infinite',
        'counter': 'counter 1.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        drawLine: {
          from: { height: '0' },
          to:   { height: '100%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
