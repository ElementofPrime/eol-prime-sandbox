'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) {
    return <button className="eol-btn">Send</button>;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn()} // generic -> NextAuth provider screen
        className="px-3 py-1 rounded-xl bg-cyan-600 text-slate-300 hover:bg-cyan-500 transition"
      >
        Sign In
      </button>
    );
  }

  return (
    <button
      onClick={() => signOut()}
      className="px-3 py-1 rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:opacity-90 transition"
      title={session.user?.email ?? 'Signed in'}
    >
      Sign Out
    </button>
  );
}
