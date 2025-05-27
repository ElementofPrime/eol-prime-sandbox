import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5b4eff',
        accent: '#a78bfa',
        baseLight: '#f3f4f6',
        baseDark: '#1f2937',
        neutral: '#9ca3af',
      },
    },
  },
  plugins: [],
};

export default config;
