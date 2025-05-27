import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
