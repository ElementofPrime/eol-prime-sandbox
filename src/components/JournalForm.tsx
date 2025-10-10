'use client';

import { useState } from 'react';

type Props = {
  onSuccess?: () => void;
};

export default function JournalForm({ onSuccess }: Props) {
  const [entry, setEntry] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    try {
      // TODO: replace with a real POST to /api/journal
      await new Promise((r) => setTimeout(r, 800));
      onSuccess?.();       // safe optional call
      setEntry('');
      setStatus('saved');
    } catch (e) {
      console.error(e);
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 rounded-2xl bg-neutral-900/60 border border-neutral-700 shadow-lg backdrop-blur-md">
      <h2 className="text-2xl font-semibold text-center mb-4 text-white">Journal Entry</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="What’s on your mind today?"
          rows={6}
          className="p-3 rounded-lg bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
          required
        />
        <button
          type="submit"
          disabled={status === 'saving'}
          className={`py-2 px-4 rounded-lg font-medium transition ${
            status === 'saving' ? 'bg-gray-500 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500'
          }`}
        >
          {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved!' : 'Save Entry'}
        </button>
      </form>
    </div>
  );
}
