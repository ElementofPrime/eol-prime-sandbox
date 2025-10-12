// src/components/BackgroundDecor.tsx
'use client';
import Image from 'next/image';

export default function BackgroundDecor() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none">
      {/* Left/top vines */}
      <Image
        src="/vines.svg.png"         // ensure this exact path exists in /public
        alt=""
        fill
        sizes="100vw"
        priority
        className="object-left-top object-contain opacity-30 eol-ambient"
      />

      {/* Right/bottom tree */}
      <Image
        src="/tree.svg.png"          // ensure this exact path exists in /public
        alt=""
        fill
        sizes="100vw"
        className="object-right-bottom object-contain mix-blend-overlay blur-[2px] eol-ambient
                   opacity-[0.10] dark:opacity-[0.14]"  /* ↑ raise to verify; drop to .07/.10 later */
      />
    </div>
  );
}
