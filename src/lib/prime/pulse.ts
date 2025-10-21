export type Pulse = {
  mood: 'positive' | 'neutral' | 'negative';
  prompt: string;
};

export async function getPrimePulse(): Promise<Pulse | null> {
  try {
    const res = await fetch('/api/pulse', { cache: 'no-store' });
    const json = await res.json();
    if (!json?.ok) return null;
    return { mood: json.mood, prompt: json.prompt };
  } catch {
    return null;
  }
}
