// src/app/api/pulse/route.ts
//import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { clientPromise } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
//export const revalidate = 0;
//export const fetchCache = "force-no-store";
export async function GET(request: Request) {
  // ← Use `request` param instead of `headers()`
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("eol_prime_dev"); // Use real DB in prod
    const entries = await db
      .collection("journal_entries")
      .find({ userId: session.user.id })
      .sort({ date: -1 })
      .limit(5)
      .toArray();

    // Mock insight if no entries or demo mode
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
