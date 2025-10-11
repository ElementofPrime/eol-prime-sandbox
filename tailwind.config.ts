import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        baseLight: "#f7f9fb",
        baseDark: "#0a1d2e",
      },

      textColor: {
        "muted-foreground": "#6b7280", // zinc-500-ish
      },

      borderColor: {
        accent: "#22d3ee", // cyan-400
      },

      boxShadow: {
        "eol-glow":
          "0 0 28px rgba(34,211,238,.30), 0 0 64px rgba(59,130,246,.18)",
      },

      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1400px",
        },
      },
    },
  },

  plugins: [],
};

export default {
  darkMode: 'class',            // ← IMPORTANT
  content: [
    './src/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',      // if you have any at repo root
  ],
  theme: { extend: {} },
  plugins: [],
} satisfies Config
