export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        teal: {
          50: '#eef8f6',
          100: '#d3ede8',
          200: '#a9dbd3',
          300: '#75c2b7',
          400: '#45a598',
          500: '#2b8a7e',
          600: '#1f6f66',
          700: '#1c5a53',
          800: '#194844',
          900: '#173c39',
        },
        ink: {
          DEFAULT: '#0f1f2c',
          soft: '#41576a',
          muted: '#728a9c',
        },
        canvas: '#f5f9f8',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,31,44,0.04), 0 8px 24px -12px rgba(15,31,44,0.12)',
        lift: '0 2px 4px rgba(15,31,44,0.05), 0 18px 40px -18px rgba(15,31,44,0.22)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
