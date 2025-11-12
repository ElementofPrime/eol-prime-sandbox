// /src/app/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PrimePulse from "@/components/PrimePulse"; // Orb glow

export default function Home() {
  const [name, setName] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [pulseHealth, setPulseHealth] = useState(75); // Tie to Tree later

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-fortress-900 to-fortress-800 text-light-gold font-sans">
        {/* Logo + Tagline */}
        <header className="text-center pt-8 pb-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold mb-4"
          >
            Element of Life
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto mb-6"
          >
            Welcome to Element of Life — the foundation where focus becomes
            growth, and growth becomes transformation.
          </motion.p>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-semibold mb-8"
          >
            ## Guiding Tools that help Discover Your Core Elements
          </motion.h2>
        </header>

        {/* Main CTA */}
        <div className="flex flex-col items-center justify-center flex-1 p-8">
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg mb-8 text-center"
          >
            Sign in to see your Prime Pulse.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onClick={() => {
              const user = prompt("What name shall I call you by?");
              if (user) {
                setName(user);
                setAuthenticated(true);
              }
            }}
            className="bg-prime-gold text-fortress-900 px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
          >
            Create Account
          </motion.button>
        </div>

        {/* Divider */}
        <hr className="border-light-gold my-8 mx-auto w-1/2" />

        {/* Tool Grid Preview */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-8 pb-8">
          <motion.div
            className="bg-dark-800 p-6 rounded-lg text-center"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="font-bold mb-2">Journal</h3>
            <p className="text-sm">Reflect & root</p>
          </motion.div>
          <motion.div
            className="bg-dark-800 p-6 rounded-lg text-center"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="font-bold mb-2">Balance</h3>
            <p className="text-sm">Weigh decisions</p>
          </motion.div>
          <motion.div
            className="bg-dark-800 p-6 rounded-lg text-center"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="font-bold mb-2">Reminders</h3>
            <p className="text-sm">Nudge growth</p>
          </motion.div>
          <motion.div
            className="bg-dark-800 p-6 rounded-lg text-center"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="font-bold mb-2">Tree</h3>
            <p className="text-sm">Track legacy</p>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="text-center py-4 text-sm opacity-75">
          © 2025 Element of Life — One sanctuary for all.
        </footer>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-fortress-900 text-light-gold">
      <PrimePulse health={pulseHealth} /> {/* Live glow */}
      <header className="p-4 border-b border-dark-600">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Element of Life</h1>
          <div className="space-x-4">
            <a href="/journal" className="hover:text-prime-gold">
              Journal
            </a>
            <a href="/balance" className="hover:text-prime-gold">
              Balance
            </a>
            <a href="/tree" className="hover:text-prime-gold">
              Tree
            </a>
            <a href="/reminders" className="hover:text-prime-gold">
              Reminders
            </a>
          </div>
        </nav>
      </header>
      <main className="p-8 max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-bold mb-4"
        >
          Welcome back, {name}!
        </motion.h1>
        <p className="text-lg mb-6">
          Last session, we journaled on confidence. Your Tree grew 12%—Prime
          Pulse glows brighter. Ready to nourish it today?
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <a
            href="/journal"
            className="bg-dark-800 p-6 rounded-lg text-center hover:bg-dark-700 transition"
          >
            Journal
          </a>
          <a
            href="/balance"
            className="bg-dark-800 p-6 rounded-lg text-center hover:bg-dark-700 transition"
          >
            Balance
          </a>
          <a
            href="/reminders"
            className="bg-dark-800 p-6 rounded-lg text-center hover:bg-dark-700 transition"
          >
            Reminders
          </a>
          <a
            href="/tree"
            className="bg-dark-800 p-6 rounded-lg text-center hover:bg-dark-700 transition"
          >
            Tree
          </a>
        </div>
      </main>
    </div>
  );
}
