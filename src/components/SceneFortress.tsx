"use client";

import { useEffect, useState } from "react";
import NextImage from "next/image";

function useIsMobile(breakpoint = 768) {
	const [isMobile, setIsMobile] = useState<boolean>(false);
	useEffect(() => {
		if (typeof window === "undefined") return;
		const mq = window.matchMedia(`(max-width:${breakpoint}px)`);
		const handler = () => setIsMobile(mq.matches);
		handler();
		mq.addEventListener?.("change", handler);
		return () => mq.removeEventListener?.("change", handler);
	}, [breakpoint]);
	return isMobile;
}

export default function SceneFortress() {
	const isMobile = useIsMobile(768);

	// choose art-directed source
	const src = isMobile
		? "/assets/fortress-bg-portrait.webp" // 1080x1920
		: "/assets/fortress-bg-desktop.webp"; // 2560x1440

	const [hasImg, setHasImg] = useState(true);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const test = new window.Image();
		test.src = src;
		test.onload = () => setHasImg(true);
		test.onerror = () => setHasImg(false);
	}, [src]);

	return (
		<div
			aria-hidden
			className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
		>
			{/* gradient fallback while loading/missing */}
			<div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_20%,#87a7c766_0%,#0b122099_60%,transparent_100%)]" />
			<div className="absolute inset-0 prime-starfield opacity-30" />

			{hasImg && (
				<div className="absolute inset-0">
					<div className="relative h-full w-full">
						<NextImage
							src={src}
							alt=""
							fill
							priority
							// cover: fills viewport without letterboxing
							className="object-cover opacity-[0.9] select-none"
							// tell Next what size we expect at common breakpoints
							sizes="(max-width: 480px) 100vw,
                     (max-width: 768px) 100vw,
                     (max-width: 1280px) 100vw,
                     100vw"
							placeholder="empty"
						/>
					</div>
					{/* soft beacon + beams */}
					<div className="absolute inset-0 prime-beacon" />
					<div className="absolute inset-0 prime-fog" />
					<div className="absolute inset-0 prime-beams" />
				</div>
			)}
		</div>
	);
}
