import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-manrope)', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#497E38',
          dark: '#052e16',
          deep: '#0a351f',
          surface: '#f3f6f4',
          light: '#86efac',
        },
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at 10% 10%, #1e5e3f 0%, #0a351f 45%, #021a0f 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
