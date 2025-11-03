"use client";
import { useEffect, useState } from "react";
import { subscribeToPulse, type Pulse } from "@/lib/prime/pulse";

export default function PrimeAura() {
	const [pulse, setPulse] = useState<Pulse | null>(null);

	useEffect(() => {
		return subscribeToPulse(setPulse);
	}, []);

	if (!pulse) return null;

	const intensity = pulse.glowIntensity;
	const aura = pulse.aura;

	const auraMap = {
		calm: `from-cyan-400/${intensity} via-teal-500/${intensity * 0.6} to-transparent`,
		excited: `from-amber-400/${intensity} via-orange-500/${intensity * 0.6} to-transparent`,
		reflective: `from-sky-400/${intensity} via-blue-500/${intensity * 0.6} to-transparent`,
		stressed: `from-violet-500/${intensity} via-fuchsia-600/${intensity * 0.6} to-transparent`,
	};

	return (
		<div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
			<div
				className={`
          absolute inset-0 bg-linear-to-br ${auraMap[aura]}
          animate-pulse transition-all duration-1000
          blur-3xl opacity-70
        `}
				style={{ animationDuration: `${2 + (1 - intensity) * 3}s` }}
			/>
		</div>
	);
}
