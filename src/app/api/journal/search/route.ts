// src/app/api/journal/search/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { clientPromise } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // ← NO PRERENDER

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    const client = await clientPromise;
    const db = client.db("eol_prime_dev");

    const results = await db
      .collection("journal_entries")
      .find({
        userId: session.user.id,
        $text: { $search: q },
      })
      .limit(10)
      .toArray();

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Journal search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
