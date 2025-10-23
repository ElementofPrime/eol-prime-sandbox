// /src/components/PrimeAura.tsx
"use client";

import { useMemo } from "react";

type Tone = "calm" | "excited" | "reflective" | "stressed" | "neutral";

export default function PrimeAura({ tone = "neutral" as Tone }) {
  const toneClass = useMemo(() => {
    switch (tone) {
      case "calm":
        return "from-cyan-300/25 via-cyan-500/15 to-transparent";
      case "excited":
        return "from-amber-300/25 via-amber-500/15 to-transparent";
      case "reflective":
        return "from-sky-300/25 via-blue-400/15 to-transparent";
      case "stressed":
        return "from-violet-400/25 via-fuchsia-500/10 to-transparent";
      default:
        return "from-slate-300/20 via-slate-500/10 to-transparent";
    }
  }, [tone]);

  return (
    <div className="relative">
      {/* pulsing aura behind messages or the input dock */}
      <div
        className={`prime-aura pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br ${toneClass}`}
      />
    </div>
  );
}
