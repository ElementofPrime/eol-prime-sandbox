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
    { name: 'Core', href: '/core' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="w-full flex flex-wrap md:flex-row md:justify-between items-center px-4 py-3 bg-baseLight dark:bg-baseDark text-black dark:text-white sticky top-0 z-10">
      <div className="flex items-center gap-3 mb-2 md:mb-0">
        <Image
          src="/EOL Transparent Logo 500x500 px - Custom dimensions.png"
          alt="Element of Life Logo"
          width={40}
          height={40}
        />
        <span className="text-xl font-semibold tracking-wide">Element of Life</span>
      </div>

        <div className="flex flex-col md:flex-row items-center md:gap-4 gap-2 text-sm md:text-base">
        {navButtons.map((btn) => (
          <Link
            key={btn.name}
            href={btn.href}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-accent text-white text-sm md:text-base transition"
          >
            {btn.name}
          </Link>
        ))}

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
    </nav>
  );
}
