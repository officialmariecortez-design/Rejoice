/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14120F',
        ink2: '#1D1A15',
        porcelain: '#F3EEE6',
        brass: '#C9A227',
        brassdim: '#8A701F',
        signal: '#C1442D',
        slate: '#4B5259',
        fog: '#8B8478',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
    },
  },
  plugins: [],
}
