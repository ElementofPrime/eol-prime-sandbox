'use client';
import Image from "next/image";

export default function BackgroundDecor() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
      {/* gentle global vignette for readability */}
      <div className="absolute inset-0 -z-10 [background:radial-gradient(55%_45%_at_50%_35%,rgba(59,130,246,.10)_0%,rgba(2,6,23,0)_70%)]" />

      {/* small vine - top-left */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-10
                      w-[38vw] max-w-[360px] h-[38vw] max-h-[360px] opacity-25 dark:opacity-15">
        <Image
          src="/assets/vines.png"
          alt=""
          fill
          priority
          className="object-contain animate-vine"
        />
      </div>

      {/* small tree - bottom-right */}
      <div className="absolute bottom-6 right-6 w-[32vw] max-w-[360px] h-[32vw] max-h-[360px]
                opacity-12 dark:opacity-10 rounded-full animate-tree-glow">
        <Image
          src="/assets/tree-emblem.png"
          alt=""
          fill
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
}
