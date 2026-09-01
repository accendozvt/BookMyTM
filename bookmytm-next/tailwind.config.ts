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
          // Deepened from #497E38 so small text (eyebrow labels, links) on light
          // surfaces clears WCAG AA 4.5:1 contrast — the old value sat right at ~4.5.
          DEFAULT: '#3d6f2e',
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
