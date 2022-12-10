/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hostinger-purple': '#583AB5',
        'hostinger-hover-grey': '#EBEFF2',
      }
    },
  },
  plugins: [],
}