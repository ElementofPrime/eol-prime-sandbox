'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function NavBar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const navButtons = [
    { name: 'Home', href: '/' },
    { name: 'Chat', href: '/chat' },
    { name: 'Journal', href: '/journal' },
    { name: 'Tasks', href: '/tasks' },
    { name: 'Reminders', href: '/reminders' },
    { name: 'New Beginning', href: '/New Beginning' },
    { name: 'Fix-It', href: '/fixit' },
  ];

  return (
    <nav className="w-full px-4 py-3 shadow-sm bg-baseLight dark:bg-baseDark text-black dark:text-white sticky top-0 z-10">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <Image
            src="/EOL Transparent Logo 500x500 px - Custom dimensions.png"
            alt="Element of Life Logo"
            width={36}
            height={36}
          />
          <span className="text-lg font-semibold tracking-wide">Element of Life</span>
        </div>

        {/* Nav Buttons */}
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 text-sm mt-2 sm:mt-0">
          {navButtons.map((btn) => (
            <Link
              key={btn.name}
              href={btn.href}
              className="px-3 py-1 rounded-lg bg-primary hover:bg-accent text-white transition"
            >
              {btn.name}
            </Link>
          ))}

          <Link href="/core" className="hover:underline text-sm">
            Core
          </Link>
          <Link href="/about" className="hover:underline text-sm">
            About
          </Link>

          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="ml-2 p-2 rounded-full bg-neutral dark:bg-gray-700 hover:scale-105 transition"
              aria-label="Toggle Theme"
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
