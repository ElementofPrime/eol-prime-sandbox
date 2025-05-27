'use client'; 

import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';

type ChatEntry = { message: string; reply: string };

export default function PrimeChat() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const [guestUses, setGuestUses] = useState(0);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatEntry[]>([]);
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = Number(localStorage.getItem('guestUses') || '0');
    setGuestUses(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('guestUses', guestUses.toString());
  }, [guestUses]);

  const handleSend = async () => {
    if (!message.trim()) return;

    if (!isLoggedIn && guestUses >= 3) {
      alert('Sign in to continue your journey with Prime.');
      return;
    }

    try {
      const res = await fetch('/api/chat-prime', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

      if (!res.ok) {
        const text = await res.text();
        console.error(`Chat API error: ${res.status}`, text);
        setError(`Prime hit a snag (code ${res.status}). Try again soon.`);
        return;
      }

      const data = await res.json();
      const reply = data.reply;
      setReply(reply);
      setHistory([...history, { message, reply }]);
      setMessage('');

      if (!isLoggedIn) {
        setGuestUses((prev) => prev + 1);
      }

      const lower = reply.toLowerCase();
      if (isLoggedIn) {
        if (lower.includes('added to your journal')) {
          await fetch('/api/memory/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'journal', data: message }),
          });
        }

        if (lower.includes('marked your goal')) {
          await fetch('/api/memory/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'goal', data: message }),
          });
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Prime is having trouble responding. Please try again shortly.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Talk with Prime</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
        {history.map((h, i) => (
          <div key={i} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded">
            <p className="text-sm text-gray-700 dark:text-gray-200"><strong>You:</strong> {h.message}</p>
            <p className="text-sm text-brand-accent"><strong>Prime:</strong> {h.reply}</p>
          </div>
        ))}
      </div>

      <textarea
        className="w-full border dark:border-zinc-700 rounded p-2 mb-2 bg-zinc-50 dark:bg-zinc-800"
        rows={3}
        placeholder="Ask Prime anything..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {!isLoggedIn && guestUses >= 3 ? (
        <button
          onClick={() => signIn()}
          className="w-full bg-brand-accent text-white p-2 rounded font-semibold"
        >
          Sign in to unlock full access to Prime
        </button>
      ) : (
        <button
          onClick={handleSend}
          className="w-full bg-brand-dark text-white p-2 rounded font-semibold"
        >
          Send to Prime
        </button>
      )}
    </div>
  );
}
