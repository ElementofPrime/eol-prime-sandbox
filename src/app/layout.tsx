// src/app/layout.tsx
import "../../styles/globals.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import NavBar from "@/components/NavBar";
import Providers from "./providers";
import { Inter, Great_Vibes } from "next/font/google";
import BackgroundDecor from "@/components/BackgroundDecor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-greatvibes", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://elementoflife.ai"),
  title: "Element of Life — Prime Labs OS",
  description: "The foundation where focus becomes growth, and growth becomes transformation.",
  themeColor: "#0b1220",
  manifest: "/manifest.webmanifest",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Element of Life",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <BackgroundDecor />
        <Providers>
          <NavBar />
          <main
            className="relative z-10 bg-transparent"
            style={{
              paddingTop: "max(6rem, env(safe-area-inset-top))",
              paddingBottom: "max(5rem, env(safe-area-inset-bottom))",
              paddingLeft: "max(1rem, env(safe-area-inset-left))",
              paddingRight: "max(1rem, env(safe-area-inset-right))",
            }}
          >
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
