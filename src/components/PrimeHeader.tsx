"use client";
import { useEffect, useState } from "react";
import { subscribeToPulse } from "@/lib/prime/pulse";

export default function PrimeHeader() {
	const [glow, setGlow] = useState(0.1);

	useEffect(() => {
		return subscribeToPulse((p) => {
			setGlow(p.glowIntensity);
		});
	}, []);

	return (
		<header className="flex items-center gap-3 px-6 py-4">
			<div
				className="w-10 h-10 rounded-xl relative overflow-hidden"
				style={{
					background: `radial-gradient(circle at 30% 30%, rgba(56,224,255,${0.6 + glow * 0.4}), rgba(212,221,229,${0.3 + glow * 0.2}))`,
					boxShadow: `0 0 ${20 + glow * 60}px rgba(56,189,248,${0.15 + glow * 0.25})`,
					transition: "all 0.8s ease",
				}}
			>
				<div className="absolute inset-0 bg-white/20 animate-pulse" />
			</div>
			<h1
				className="text-xl font-bold bg-linear-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent"
				style={{
					filter: `drop-shadow(0 0 ${4 + glow * 8}px rgba(56,189,248,0.6))`,
				}}
			>
				EOL—Prime
			</h1>
		</header>
	);
}
