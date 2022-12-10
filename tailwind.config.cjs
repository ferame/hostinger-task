/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hostinger-purple': '#583bb6',
        'hostinger-purple-deep': '#3D2CA5',
        'hostinger-purple-opaque': '#9B89D3',
        'hostinger-background-grey': '#F5F8FB',
        'hostinger-hover-grey': '#EBEFF2',
      }
    },
  },
  plugins: [],
}