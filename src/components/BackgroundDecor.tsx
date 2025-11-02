"use client";
import Image from "next/image";

export default function BackgroundDecor() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden isolate"
    >
      {/* VINE — top-left */}
      <div className="absolute top-4 left-4 w-[26vw] max-w-[300px] h-[26vw] max-h-[300px]">
        <div className="relative w-full h-full">
          {/* parent for fill */}
          <Image
            src="/assets/vines.png"
            alt=""
            fill
            priority
            sizes="(max-width: 640px) 45vw, 26vw"
            className="object-top-left object-contain"
            style={{
              opacity: 0.2,
              maskImage:
                "radial-gradient(65% 65% at 65% 65%, #000 65%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(65% 65% at 65% 65%, #000 65%, transparent 100%)",
              transform: "translateZ(0)",
            }}
          />
        </div>
      </div>

      {/* TREE — bottom-right */}
      <div className="absolute bottom-4 right-4 w-[26vw] max-w-[300px] h-[26vw] max-h-[300px]">
        <div className="relative w-full h-full">
          {/* parent for fill */}
          <Image
            src="/assets/tree-emblem.png"
            alt=""
            fill
            priority
            sizes="(max-width: 640px) 45vw, 26vw"
            className="object-bottom-right object-contain"
            style={{
              opacity: 0.2,
              maskImage:
                "radial-gradient(65% 65% at 65% 65%, #000 65%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(65% 65% at 65% 65%, #000 65%, transparent 100%)",
              transform: "translateZ(0)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
