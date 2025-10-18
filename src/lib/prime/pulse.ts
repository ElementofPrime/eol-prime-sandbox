export type Pulse = {
  mood: 'positive' | 'neutral' | 'negative';
  prompt: string;
};

export async function getPrimePulse(): Promise<Pulse | null> {
  try {
    const list = await fetch('/api/journal', { cache: 'no-store' });
    const { items } = await list.json();
    const latest = items?.[0];
    if (!latest?._id) return null;

    const ires = await fetch(`/api/journal/${latest._id}/insights`, { cache: 'no-store' });
    const { insight } = await ires.json();
    if (!insight) return null;

    return {
      mood: insight.mood ?? 'neutral',
      prompt: insight.primePrompts?.[0] || 'What matters most right now?',
    };
  } catch {
    return null;
  }
}
