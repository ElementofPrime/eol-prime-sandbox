// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: "class",
	content: [
		"./src/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./pages/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				baseLight: "#f7f9fb",
				baseDark: "#0a1d2e",
			},
			boxShadow: {
				"eol-glow":
					"0 0 28px rgba(34,211,238,.30), 0 0 64px rgba(59,130,246,.18)",
			},
			animation: {
				ping: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
			},
			keyframes: {
				ping: {
					"75%, 100%": { transform: "scale(2)", opacity: "0" },
				},
			},
		},
	},
	plugins: [],
};

export default config;
