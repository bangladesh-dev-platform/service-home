/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Noto Sans Bengali"', '"Nunito"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
