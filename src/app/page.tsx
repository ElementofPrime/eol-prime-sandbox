'use client';

import Image from 'next/image';
import Link from 'next/link';
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
    <div className="relative w-full max-w-6xl mx-auto text-center">
      {/* Background Decorations */}
      <Image
        src="/vines.svg.png"
        alt="Decorative vines"
        width={220}
        height={220}
        className="absolute top-0 left-0 opacity-10 dark:opacity-20 pointer-events-none select-none"
      />
      <Image
        src="/tree.svg.png"
        alt="Decorative tree"
        width={220}
        height={220}
        className="absolute bottom-0 right-0 opacity-10 dark:opacity-20 pointer-events-none select-none"
      />

      {/* Logo + Hero */}
      <motion.img
        src="/logo.png"
        alt="Element of Life Logo"
        className="mx-auto w-48 sm:w-56 md:w-64 h-auto mb-6 mt-4"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      />

      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        You Weren’t Meant to Do This Alone
      </motion.h1>

      <motion.p
        className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Welcome to Element of Life — crafted to keep you focused, empower growth, and guide you toward discovering life’s essential elements.
      </motion.p>

      <motion.h2
        className="text-lg sm:text-xl font-semibold text-cyan-400 mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        Guiding Tools to Discover Your Core Elements
      </motion.h2>

      {/* Grid of Elements */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {elements.map((el, i) => (
          <Link key={i} href={el.link}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl shadow-md p-5 text-center hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="text-3xl mb-2">{el.icon}</div>
              <h3 className="text-base font-semibold mb-1">{el.title}</h3>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
