'use client';

import { useState } from 'react';

export default function FixItPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    const q = input.trim();
    if (!q) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: 'user', content: q },
            {
              role: 'system',
              content:
                'You are Prime, a friendly step-by-step Fix-It guide. Prioritize safety checks, required tools, diagnosis flow, and simple actions first.',
            },
          ],
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', content: data.reply ?? 'Done.' }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Hmm, something went wrong. Try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-6rem)] px-4 pb-24 pt-28 text-slate-100">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-semibold">Prime Fix-It</h1>
        <p className="mt-2 text-slate-300">
          Tell Prime what you&apos;re trying to fix—he&apos;ll walk you through it safely.
        </p>

        <div className="mt-6 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-2xl border border-white/10 p-4 ${
                m.role === 'user' ? 'bg-white/5' : 'bg-cyan-500/10'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          ))}
          {loading && <div className="text-slate-400">Prime is thinking…</div>}
        </div>

        <div className="sticky bottom-6 mt-6 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ex: 1975 Yamaha DT400 flywheel won’t come off…"
              className="flex-1 rounded-xl bg-black/30 px-4 py-3 outline-none"
            />
            <button
              onClick={send}
              disabled={loading}
              className="rounded-xl bg-cyan-600 px-5 py-3 font-medium text-white hover:bg-cyan-500 disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
