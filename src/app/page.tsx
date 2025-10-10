'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import BackgroundDecor from '@/components/BackgroundDecor';

const elements = [
  { title: 'Chat', icon: '💬', link: '/chat' },
  { title: 'Journal', icon: '📔', link: '/journal' },
  { title: 'Tasks', icon: '✅', link: '/tasks' },
  { title: 'Reminders', icon: '⏰', link: '/reminders' },
  { title: 'Fix-It', icon: '🛠️', link: '/fixit' },
  { title: 'New Beginning', icon: '🧠', link: '/new-beginning' }, // keep tile; route added below
  { title: 'Core', icon: '🌿', link: '/core' },
  { title: 'About', icon: '✨', link: '/about' },
];

export default function Home() {
  return (
    <div className="relative w-full max-w-6xl mx-auto text-center">
      {/* background decorations under everything */}
       <BackgroundDecor />

      {/* logo with one-time arrive (big->normal) + soft glow */}
      <motion.img
        src="/logo.png"
        alt="Element of Life Logo"
        className="mx-auto w-40 sm:w-52 md:w-60 h-auto mb-4 eol-glow"
        initial={{ opacity: 0, scale: 1.12 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />

      {/* Welcome (first line under logo) */}
      <motion.p
        className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Welcome to Element of Life — crafted to keep you focused, empower growth, and guide you toward
        discovering life’s essential elements.
      </motion.p>

      {/* You Weren’t… (artistic, flowing) */}
      <motion.h1
        className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold mb-6"
        style={{ fontFamily: 'var(--font-greatvibes), cursive' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        You Weren’t Meant to Do This Alone
      </motion.h1>

      {/* Section title above grid */}
      <motion.h2
        className="text-base sm:text-lg md:text-xl font-semibold text-cyan-500 mb-5 md:mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.45 }}
      >
        Guiding Tools to Discover Your Core Elements
      </motion.h2>
 
      {/* Elements grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {elements.map((el) => (
          <Link key={el.title} href={el.link}>
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="bg-zinc-900/90 dark:bg-zinc-800 text-white rounded-2xl shadow-lg p-5 text-center ring-1 ring-black/5 dark:ring-white/5"
            >
              <div className="text-2xl sm:text-3xl mb-2">{el.icon}</div>
              <h3 className="text-sm sm:text-base font-semibold">{el.title}</h3>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
