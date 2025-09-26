const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'go2skul-green': {
          DEFAULT: '#00C49A',
          '50': '#E6F9F5',
          '100': '#BFF3E5',
          '200': '#99EDD5',
          '300': '#72E7C5',
          '400': '#4CE1B5',
          '500': '#00C49A',
          '600': '#00B08A',
          '700': '#009C7A',
          '800': '#00886A',
          '900': '#00745A',
        },
        'go2skul-blue': {
          DEFAULT: '#3B82F6',
          '50': '#EFF6FF',
          '100': '#DBEAFE',
          '200': '#BFDBFE',
          '300': '#93C5FD',
          '400': '#60A5FA',
          '500': '#3B82F6',
          '600': '#2563EB',
          '700': '#1D4ED8',
          '800': '#1E40AF',
          '900': '#1E3A8A',
        },
        'go2skul-gold': {
          DEFAULT: '#FFC72C',
          '50': '#FFF9E5',
          '100': '#FFF2CC',
          '200': '#FFE699',
          '300': '#FFD966',
          '400': '#FFCC33',
          '500': '#FFC72C',
          '600': '#E6B328',
          '700': '#CC9F23',
          '800': '#B38B1F',
          '900': '#99771A',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
