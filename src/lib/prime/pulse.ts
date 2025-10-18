export type Pulse = {
mood: 'positive'|'neutral'|'negative';
prompt: string;
};


export async function getPrimePulse(): Promise<Pulse | null> {
try {
const res = await fetch('/api/journal');
const { items } = await res.json();
const latest = items?.[0];
if (!latest) return null;
const ires = await fetch(`/api/journal/${latest._id}/insights`);
const { insight } = await ires.json();
if (!insight) return null;
const prompt = insight.primePrompts?.[0] || 'What matters most right now?';
return { mood: insight.mood, prompt };
} catch { return null; }
}