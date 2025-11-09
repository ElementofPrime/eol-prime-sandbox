"use client";
import Image from "next/image";

export default function BackgroundDecor() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden isolate"
    >
      {/* Optional soft wash so images read in both themes */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900" />

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

function DecorImage({
  src,
  alt,
  position,
  className,
}: {
  src: string;
  alt: string;
  position: "top-left" | "bottom-right" | "top-right" | "bottom-left";
  className?: string;
}) {
  // Map to valid Tailwind object-position utilities
  const objClass =
    position === "top-left"
      ? "object-left-top"
      : position === "bottom-right"
        ? "object-right-bottom"
        : position === "top-right"
          ? "object-right-top"
          : "object-left-bottom";

  return (
    <div
      className={`absolute ${className ?? ""} w-[26vw] max-w-[300px] h-[26vw] max-h-[300px]`}
    >
      <div className="relative h-full w-full">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          draggable={false}
          sizes="(max-width: 640px) 45vw, 26vw"
          className={`${objClass} object-contain opacity-80 dark:opacity-70`}
        />
      </div>
    </div>
  );
}
