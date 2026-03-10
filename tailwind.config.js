/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // FZ Travel — Palette Avorio/Oro
        ivory:       '#FBF7F3',
        gold:        '#C3AB87',
        'gold-light':'#E0CCAE',
        'gold-dark': '#B69769',
        charcoal:    '#525051',
        'grey-mid':  '#858280',
        'grey-light':'#E4E1E1',
        deep:        '#2C2A2B',
      },
      fontFamily: {
        sans:   ['"Plus Jakarta Sans"', '"Outfit"', 'sans-serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        serif:  ['"Cormorant Garamond"', 'serif'],
        mono:   ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '3rem',
      },
    },
  },
  plugins: [],
}
