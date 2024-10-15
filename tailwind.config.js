/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wine: {
          300: '#e6a9ae',
          400: '#d98289',
          600: '#722f37',
          700: '#5e1f28',
        },
        chardonnay: {
          100: '#FFF9E6',
          800: '#8B7D39',
        },
      },
    },
  },
  plugins: [],
};