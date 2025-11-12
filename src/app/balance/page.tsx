// /app/balance/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Balance() {
  const [pros, setPros] = useState([""]);
  const [cons, setCons] = useState([""]);
  const [decision, setDecision] = useState("");

  const proScore = pros.filter((p) => p.trim()).length * 15;
  const conScore = cons.filter((c) => c.trim()).length * 15;
  const tilt = proScore - conScore;

  return (
    <div className="min-h-screen bg-fortress-900 text-light-gold p-8">
      <h1 className="text-4xl font-bold text-center mb-10">
        Balance & Decisions
      </h1>

      <motion.div
        animate={{ rotate: tilt / 8 }}
        transition={{ type: "spring", stiffness: 60 }}
        className="w-80 h-80 mx-auto relative"
        style={{ perspective: 1000 }}
      >
        <div className="absolute inset-0 bg-[url('/scale.png')] bg-cover" />{" "}
        {/* Add asset later */}
        <div className="absolute left-8 top-1/2 w-32 h-20 bg-linear-to-r from-green-600 to-green-400 rounded-l-full -translate-y-1/2" />
        <div className="absolute right-8 top-1/2 w-32 h-20 bg-linear-to-l from-red-600 to-red-400 rounded-r-full -translate-y-1/2" />
      </motion.div>

      <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-4">Pros</h2>
          {pros.map((p, i) => (
            <input
              key={i}
              value={p}
              onChange={(e) => {
                const np = [...pros];
                np[i] = e.target.value;
                setPros(np);
              }}
              placeholder="Add a pro..."
              className="w-full p-3 mb-2 bg-dark-800 rounded border border-dark-600 focus:border-green-400 outline-none"
            />
          ))}
          <button
            onClick={() => setPros([...pros, ""])}
            className="text-sm text-green-400"
          >
            + Add Pro
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Cons</h2>
          {cons.map((c, i) => (
            <input
              key={i}
              value={c}
              onChange={(e) => {
                const nc = [...cons];
                nc[i] = e.target.value;
                setCons(nc);
              }}
              placeholder="Add a con..."
              className="w-full p-3 mb-2 bg-dark-800 rounded border border-dark-600 focus:border-red-400 outline-none"
            />
          ))}
          <button
            onClick={() => setCons([...cons, ""])}
            className="text-sm text-red-400"
          >
            + Add Con
          </button>
        </div>
      </div>

      <div className="text-center mt-10">
        <p className="text-2xl font-bold">
          Scale tips{" "}
          <span className={tilt > 0 ? "text-green-400" : "text-red-400"}>
            {tilt > 0 ? "FOR" : "AGAINST"}
          </span>{" "}
          by {Math.abs(tilt)}%
        </p>
        <p className="mt-6 text-lg italic">
          Prime: "This aligns with your Purpose Element. Shall we proceed?"
        </p>
      </div>
    </div>
  );
}
