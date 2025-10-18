export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";

// GET ?limit=20
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 20);
    const db = await getDb();
    const items = await db
      .collection("journal_entries")
      .find({})
      .sort({ createdAt: -1 })
      .limit(isNaN(limit) ? 20 : limit)
      .toArray();

    return Response.json({ ok: true, items });
  } catch (err: any) {
    console.error("journal GET error:", err);
    return Response.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDb();
    const doc = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const { insertedId } = await db.collection("journal_entries").insertOne(doc);
    return Response.json({ ok: true, id: insertedId, doc });
  } catch (err: any) {
    console.error("journal POST error:", err);
    return Response.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
