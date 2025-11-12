// eslint.config.js
import js from "@eslint/js";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import next from "eslint-plugin-next";

export default [
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  react.configs.recommended,
  reactHooks.configs.recommended,
  next.configs.recommended, // ← FIXED
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      "@typescript-eslint": tsEslint,
      react,
      "react-hooks": reactHooks,
      next,
    },
    languageOptions: {
      parser: tsParser,
      ecmaFeatures: { jsx: true },
      sourceType: "module",
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "@next/next/no-server-import-in-page": "error",
      "next/no-server-import-in-page": "error",
    },
  },
];
