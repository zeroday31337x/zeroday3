/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'zd-dark': '#0a0a0a',
        'zd-gray': '#1a1a1a',
        'zd-accent': '#00ff9d',
        'zd-text': '#e0e0e0',
      },
    },
  },
  plugins: [],
}
