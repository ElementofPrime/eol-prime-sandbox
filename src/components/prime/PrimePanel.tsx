'use client';

import { useEffect, useState } from 'react';

export default function PrimePanel({ userId }: { userId: string }) {
  const [lastReply, setLastReply] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/memory/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setLastReply(data.lastReply || '');
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p className="text-sm text-gray-500 mb-4">Prime is thinking...</p>;

  return (
    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl shadow-md mb-6">
      <h2 className="text-lg font-semibold text-brand-accent mb-1">Welcome back 👋</h2>
      <p className="text-sm text-gray-700 dark:text-gray-200">
        Last time you said: <em>{lastReply || 'Nothing yet, let’s get started!'}</em>
      </p>
      <p className="mt-2 text-sm">
        Would you like to continue from where we left off or start fresh today?
      </p>
    </div>
  );
}
