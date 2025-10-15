'use client';
import Image from "next/image";

export default function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden [isolation:isolate]"
    >
      {/* VINE — top-left */}
      <div className="absolute top-4 left-4 w-[26vw] max-w-[300px] h-[26vw] max-h-[300px]">
        <div className="relative w-full h-full">{/* <- relative parent for fill */ }
          <Image
            src="/assets/vines.png"
            alt=""
            fill
            priority
            className="object-left-top object-contain"
            style={{
              opacity: 0.20,
              maskImage:
                'radial-gradient(65% 65% at 65% 65%, #000 65%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(65% 65% at 65% 65%, #000 65%, transparent 100%)',
              transform: 'translateZ(0)',
            }}
          />
        </div>
      </div>

      {/* TREE — bottom-right */}
      <div className="absolute bottom-4 right-4 w-[26vw] max-w-[300px] h-[26vw] max-h-[300px]">
        <div className="relative w-full h-full">{/* <- relative parent for fill */ }
          <Image
            src="/assets/tree-emblem.png"
            alt=""
            fill
            priority
            className="object-right-bottom object-contain"
            style={{
              opacity: 0.20,
              // tighter circle so any backdrop corners are fully clipped
              maskImage:
                'radial-gradient(65% 65% at 65% 65%, #000 65%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(65% 65% at 65% 65%, #000 65%, transparent 100%)',
              transform: 'translateZ(0)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
