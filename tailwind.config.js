/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-red': '#ff4500',
        'neon-orange': '#ff6b00',
        'neon-amber': '#ffaa00',
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
