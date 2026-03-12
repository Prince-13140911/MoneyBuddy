/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        surface: '#0F172A',
        primary: { DEFAULT: '#6366F1', dark: '#4F46E5' },
        secondary: { DEFAULT: '#14B8A6', dark: '#0D9488' },
        success: '#22C55E',
      },
    },
  },
  plugins: [],
}
