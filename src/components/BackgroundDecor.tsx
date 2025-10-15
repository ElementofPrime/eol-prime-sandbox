'use client';
import Image from "next/image";

export default function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden [isolation:isolate]"
    >
      {/* VINE — top-left */}
      <div className="absolute top-6 left-6 w-[22vw] max-w-[260px] h-[22vw] max-h-[260px]">
        <div className="relative w-full h-full">{/* <- relative parent for fill */ }
          <Image
            src="/assets/vines.png"
            alt=""
            fill
            priority
            className="object-left-top object-contain"
            style={{
              opacity: 0.10,
              maskImage:
                'radial-gradient(60% 60% at 40% 40%, #000 60%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(60% 60% at 40% 40%, #000 60%, transparent 100%)',
              transform: 'translateZ(0)',
            }}
          />
        </div>
      </div>

      {/* TREE — bottom-right */}
      <div className="absolute bottom-6 right-6 w-[26vw] max-w-[300px] h-[26vw] max-h-[300px]">
        <div className="relative w-full h-full">{/* <- relative parent for fill */ }
          <Image
            src="/assets/tree-emblem.png"
            alt=""
            fill
            priority
            className="object-right-bottom object-contain"
            style={{
              opacity: 0.10,
              // tighter circle so any backdrop corners are fully clipped
              maskImage:
                'radial-gradient(50% 50% at 50% 50%, #000 52%, transparent 62%)',
              WebkitMaskImage:
                'radial-gradient(50% 50% at 50% 50%, #000 52%, transparent 62%)',
              transform: 'translateZ(0)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
