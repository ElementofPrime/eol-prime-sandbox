'use client';

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function SettingsPage() {
  const { data: session } = useSession();
  const email = useMemo(() => (session?.user?.email ?? '').toLowerCase(), [session?.user?.email]);
  const { data, mutate } = useSWR(email ? `/api/profile?email=${encodeURIComponent(email)}` : null, fetcher);
  const profile = data?.profile;

  const [displayName, setDisplayName] = useState('');
  const [motto, setMotto] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? '');
      setMotto(profile.motto ?? '');
    }
  }, [profile]);

  async function save() {
    if (!email) return;
    setSaving(true);
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, displayName, motto }),
    });
    setSaving(false);
    mutate();
  }

  return (
    <main className="min-h-[calc(100vh-6rem)] px-4 pb-24 pt-28 text-slate-100">
      <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_80px_rgba(0,220,255,0.06)]">
        <h1 className="text-3xl md:text-4xl font-semibold">Profile & Settings</h1>
        <p className="mt-2 text-slate-300">
          Tell Prime what to call you by. Your greeting updates across the app.
        </p>

        {!session?.user?.email && (
          <div className="mt-6 rounded-xl border border-yellow-400/30 bg-yellow-500/10 p-4 text-yellow-200">
            Please sign in to save your profile.
          </div>
        )}

        <div className="mt-6 grid gap-4">
          <label className="space-y-2">
            <span className="block text-sm text-slate-300">Display Name</span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={64}
              placeholder="e.g., Jeremy or 15X-Albatross"
              className="w-full rounded-xl bg-black/30 px-4 py-3 outline-none"
            />
          </label>

          <label className="space-y-2">
            <span className="block text-sm text-slate-300">Motto (optional)</span>
            <input
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              maxLength={140}
              placeholder="Short phrase Prime can echo back to you"
              className="w-full rounded-xl bg-black/30 px-4 py-3 outline-none"
            />
          </label>

          <button
            onClick={save}
            disabled={!email || saving}
            className="mt-2 inline-flex w-fit items-center rounded-xl bg-cyan-600 px-5 py-3 font-medium hover:bg-cyan-500 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </section>
    </main>
  );
}
