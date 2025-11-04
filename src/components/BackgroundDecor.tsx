// src/components/BackgroundDecor.tsx
"use client";
import Image from "next/image";

export default function BackgroundDecor() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden isolate"
    >
      {/* VINE — top-left */}
      <DecorImage
        src="/assets/vines.png"
        alt=""
        position="top-left"
        className="top-4 left-4"
      />

      {/* TREE — bottom-right */}
      <DecorImage
        src="/assets/tree-emblem.png"
        alt=""
        position="bottom-right"
        className="bottom-4 right-4"
      />
    </div>
  );
}

// Reusable Decor Image Component
function DecorImage({
  src,
  alt,
  position,
  className,
}: {
  src: string;
  alt: string;
  position: "top-left" | "bottom-right";
  className: string;
}) {
  return (
    <div
      className={`absolute ${className} w-[26vw] max-w-[300px] h-[26vw] max-h-[300px]`}
    >
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 640px) 45vw, 26vw"
          className={`object-${position} object-contain decor-image`}
        />
      </div>
    </div>
  );
}
