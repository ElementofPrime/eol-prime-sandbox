// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {}, // ← v4 REQUIRES THIS
    autoprefixer: {},
  },
};
