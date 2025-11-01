"use client";

import { viewport } from '@radix-ui/react-viewport';  // adjust import
import { ReactNode } from 'react';

export default function ClientViewportWrapper({ children }: { children: ReactNode }) {
  // Use viewport here safely
  const vp = viewport();
  return <div>{children} {/* or render based on vp */}</div>;
}