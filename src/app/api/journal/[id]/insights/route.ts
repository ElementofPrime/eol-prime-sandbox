// src/app/api/journal/[id]/insights/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { clientPromise } from "@/lib/mongo";
import { ObjectId } from "mongodb"; // ← IMPORT

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("eol_prime_dev");

    const entry = await db.collection("journal_entries").findOne({
      _id: new ObjectId(id), // ← CONVERT TO ObjectId
      userId: session.user.id,
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    // Mock insight in demo mode
    const insight = process.env.MONGODB_URI
      ? { mood: "reflective", clarity: 7, keyThemes: ["growth", "focus"] }
      : { mood: "neutral", clarity: 5, keyThemes: ["demo"] };

    return NextResponse.json({
      insight,
      entry: { content: entry.content, date: entry.date },
    });
  } catch (error) {
    console.error("Journal insights error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
