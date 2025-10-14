'use client';

import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle'; // your manual toggle
import AuthButton from '@/components/AuthButton';

const nav = [
  { name: 'Home', href: '/' },
  { name: 'Chat', href: '/chat' },
  { name: 'Journal', href: '/journal' },
  { name: 'Tasks', href: '/tasks' },
  { name: 'Reminders', href: '/reminders' },
  { name: 'Fix-It', href: '/fixit' },
  { name: 'Core', href: '/core' },
  { name: 'About', href: '/about' },
  // { name: 'New Beginning', href: '/new-beginning' }, // add when route is ready
];

export default function NavBar() {
  return (
    <nav className="w-full px-4 py-3 sticky top-0 z-10 bg-baseLight dark:bg-baseDark text-black dark:text-">
      <div className="mx-auto max-w-6xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="EOL" width={32} height={32} className="rounded-full" />
          <span className="text-lg font-semibold tracking-wide">Element of Life — Prime OS</span>
        </div>

        {/* Nav + controls */}
        <div className="flex flex-wrap items-center gap-2">
          {nav.map((i) => (
            <Link
              key={i.name}
              href={i.href}
              className="px-3 py-1 rounded-lg bg-zinc-900/90 dark:bg-zinc-800 text-white hover:opacity-90 transition"
            >
              {i.name}
            </Link>
          ))}

          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
