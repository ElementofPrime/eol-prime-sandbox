import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
     colors: {
      primary: '#3b7a57', // Forest green
      accent: '#f5b841',  // Warm gold
      baseLight: '#fafafa',
      baseDark: '#0b0c0f',
      muted: '#6b7280',
    },
     fontFamily: {
     sans: ['Inter', 'Arial', 'sans-serif'],
    },
   },
  },
  plugins: [],
};

export default config;
