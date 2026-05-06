/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-mono)'],
        sans: ['var(--font-sans)'],
      },
      colors: {
        bg: {
          DEFAULT: 'var(--color-bg)',
          2: 'var(--color-bg-2)',
          3: 'var(--color-bg-3)',
          4: 'var(--color-bg-4)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          2: 'var(--color-success)',
          soft: 'var(--color-accent-soft)',
        },
        text: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-muted)',
          strong: 'var(--color-text-strong)',
        },
        border: 'var(--color-border)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'draw-line': 'drawLine 1.2s ease forwards',
        blink: 'blink 1s step-end infinite',
        counter: 'counter 1.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        drawLine: {
          from: { height: '0' },
          to: { height: '100%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
