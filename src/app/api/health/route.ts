// src/app/api/health/route.ts
import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();

  try {
    const client = await clientPromise;
    const db = client.db("eol_prime_dev");

    // Test DB connection (only if real DB)
    if (process.env.MONGODB_URI) {
      await db.command({ ping: 1 });
      const latency = Date.now() - start;

      return NextResponse.json({
        status: "healthy",
        db: "connected",
        latency: `${latency}ms`,
        timestamp: new Date().toISOString(),
      });
    }

    // DEMO MODE: No DB, but still healthy
    return NextResponse.json({
      status: "healthy (demo mode)",
      db: "mock",
      latency: "0ms",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "degraded",
        db: "error",
        error: error instanceof Error ? error.message : "Unknown",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
