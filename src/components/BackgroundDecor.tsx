'use client';
import Image from "next/image";

export default function BackgroundDecor() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
      {/* Soft vignette to keep UI readable */}
      <div className="absolute inset-0 -z-10 
        [background:radial-gradient(60%_50%_at_50%_35%,rgba(59,130,246,.18)_0%,rgba(2,6,23,0)_70%)]
      " />

      {/* Optional overall dimmer (stronger in dark mode) */}
      <div className="absolute inset-0 bg-white/14 dark:bg-slate-950/35" />

      {/* Vines: full-bleed, slightly higher crop toward the top for composition */}
      <Image
        src="/assets/vines.png"
        alt=""
        fill
        priority
        className="
          object-cover object-[50%_18%]
          opacity-35 dark:opacity-20
          animate-vine
        "
      />

      {/* Tree emblem glow behind the crest */}
      <div
        className="
          absolute left-1/2 -translate-x-1/2
          top-[16svh] md:top-[14svh]
          w-[min(46vw,600px)] h-[min(46vw,600px)]
          rounded-full animate-tree-glow
        "
      >
        <Image
          src="/assets/tree-emblem.png"
          alt=""
          fill
          priority
          className="object-contain opacity-[0.18] dark:opacity-[0.12]"
        />
      </div>
    </div>
  );
}
