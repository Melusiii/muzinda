/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E6B3C', // Deep Green
          light: '#4CAF6E',   // Primary Light
          dark: '#145229',    // Primary Dark
        },
        accent: {
          gold: '#D4A017',    // Warm Gold
          amber: '#C0522A',   // Earthy Amber
          yellow: '#F59E0B',  // Logo Dot
        },
        surface: {
          bright: '#F4F8F5',  // Slight green-tinted white
          DEFAULT: '#FFFFFF', // Clean white
        },
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
