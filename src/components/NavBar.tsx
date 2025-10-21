'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Chat', href: '/chat' },
  { name: 'Journal', href: '/journal' },
  { name: 'To-Do', href: '/todo' },
  { name: 'Reminders', href: '/reminders' },
  { name: 'Fix-It', href: '/fix-it' },
  { name: 'Core', href: '/core' },
  { name: 'About', href: '/about' },
];

export default function NavBar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur bg-black/20">
      <nav className="mx-auto max-w-6xl px-3 sm:px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide">Element of Life — Prime OS</Link>

        <ul className="hidden md:flex gap-2">
          {LINKS.map(l => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`rounded-full px-3 py-1 text-sm ${
                    active ? 'bg-white/15' : 'bg-white/5 hover:bg-white/10'
                  } border border-white/10`}
                >
                  {l.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {status === 'loading' ? (
            <span className="text-xs opacity-70">…</span>
          ) : session?.user ? (
            <button
              onClick={() => signOut()}
              className="rounded-full px-3 py-1 text-sm bg-white/10 hover:bg-white/15 border border-white/15"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn()} // opens email sign-in
              className="rounded-full px-3 py-1 text-sm bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
