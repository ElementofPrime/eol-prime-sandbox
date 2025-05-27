'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function NavBar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { data: session } = useSession();
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
    { name: 'Core', href: '/core' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav role="navigation" className="w-full sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0b0c0f] px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <Image
            src="/EOL Transparent Logo 500x500 px - Custom dimensions.png"
            alt="Element of Life Logo"
            width={40}
            height={40}
          />
          <span className="text-xl font-bold tracking-wide text-gray-800 dark:text-gray-100">
            Element of Life
          </span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 text-sm font-medium">
          {navButtons.map((btn) => (
            <Link
              key={btn.name}
              href={btn.href}
              className="px-3 py-1.5 rounded-md bg-primary hover:bg-accent text-white transition"
            >
              {btn.name}
            </Link>
          ))}

          {/* Theme Switch */}
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 ml-1 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:scale-105 transition"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          {/* Auth Buttons */}
          {mounted && (
            !session ? (
              <button
                onClick={() => signIn()}
                className="px-4 py-1.5 rounded-lg bg-primary text-white hover:bg-accent transition ml-2"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => signOut()}
                className="px-4 py-1.5 rounded-lg bg-gray-300 dark:bg-gray-600 text-black dark:text-white hover:opacity-90 transition ml-2"
              >
                Sign Out
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
