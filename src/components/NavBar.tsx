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
      {/* Center the nav group perfectly, independent of left/right widths */}
      <nav className="mx-auto w-full max-w-6xl px-4 py-4
                      grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* LEFT (brand) */}
        <div className="min-w-0">
          <Link
            href="/"
            className="block truncate font-semibold tracking-wide text-cyan-300 hover:text-cyan-200"
            title="Element of Life — Prime Labs OS"
          >
            Element of Life — Prim Labs OS
          </Link>
        </div>

        {/* CENTER (pills) — always centered */}
        <div className="hidden sm:flex items-center gap-2">
          <Pill href="/">Home</Pill>
          <Pill href="/chat">Chat</Pill>
          <Pill href="/journal">Journal</Pill>
          <Pill href="/todo">To-Do</Pill>
          <Pill href="/reminders">Reminders</Pill>
          <Pill href="/fix-it">Fix-It</Pill>
          <Pill href="/core">Core</Pill>
          <Pill href="/about">About</Pill>
        </div>

        {/* RIGHT (theme + auth) — right-aligned */}
        <div className="flex items-center justify-end gap-3">
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
