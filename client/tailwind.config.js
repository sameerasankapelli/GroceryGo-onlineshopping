/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#ff6b35',
        secondary: '#f7931e',
      }
    },
  },
  plugins: [],
}
