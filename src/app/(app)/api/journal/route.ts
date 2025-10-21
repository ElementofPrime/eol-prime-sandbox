import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { dbConnect } from '@/lib/db';
import JournalEntry from '@/models/JournalEntry';
import { getMongoDb } from "@/lib/mongo";
import { authOptions } from "@/lib/authOptions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const db = await getMongoDb();
  const items = await db
    .collection("journalentries")
    .find({ userId: (session.user as any).id })      // ← per-user
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  return NextResponse.json({ ok: true, items });
}
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const db = await getMongoDb();
  const { content, mood, tags } = await req.json();

  if (!content?.trim()) return NextResponse.json({ ok: false, error: "Content required" }, { status: 400 });

  const doc = {
    userId: (session.user as any).id,                // ← owner
    content: content.trim(),
    mood: mood || null,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const r = await db.collection("journalentries").insertOne(doc);
  return NextResponse.json({ ok: true, item: { _id: r.insertedId, ...doc } }, { status: 201 });
}
