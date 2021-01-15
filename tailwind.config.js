const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blue: colors.cyan,
        gray: colors.trueGray
      },
      height: {
        xxl: '31.25rem'
      }
    }
  },
  variants: {
    extend: {
      borderWidth: ['focus', 'active'],
      borderStyle: ['focus']
    }
  },
  plugins: []
}
