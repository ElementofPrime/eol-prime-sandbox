'use client';
import Image from "next/image";

/**
 * Corner placement, subtle + transparent feel
 * - Vine: top-left, small, faint
 * - Tree: bottom-right, small, faint
 * - Soft edge fade via CSS mask so artwork melts into the background
 */
export default function BackgroundDecor() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden">
      {/* very gentle vignette so UI stays readable */}
      <div className="absolute inset-0 [background:radial-gradient(55%_45%_at_50%_35%,rgba(59,130,246,.08)_0%,rgba(2,6,23,0)_70%)]" />

      {/* VINE — top-left */}
      <div
        className="
          absolute top-6 left-6
          w-[24vw] max-w-[280px] h-[24vw] max-h-[280px]
          opacity-[0.10] dark:opacity-[0.10]
          [mask-image:radial-gradient(60%_60%_at_40%_40%,#000_60%,transparent_100%)]
        "
      >
        <Image
          src="/assets/vines.png"
          alt=""
          fill
          priority
          className="object-left-top object-contain"
        />
      </div>

      {/* TREE — bottom-right */}
      <div
        className="
          absolute bottom-6 right-6
          w-[28vw] max-w-[320px] h-[28vw] max-h-[320px]
          opacity-[0.10] dark:opacity-[0.10]
          [mask-image:radial-gradient(65%_65%_at_60%_60%,#000_60%,transparent_100%)]
        "
      >
        <Image
          src="/assets/tree-emblem.png"
          alt=""
          fill
          priority
          className="object-right-bottom object-contain"
        />
      </div>
    </div>
  );
}
