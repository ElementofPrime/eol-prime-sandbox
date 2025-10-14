'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const elements = [
  { title: 'Chat', icon: '💬', link: '/chat' },
  { title: 'Journal', icon: '📔', link: '/journal' },
  { title: 'Tasks', icon: '✅', link: '/tasks' },
  { title: 'Reminders', icon: '⏰', link: '/reminders' },
  { title: 'Fix-It', icon: '🛠️', link: '/fixit' },
  { title: 'New Beginning', icon: '🧠', link: '/new-beginning' },
  { title: 'Core', icon: '🌿', link: '/core' },
  { title: 'About', icon: '✨', link: '/about' },
];

export default function Home() {
  return (
    <div className="relative mx-auto max-w-6xl w-full text-center overflow-hidden flex flex-col items-center">
      {/* Logo focus */}
      <motion.div
        className="relative mx-auto mb-8 w-40 sm:w-52 md:w-60 eol-breathe"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        {/* beams */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 blur-2xl eol-ambient"
          aria-hidden
          style={{ background: 'radial-gradient(60% 60% at 50% 45%, rgba(59,130,246,.35), rgba(34,211,238,.18) 45%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10 blur-2xl hidden dark:block eol-ambient"
          aria-hidden
          style={{ background: 'radial-gradient(60% 60% at 50% 45%, rgba(129,230,217,.25), rgba(34,197,94,.20) 45%, transparent 70%)' }}
        />
        <Image
          src="/logo.png"
          alt="Element of Life Logo"
          width={480}
          height={480}
          priority
          className="w-full h-auto rounded-full select-none eol-glow eol-glow-transition"
          draggable={false}
        />
      </motion.div>

      {/* Mantra */}
      <motion.p
        className="text-base sm:text-lg md:text-xl text-zinc-700 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed px-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <span className="font-medium text-zinc-800 dark:text-zinc-200">Welcome to Element of Life —</span>{' '}
        the foundation where <span className="text-cyan-500 dark:text-cyan-400">focus</span> becomes growth, and growth becomes transformation.
      </motion.p>

      <motion.h2
        className="text-sm sm:text-base md:text-lg font-semibold text-cyan-500 mt-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Guiding Tools to Discover Your Core Elements
      </motion.h2>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 px-3 pb-12">
        {elements.map((el) => (
          <Link key={el.title} href={el.link}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl shadow-lg p-5 text-center ring-1 ring-black/5 dark:ring-white/5
                         bg-slate-900/45 dark:bg-slate-900/40 backdrop-blur"
            >
              <div className="text-2xl sm:text-3xl mb-2">{el.icon}</div>
              <h3 className="text-sm sm:text-base font-semibold text-white">{el.title}</h3>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
