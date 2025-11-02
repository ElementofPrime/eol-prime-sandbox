"use client";

import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
	// Responsive via Tailwind + CSS vars (no hook needed)
	return (
		<div
			className="min-h-screen"
			style={{
				// Dynamic safe-area padding (iOS/Android)
				paddingTop: "max(6rem, env(safe-area-inset-top))",
				paddingBottom: "max(5rem, env(safe-area-inset-bottom))",
				paddingLeft: "max(1rem, env(safe-area-inset-left))",
				paddingRight: "max(1rem, env(safe-area-inset-right))",
			}}
		>
			{children}
		</div>
	);
}
