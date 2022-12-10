/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      letterSpacing: {
        '2widest': '.2em'
      },
      fontSize: {
        '3xs': '0.625rem',
        '2xs': '0.75rem',
        '3.5xl': ['2rem', {
          lineHeight: '2.375rem',
          fontWeight: '500',
        }]
      },
      colors: {
        'hostinger-purple': '#583bb6',
        'hostinger-purple-deep': '#3D2CA5',
        'hostinger-purple-opaque': '#9B89D3',
        'hostinger-background-grey': '#F5F8FB',
        'hostinger-hover-grey': '#EBEFF2',
        'hostinger-text-grey': '#474b4f'
      }
    },
  },
  plugins: [],
}