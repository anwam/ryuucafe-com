/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx,astro}',
    './components/**/*.{ts,tsx,astro}',
    './app/**/*.{ts,tsx,astro}',
    './src/**/*.{ts,tsx,astro}',
  ],
  prefix: '',
  theme: {
    extend: {
      screens: {
        xs: '475px', // Extra small devices
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
