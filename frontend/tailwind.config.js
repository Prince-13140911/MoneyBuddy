/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        surface:    'var(--surface)',
        primary:    { DEFAULT: '#0EA5E9', dark: '#0284C7' },
        accent:     { DEFAULT: '#10B981', dark: '#059669' },
        secondary:  { DEFAULT: '#6EE7B7', dark: '#34D399' },
        success:    '#22C55E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
