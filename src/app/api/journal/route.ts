// src/app/api/journal/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { clientPromise } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // ← PREVENTS BUILD PRERENDER

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("eol_prime_dev");

    const entries = await db
      .collection("journal_entries")
      .find({ userId: session.user.id })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Journal API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await request.json();

  if (!content) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("eol_prime_dev");

    const result = await db.collection("journal_entries").insertOne({
      userId: session.user.id,
      content,
      date: new Date(),
    });

    return NextResponse.json({
      id: result.insertedId,
      content,
      date: new Date(),
    });
  } catch (error) {
    console.error("Journal POST error:", error);
    return NextResponse.json(
      { error: "Failed to save entry" },
      { status: 500 }
    );
  }
}
