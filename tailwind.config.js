/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        temet: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        dashboard: {
          dark: '#0f172a',
          card: '#1e293b',
          accentPink: '#f43f5e',
          accentCyan: '#06b6d4',
          accentBlue: '#3b82f6',
        }
      }
    },
  },
  plugins: [],
}
