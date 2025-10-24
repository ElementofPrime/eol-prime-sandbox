module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    // your overrides here if needed
    "no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "off",
  },
};
