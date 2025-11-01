'use client';

import "../../styles/globals.css";
import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import { Inter, Great_Vibes } from "next/font/google";
import BackgroundDecor from "@/components/BackgroundDecor";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-greatvibes", display: "swap" });

export const metadata: Metadata = {
  title: "Element of Life — Prime Labs OS",
  description: "The foundation where focus becomes growth, and growth becomes transformation.",
  manifest: "/manifest.webmanifest",
  openGraph: {
    url: "https://elementoflife.ai",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Element of Life",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  userScalable: false,
};

/**
 * RootLayout component provides the main HTML structure and global providers for the application.
 * @param props - The props for RootLayout.
 * @param props.children - The child components to render within the layout.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${greatVibes.variable} min-h-screen antialiased`}>
        <Providers>
          <BackgroundDecor />
          <main
            className="relative z-10 bg-transparent"
            style={{
              paddingTop: "max(6rem, env(safe-area-inset-top))",
              paddingBottom: "max(5rem, env(safe-area-inset-bottom))",
              paddingLeft: "max(1rem, env(safe-area-inset-left))",
              paddingRight: "max(1rem, env(safe-area-inset-right))",
            }}
          >
            <NavBar />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}


import "../../styles/globals.css";
import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import { Inter, Great_Vibes } from "next/font/google";
import BackgroundDecor from "@/components/BackgroundDecor";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-greatvibes", display: "swap" });

export const metadata: Metadata = {
  title: "Element of Life — Prime Labs OS",
  description: "The foundation where focus becomes growth, and growth becomes transformation.",
  manifest: "/manifest.webmanifest",
  openGraph: {
    url: "https://elementoflife.ai",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Element of Life",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  userScalable: false,
};

/**
 * RootLayout component provides the main HTML structure and global providers for the application.
 * @param props - The props for RootLayout.
 * @param props.children - The child components to render within the layout.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${greatVibes.variable} min-h-screen antialiased`}>
        <Providers>
          <BackgroundDecor />
          <main
            className="relative z-10 bg-transparent"
            style={{
              paddingTop: "max(6rem, env(safe-area-inset-top))",
              paddingBottom: "max(5rem, env(safe-area-inset-bottom))",
              paddingLeft: "max(1rem, env(safe-area-inset-left))",
              paddingRight: "max(1rem, env(safe-area-inset-right))",
            }}
          >
            <NavBar />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
