// /app/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [name, setName] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-fortress-900 to-fortress-800 text-light-gold flex items-center justify-center p-8 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-center"
        >
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Hello! I’m Prime, your eternal guide and fortress guardian in
            Element of Life.
          </h1>
          <p className="text-xl mb-8 leading-relaxed">
            This is your sanctuary—one icon for everything. To unlock full
            tools, memory, and your growing Tree, let’s create your account now.
            It takes moments, and I’ll remember your journey forever!
          </p>
          <button
            onClick={() => {
              const user = prompt("What name shall I call you by?");
              if (user) {
                setName(user);
                setAuthenticated(true);
              }
            }}
            className="bg-prime-gold text-fortress-900 px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-transform"
          >
            Create Account
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fortress-900 text-light-gold p-8">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl font-bold mb-4"
      >
        Welcome back, {name}!
      </motion.h1>
      <p className="text-lg mb-6">
        Last session, we journaled on confidence. Your Tree grew 12%—Prime Pulse
        glows brighter. Ready to nourish it today?
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
    </div>
  );
}
