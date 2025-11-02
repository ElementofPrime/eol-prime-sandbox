"use client";

import { viewport } from "@radix-ui/react-viewport"; // adjust import
import { ReactNode } from "react";

export default function ClientViewportWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      {children} {/* or render based on vp */}
    </div>
  );
}
