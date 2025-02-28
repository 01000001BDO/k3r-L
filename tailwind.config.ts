import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-playfair)', 'var(--font-montserrat)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        display: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-montserrat)', 'sans-serif'],
      },
      colors: {
        'boulangerie': {
          50: '#FDF8F3',
          100: '#F9EEE2',
          200: '#F2DCC3',
          300: '#E8C396',
          400: '#DEAB69',
          500: '#D4933D',
          600: '#B77B2A',
          700: '#8A5D20',
          800: '#5C3E15',
          900: '#2E1F0B',
        },
      },
    },
  },
  plugins: [],
};

export default config;