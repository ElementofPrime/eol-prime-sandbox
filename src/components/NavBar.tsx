'use client';

import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';
import AuthButton from '@/components/AuthButton';

const nav = [
  { name: 'Home', href: '/' },
  { name: 'Chat', href: '/chat' },
  { name: 'Journal', href: '/journal' },
  { name: 'To-Do', href: '/todo' },
  { name: 'Reminders', href: '/reminders' },
  { name: 'Fix-It', href: '/fixit' },
  { name: 'Core', href: '/core' },
  { name: 'About', href: '/about' },
];

export default function NavBar() {
  return (
    <nav
      className="
        absolute top-0 left-0 right-0 z-30 px-4 py-3
        bg-transparent backdrop-blur-0 shadow-none border-0
        text-inherit
      "
    >
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
              className="
                px-3 py-1 rounded-lg
                bg-zinc-900/90 dark:bg-zinc-800 text-white
                hover:opacity-90 transition
              "
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
