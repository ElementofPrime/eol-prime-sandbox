// src/components/BackgroundDecor.tsx
'use client';
import Image from 'next/image';

export default function BackgroundDecor() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 select-none pointer-events-none">
      <Image
        src="/vines.svg.png"
        alt=""
        fill
        priority
        className="object-left-top object-contain opacity-[0.08] dark:opacity-[0.12] mix-blend-soft-light eol-ambient"
      />
      <Image
        src="/tree.svg.png"
        alt=""
        fill
        className="object-right-bottom object-contain opacity-[0.07] dark:opacity-[0.1] mix-blend-overlay blur-[2px] eol-ambient"
      />
    </div>
  );
}
