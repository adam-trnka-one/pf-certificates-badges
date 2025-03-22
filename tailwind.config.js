/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        'pf': {
          primary: 'var(--pf-primary)',
          'dark-text': 'var(--pf-dark-text)',
          blue: 'var(--pf-blue)',
          gray: 'var(--pf-gray)',
          'light-gray': 'var(--pf-light-gray)',
          ai: 'var(--pf-ai)',
        }
      },
      backgroundImage: {
        'pf-gradient': 'linear-gradient(to right, var(--pf-gradient-from), var(--pf-gradient-to))',
      }
    },
  },
  plugins: [],
};
