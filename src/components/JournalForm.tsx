'use client';

import { useState } from 'react';

export default function JournalForm({ onSuccess }: { onSuccess: () => void }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const submitEntry = async () => {
    if (!content.trim()) return;
    setLoading(true);
    const res = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    setContent('');
    setLoading(false);
    if (res.ok) onSuccess();
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg shadow">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts..."
        rows={4}
        className="w-full p-3 border rounded dark:border-zinc-700 dark:bg-zinc-800 text-black dark:text-white"
      />
      <button
        onClick={submitEntry}
        disabled={loading}
        className={`mt-2 px-4 py-2 rounded text-white font-semibold transition ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-accent'
        }`}
      >
        {loading ? 'Saving...' : 'Save Entry'}
      </button>
    </div>
  );
}
