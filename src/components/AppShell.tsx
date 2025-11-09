"use client";

import BackgroundDecor from "@/components/BackgroundDecor";
import NavBar from "@/components/NavBar";
import ClientLayout from "@/components/ClientLayout";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackgroundDecor />
      <ClientLayout>
        <main className="relative z-10 flex min-h-screen flex-col">
          <NavBar />
          <div className="flex-1">{children}</div>
        </main>
      </ClientLayout>
    </>
  );
}
