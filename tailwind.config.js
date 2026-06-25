/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF1DA',
        mint: '#8FD9B6',
        sky: '#A9D8F0',
        rose: '#F4C3D0',
        peach: '#F4A87C',
        yellow: '#F7D26A',
        lavender: '#CDBCEC',
        ink: '#3A2E2A',
        outline: '#1C1410',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'Fredoka', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '24px',
      },
      boxShadow: {
        hard: '4px 4px 0 0 #1C1410',
        'hard-sm': '2px 2px 0 0 #1C1410',
        'hard-lg': '6px 6px 0 0 #1C1410',
      },
      borderWidth: {
        2.5: '2.5px',
      },
    },
  },
  plugins: [],
}
