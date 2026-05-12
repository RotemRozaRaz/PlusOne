import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blush: '#F5E1DA',
        gold: '#D4AF37',
        ivory: '#FAF7F2',
        champagne: '#F5EDE0',
        slate: {
          DEFAULT: '#4A4A4A',
          800: '#2A2A2A',
          600: '#4A4A4A',
          500: '#6A6A6A',
          400: '#8A8A8A',
          300: '#AAAAAA',
          200: '#CACACA',
          100: '#EEEEEE',
        },
      },
      borderRadius: {
        card: '1.25rem',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.08)',
        'card-lg': '0 8px 40px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}

export default config
