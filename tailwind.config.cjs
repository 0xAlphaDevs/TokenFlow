/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-ibm-mono)'], // font-mono
        display: ['var(--font-helveticaDisplay)'], // font-display
        label: ['var(--font-helveticaMicro)'], // font-label
      },
      spacing: {
        '31px': '31px',
        '42px': '42px',
        '33px': '33px',
        '117px': '117px',
      },
      colors: {
        darken: 'rgba(0, 0, 0, 0.08);',
        'background-dark': '#151517',
        'background-light': '#FFFFFF',
        'cluster-metrics-card-background': '#D2D2D6',
        'theme-switcher-background-light': 'rgba(0, 0, 0, 0.27)',
        'theme-switcher-background-dark': 'rgba(255, 255, 255, 0.27)',
        'json-modal-bg': 'rgba(32, 32, 35, 0.99)',
        'json-modal-buttons-bg': 'rgba(255, 255, 255, 0.12)',
        'json-modal-slash': 'rgba(255, 255, 255, 0.3)',
      },
      textColor: {
        light: '#000',
        dark: '#FFF',
      },
    },
  },
  plugins: [],
}
