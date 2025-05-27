import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      colors: {
        primary: '#3b7a57',
        accent: '#255c45',
        'brand-dark': '#1e1e1e',
        'brand-accent': '#4ade80',
      },
    },
  },
  plugins: [],
};

export default config;
