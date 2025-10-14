'use client';

import Image from "next/image";

export default function BackgroundDecor() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 select-none pointer-events-none overflow-hidden">
      {/* subtle vignette for readability */}
      <div className="absolute inset-0 [background:radial-gradient(55%_45%_at_50%_35%,rgba(59,130,246,.10)_0%,rgba(2,6,23,0)_70%)]" />

      {/* vine: top-left, faint */}
      <Image
        src="/assets/vines.png"
        alt=""
        fill
        priority
        className="object-left-top object-contain opacity-[0.10] dark:opacity-[0.12] mix-blend-soft-light animate-vine"
      />

      {/* tree: bottom-right, faint */}
      <Image
        src="/assets/tree-emblem.png"
        alt=""
        fill
        priority
        className="object-right-bottom object-contain opacity-[0.10] dark:opacity-[0.12] mix-blend-overlay blur-[1px] animate-tree-glow"
      />
    </div>
  );
}
