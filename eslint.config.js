import js from "@eslint/js";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import next from "eslint-plugin-next";

// Export the ESLint configuration array
export default [
  // JavaScript recommended rules
  js.configs.recommended,
  // TypeScript recommended rules
  ...tsEslint.configs.recommended,
  // React recommended rules
  react.configs.recommended,
  // React Hooks recommended rules
  reactHooks.configs.recommended,
  // Next.js recommended rules
  next.configs.recommended,
  {
    // Apply these settings to all JS/TS files
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
      // Enforce rules of hooks for React
      "react-hooks/rules-of-hooks": "error",
      // Prevent server-side imports in Next.js pages
      "@next/next/no-server-import-in-page": "error",
      "next/no-server-import-in-page": "error",
    },
  },
];
