/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neo: {
          yellow: '#FFE600',
          red: '#FF385C',
          blue: '#1E40AF',
          cobalt: '#2563EB',
          cyan: '#00F0FF',
          green: '#00D664',
          bg: '#FBF9F1',
          card: '#FFFFFF',
          darkBg: '#0D0F14',
          darkCard: '#181B24',
          darkBorder: '#FFE600',
          black: '#000000',
          border: '#000000',
        },
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px 0px #000000',
        'neo': '4px 4px 0px 0px #000000',
        'neo-lg': '6px 6px 0px 0px #000000',
        'neo-xl': '8px 8px 0px 0px #000000',
        'neo-yellow': '4px 4px 0px 0px #FFE600',
        'neo-yellow-lg': '6px 6px 0px 0px #FFE600',
        'neo-red': '4px 4px 0px 0px #FF385C',
        'neo-blue': '4px 4px 0px 0px #2563EB',
        'neo-green': '4px 4px 0px 0px #00D664',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        display: ['Space Grotesk', 'Impact', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

// Neo-brutalist custom color palette configured
