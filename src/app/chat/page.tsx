'use client';

import * as React from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function ChatPage() {
  const [sessionAvailable, setSessionAvailable] = React.useState(false);
  const [chatUsed, setChatUsed] = React.useState(0);
  const [message, setMessage] = React.useState('');
  const [reply, setReply] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const today = new Date().toLocaleDateString();
    const usage = JSON.parse(localStorage.getItem('primeChat') || '{}');
    if (usage.date !== today) {
      localStorage.setItem('primeChat', JSON.stringify({ date: today, count: 0 }));
      setChatUsed(0);
    } else {
      setChatUsed(usage.count || 0);
    }
  }, []);

  React.useEffect(() => {
    // Make sure useSession is invoked ONLY client-side
    const checkSession = async () => {
      const mod = await import('next-auth/react');
      const { data: session } = mod.useSession();
      if (session) {
        setSessionAvailable(true);
      }
    };
    checkSession();
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    if (!sessionAvailable && chatUsed >= 5) {
      alert('You’ve hit your 5 daily guest chats. Sign in to continue.');
      return;
    }

    const updated = {
      date: new Date().toLocaleDateString(),
      count: chatUsed + 1,
    };
    localStorage.setItem('primeChat', JSON.stringify(updated));
    setChatUsed(updated.count);

    setLoading(true);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setReply(data.reply);
    setMessage('');
    setLoading(false);
  };

  return (
    <main className="min-h-screen px-6 py-12 bg-white dark:bg-zinc-900 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">💬 Chat with Prime</h1>

      {!sessionAvailable && (
        <div className="bg-yellow-100 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 p-4 rounded-xl mb-4">
          You’re chatting as a guest. Only 5 messages per day allowed.
          <br />
          <span className="text-sm">Chats left today: {5 - chatUsed}</span>
          <div className="mt-3">
            <button
              onClick={() => signIn()}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            >
              Sign in for Unlimited Chat
            </button>
          </div>
        </div>
      )}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder="Ask Prime anything..."
        className="w-full p-4 mb-4 border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-xl"
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send to Prime'}
      </button>

      {reply && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-xl text-blue-800 dark:text-blue-100">
          <p className="font-semibold mb-2">Prime replies:</p>
          <p>{reply}</p>
        </div>
      )}
    </main>
  );
}
