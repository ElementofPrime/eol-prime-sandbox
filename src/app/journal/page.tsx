'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import JournalForm from '@/components/JournalForm';

type Entry = {
  _id: string;
  content: string;
  date: string;
};

export default function JournalPage() {
  const [sessionAvailable, setSessionAvailable] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const mod = await import('next-auth/react');
      const { data: session } = mod.useSession();
      if (session) {
        setSessionAvailable(true);
        fetchEntries();
      }
    };
    checkSession();
  }, []);

  const fetchEntries = async () => {
    const res = await fetch('/api/journal');
    const data = await res.json();
    setEntries(data.entries || []);
    setLoading(false);
  };

  if (!sessionAvailable) {
    return (
      <div className="p-6 text-center text-gray-500">
        Please sign in to view your journal.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">My Journal</h1>

      <JournalForm onSuccess={fetchEntries} />

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading entries...</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-gray-500">No journal entries yet.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry._id} className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500 mb-2">{entry.date}</p>
              <p className="text-gray-800 dark:text-white whitespace-pre-line">{entry.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
