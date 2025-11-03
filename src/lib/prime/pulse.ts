export type Pulse = {
	mood: "positive" | "neutral" | "negative";
	strength: number; // 0–1
	streak: number;
	trend: "rising" | "falling" | "steady";
	prompt: string;
	aura: "calm" | "excited" | "reflective" | "stressed";
	glowIntensity: number;
};

let currentPulse: Pulse | null = null;
let listeners: ((p: Pulse) => void)[] = [];

export async function getPrimePulse(): Promise<Pulse | null> {
	try {
		const res = await fetch("/api/pulse", { cache: "no-store" });
		const json = await res.json();
		if (!json?.ok || !json.pulse) return currentPulse;

		currentPulse = json.pulse;
		listeners.forEach((l) => l(currentPulse!));
		return currentPulse;
	} catch {
		return currentPulse;
	}
}

export function subscribeToPulse(callback: (p: Pulse) => void) {
	listeners.push(callback);
	if (currentPulse) callback(currentPulse);
	return () => {
		listeners = listeners.filter((l) => l !== callback);
	};
}
