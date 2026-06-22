/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef5ff',
          100: '#d9eaff',
          600: '#2457c5',
          700: '#1d469d',
          900: '#142b5f'
        }
      }
    }
  },
  plugins: []
};
