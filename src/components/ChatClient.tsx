'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function ChatClient() {
  const { data: session } = useSession();
  const isGuest = !session;
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [chatUsed, setChatUsed] = useState(0);

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
    const data = await res.json();
    setReply(data.reply);
    setMessage('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">Talk to Prime</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask Prime anything..."
        className="w-full border p-3 rounded-lg mb-2"
      />
      <button
        onClick={handleSend}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Send Message
      </button>
      {reply && (
        <div className="mt-4 p-4 bg-gray-100 rounded-xl dark:bg-zinc-800">
          <p className="text-sm font-semibold mb-1 text-brand-accent">Prime says:</p>
          <p className="text-gray-800 dark:text-white">{reply}</p>
        </div>
      )}
      {isGuest && <p className="text-sm text-gray-500 mt-2">{5 - chatUsed} guest chats left today.</p>}
    </div>
  );
}
