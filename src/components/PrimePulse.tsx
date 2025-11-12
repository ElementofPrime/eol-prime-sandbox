// /src/components/PrimePulse.tsx
"use client";

import { motion } from "framer-motion";

export default function PrimePulse({ health = 75 }: { health: number }) {
  return (
    <div className="fixed top-4 right-4 w-16 h-16">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-full h-full rounded-full bg-prime-gold opacity-80 shadow-lg"
        style={{
          boxShadow: `0 0 ${health}px ${health / 3}px rgba(255, 215, 0, 0.6)`,
        }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-fortress-900 font-bold text-sm">
        {health}%
      </span>
    </div>
  );
}
