// eslint.config.js
import nextConfig from "eslint-config-next";

export default [
  nextConfig,
  {
    ignores: [
      "node_modules/",
      ".next/",
      "dist/",
      "out/",
      "build/",
      "public/",
      "*.config.{js,ts}",
      "next-env.d.ts",
    ],
  },
];
