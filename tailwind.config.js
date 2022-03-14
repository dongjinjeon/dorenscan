module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.js',
  ],
  darkMode: false, // or 'media' or 'class'
  // important: true,
  theme: {
    colors: {
      'white': '#ffffff',
      'off-white': '#f8f8f8',

      'black': '#000000',
      'black-two': '#363636',

      'light-grey': '#c5c5c5',
      'warm-grey': '#959595',
      'warm-grey-two': '#898989',
      'pale-grey': '#f1f2f4',
      'pale-grey-two': '#e7eaf3',
      'pale-grey-three': '#f1f4f6',

      'blue': '#0451bd',
      'night-blue': '#040731',
      // 'lightblue': '#61aaf3',
      'duck-egg-blue': '#eaf4fb',
      'water-blue': '#1975d2',
      'water-blue-two': '#0e7dd6',
      'dark-sky-blue': '#2fa7da',
      'dark-sky-blue-two': '#5ea9dd',
      'green-blue': '#02ce92',
      'cornflower-blue': '#7289da',

      'red': '#ff0000',
      'purpley-pink': '#b739cc',

      'border': '#e8ebee',
      'table': '#f7f8f9',
      'duck-egg-text': '#3692d3',
    },
    fontFamily: {
      sans: ['Noto Sans KR', 'Roboto', 'sans-serif'],
    },
    extend: {
      width: {
        '150': '150px',
        '200': '200px',
        '680': '680px',
        'dropdown': `calc(680px/4)`,
        '800': '800px',
      },
      height: {
        'masthead': '200px',
        '224': '224px',
      },
      minHeight: {
        'dropdown': '223px',
        '485': '485px',
        'main': 'calc(100vh - (80px + 276px))',
      },
      fontSize: {
        '16': '16px',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}