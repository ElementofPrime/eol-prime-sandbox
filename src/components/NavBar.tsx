'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import useSWR from 'swr';
import { useMemo } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

const fetcher = (url: string) => fetch(url).then(r => r.json());

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full bg-white/5 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10 border border-white/10"
    >
      {children}
    </Link>
  );
}

export default function NavBar() {
  const { data: session } = useSession();
  const email = useMemo(() => (session?.user?.email ?? '').toLowerCase(), [session?.user?.email]);
  const { data } = useSWR(email ? `/api/profile?email=${encodeURIComponent(email)}` : null, fetcher);
  const displayName = data?.profile?.displayName as string | undefined;

  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* left */}
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold tracking-wide text-cyan-300 hover:text-cyan-200">
            Element of Life — Prime OS
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <Pill href="/">Home</Pill>
            <Pill href="/chat">Chat</Pill>
            <Pill href="/journal">Journal</Pill>
            <Pill href="/todo">To-Do</Pill>{/* <-- canonical path */}
            <Pill href="/reminders">Reminders</Pill>
            <Pill href="/fix-it">Fix-It</Pill>
            <Pill href="/core">Core</Pill>
            <Pill href="/about">About</Pill>
          </div>
        </div>

        {/* right */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {displayName && (
            <Link
              href="/settings"
              className="hidden sm:inline rounded-full border border-cyan-400/40 px-3 py-1.5 text-cyan-300 hover:bg-cyan-400/10"
              title="Edit profile"
            >
              Welcome back, {displayName}
            </Link>
          )}
          {!session ? (
            <button
              onClick={() => signIn()}
              className="rounded-full bg-cyan-600 px-4 py-1.5 text-sm text-white hover:bg-cyan-500"
            >
              Sign In
            </button>
          ) : (
            <>
              <Pill href="/settings">Settings</Pill>
              <button
                onClick={() => signOut()}
                className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/20 border border-white/10"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
