// eslint.config.js
import js from "@eslint/js";
import tsEslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "eslint-plugin-next";

export default [
  // Base configs
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  react.configs.recommended,
  reactHooks.configs.recommended,
  nextPlugin.configs.recommended,
  nextPlugin.configs["core-web-vitals"],

  // Custom config
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: [
      "node_modules/",
      ".next/",
      "dist/",
      "out/",
      "build/",
      "public/",
      "*.config.js",
      "next-env.d.ts",
    ],
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json",
      },
      globals: {
        React: "writable",
      },
    },
    plugins: {
      "@typescript-eslint": tsEslint.plugin,
      react,
      "react-hooks": reactHooks,
      "@next/next": nextPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-server-import-in-page": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "warn",
    },
    settings: {
      react: { version: "detect" },
    },
  },
];
