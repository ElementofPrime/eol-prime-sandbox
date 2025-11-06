// src/components/SceneFortress.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

export default function SceneFortress() {
  const isMobile = useIsMobile(768);
  const src = isMobile
    ? "/assets/fortress-bg-portrait.webp"
    : "/assets/fortress-bg-desktop.webp";

  const [hasImg, setHasImg] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const img = new window.Image();
    img.src = src;
    img.onload = () => setHasImg(true);
    img.onerror = () => setHasImg(false);
  }, [src]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_20%,#87a7c766_0%,#0b122099_60%,transparent_100%)]" />
      <div className="absolute inset-0 opacity-30 bg-[url('/assets/starfield.png')] bg-repeat" />

      {hasImg && (
        <div className="absolute inset-0">
          <Image
            src={src}
            alt=""
            fill
            priority
            className="object-cover opacity-90 select-none"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent" />
        </div>
      )}
    </div>
  );
}
