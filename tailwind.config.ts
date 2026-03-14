import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        noir: '#111111',
        parchment: '#F8F6F2'
      },
      boxShadow: {
        luxe: '0 10px 30px rgba(17, 17, 17, 0.15)'
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F3D77A 45%, #B78A14 100%)'
      }
    }
  },
  plugins: []
};

export default config;
