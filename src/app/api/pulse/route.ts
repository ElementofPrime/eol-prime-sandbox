// src/app/api/pulse/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { clientPromise } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);

  // ALLOW DEMO MODE
  if (!session?.user) {
    return NextResponse.json({
      health: "online",
      insight: { mood: "demo", clarity_score: 3 },
      pulse: 50,
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db("eol_prime_dev");

    const entries = await db
      .collection("journal_entries")
      .find({ userId: session.user.id })
      .sort({ date: -1 })
      .limit(5)
      .toArray();

    const insight =
      entries.length > 0
        ? { mood: "focused", clarity_score: 8 }
        : { mood: "neutral", clarity_score: 5 };

    return NextResponse.json({
      health: "online",
      insight,
      pulse: Math.sin(Date.now() / 10000) * 30 + 70,
    });
  } catch (error) {
    console.error("Pulse API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
