'use client';
import Image from "next/image";

export default function BackgroundDecor() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden">
      {/* optional ultra-soft vignette; safe to remove if you prefer */}
      <div className="absolute inset-0 [background:radial-gradient(55%_45%_at_50%_35%,rgba(59,130,246,.06)_0%,rgba(2,6,23,0)_70%)]" />

      {/* VINE — top-left (wrapper has NO opacity) */}
      <div className="absolute top-6 left-6 w-[22vw] max-w-[260px] h-[22vw] max-h-[260px]">
        <Image
          src="/assets/vines.png"
          alt=""
          fill
          priority
          className="object-left-top object-contain"
          style={{
            opacity: 0.10,                           // put opacity on the image
            maskImage: 'radial-gradient(60% 60% at 40% 40%, #000 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(60% 60% at 40% 40%, #000 60%, transparent 100%)',
            mixBlendMode: 'soft-light',
          }}
        />
      </div>

      {/* TREE — bottom-right (wrapper has NO opacity) */}
      <div className="absolute bottom-6 right-6 w-[26vw] max-w-[300px] h-[26vw] max-h-[300px]">
        <Image
          src="/assets/tree-emblem.png"
          alt=""
          fill
          priority
          className="object-right-bottom object-contain"
          style={{
            opacity: 0.10,                           // put opacity on the image
            maskImage: 'radial-gradient(65% 65% at 60% 60%, #000 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(65% 65% at 60% 60%, #000 60%, transparent 100%)',
            mixBlendMode: 'soft-light',
          }}
        />
      </div>
    </div>
  );
}
