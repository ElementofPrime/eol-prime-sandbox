// components/TreeOfLife.tsx
"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Insight {
  mood: string;
  clarity_score: number;
}

export default function TreeOfLife() {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/pulse")
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setInsight(data.insight || { mood: "neutral", clarity_score: 5 });
        setError(false);
      })
      .catch(() => {
        setInsight({ mood: "demo", clarity_score: 3 });
        setError(true);
      });
  }, []);

  // DEFAULT VALUES IF NULL
  const safeInsight = insight || { mood: "demo", clarity_score: 3 };
  const trunkHeight = 100 + safeInsight.clarity_score * 15;
  const branches = Math.floor(safeInsight.clarity_score / 2);

  return (
    <div className="relative h-96 w-full overflow-hidden">
      {/* Trunk */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-8 -translate-x-1/2 bg-amber-800"
        style={{ height: trunkHeight }}
        initial={{ height: 100 }}
        animate={{ height: trunkHeight }}
        transition={{ duration: 1 }}
      />
      {/* Branches */}
      {Array.from({ length: branches }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 bg-green-700 origin-bottom-left"
          style={{
            left: "50%",
            bottom: 100 + i * 40,
            height: 60,
            transform: `rotate(${i % 2 === 0 ? -45 : 45}deg)`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.2 }}
        />
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-center">
        <p>Mood: {safeInsight.mood}</p>
        <p>Clarity: {safeInsight.clarity_score}/10</p>
        {error && (
          <p className="text-red-500 text-xs mt-1">Sign in for full Pulse</p>
        )}
      </div>
    </div>
  );
}
