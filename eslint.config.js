import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import next from 'eslint-config-next';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default [
  ...next,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**',
      'dist/**',
      'coverage/**',
      'next-env.d.ts',
      '.next/types/**',
    ],
    rules: {
      // So TS comments don’t explode while we iterate
      '@typescript-eslint/ban-ts-comment': 'off',

      // Allow temporary any while we wire APIs; we’ll tighten later
      '@typescript-eslint/no-explicit-any': 'off',

      // Underscore convention for intentional unused vars
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],

      // Some generated helpers use {} — don’t block builds
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/triple-slash-reference': 'off'
    },
  },
];