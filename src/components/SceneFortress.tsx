// /src/components/SceneFortress.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * SceneFortress
 * - Parallax fortress backdrop with soft fog + starfield + crest glow.
 * - Safe if assets are missing (falls back to gradient).
 * - Z-index is behind page content; place it near the root of the chat page.
 */
export default function SceneFortress() {
  const [hasImg, setHasImg] = useState(true);

  useEffect(() => {
    // Preload main fortress image; if missing, we gracefully degrade to gradient.
    const img = new Image();
    img.src = "/assets/fortress-bg.png";
    img.onload = () => setHasImg(true);
    img.onerror = () => setHasImg(false);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base gradient fallback */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_20%,#87a7c780_0%,#0b122080_60%,transparent_100%)]" />

      {/* Optional starfield */}
      <div className="absolute inset-0 prime-starfield opacity-30" />

      {/* Fortress image / video layer */}
      {hasImg ? (
        <div className="absolute inset-0 flex items-end justify-center md:items-center">
          {/* Slight parallax on scroll */}
          <div className="fortress-parallax relative w-[1400px] max-w-[92vw] aspect-[16/9]">
            {/* fortress image */}
            <Image
              src="/assets/fortress-bg.png"
              alt=""
              fill
              priority
              className="object-contain opacity-80 mix-blend-screen select-none"
            />
            {/* subtle beacon glow */}
            <div className="absolute inset-0 prime-beacon" />
          </div>
        </div>
      ) : null}

      {/* Foreground fog + subtle moving light beams */}
      <div className="absolute inset-0 prime-fog pointer-events-none" />
      <div className="absolute inset-0 prime-beams pointer-events-none" />
    </div>
  );
}
