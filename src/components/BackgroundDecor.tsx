'use client';

import Image from "next/image";

export default function BackgroundDecor() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
      <div className="absolute inset-0 -z-10 [background:radial-gradient(60%_50%_at_50%_35%,rgba(59,130,246,.22)_0%,rgba(2,6,23,0)_70%)]" />

      {/* Vines layer */}
      <Image
        src="/assets/vines.png"
        alt=""
        fill
        priority
        className="object-cover opacity-50 animate-vine"
      />

      {/* Tree emblem glow */}
      <div className="absolute left-1/2 top-[18%] -translate-x-1/2 w-[540px] h-[540px] rounded-full animate-tree-glow">
        <Image
          src="/assets/tree-emblem.png"
          alt=""
          fill
          priority
          className="object-contain opacity-[0.22]"
        />
      </div>
    </div>
  );
}
