'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function ChatClient() {
  const { data: session } = useSession();
  const isGuest = !session;
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [chatUsed, setChatUsed] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const usage = JSON.parse(localStorage.getItem('primeChat') || '{}');

    if (usage.date !== today) {
      localStorage.setItem('primeChat', JSON.stringify({ date: today, count: 0 }));
      setChatUsed(0);
    } else {
      setChatUsed(usage.count || 0);
    }
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    if (isGuest && chatUsed >= 5) {
      alert('Guest chat limit reached. Sign up to continue your journey with Prime.');
      return;
    }

    setLoading(true);

    try {
      const updated = {
        date: new Date().toLocaleDateString(),
        count: chatUsed + 1,
      };
      localStorage.setItem('primeChat', JSON.stringify(updated));
      setChatUsed(updated.count);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setReply(data.reply);
      setMessage('');
    } catch (err) {
      console.error('Chat error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Talk to Prime</h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask Prime anything..."
        className="w-full border dark:border-zinc-700 rounded p-3 mb-2 bg-zinc-50 dark:bg-zinc-800 text-black dark:text-white"
        rows={3}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className={`w-full px-4 py-2 rounded text-white font-semibold transition ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-accent'
        }`}
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>

      {reply && (
        <div className="mt-4 p-4 bg-gray-100 rounded-xl dark:bg-zinc-800">
          <p className="text-sm font-semibold mb-1 text-brand-accent">Prime says:</p>
          <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{reply}</p>
        </div>
      )}

      {isGuest && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          {5 - chatUsed} guest chats left today.
        </p>
      )}
    </div>
  );
}
