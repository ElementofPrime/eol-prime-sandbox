import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

/**
 * Lightweight profile storage for greeting & preferences.
 * Schema: { email: string, displayName?: string, motto?: string, createdAt, updatedAt }
 *
 * NOTE: For fast iteration we accept 'email' from query/body (client provides from session).
 * In hardening pass, switch to getServerSession(authOptions) and derive from session.user.
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.toLowerCase();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  const db = await getDb();
  const doc = await db.collection("userprofiles").findOne({ email });
  return NextResponse.json({ profile: doc ?? null });
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body?.email || "").toLowerCase();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  const payload: any = {
    ...(body.displayName ? { displayName: String(body.displayName).slice(0, 64) } : {}),
    ...(body.motto ? { motto: String(body.motto).slice(0, 140) } : {}),
    updatedAt: new Date(),
  };

  const db = await getDb();
  const res = await db.collection("userprofiles").findOneAndUpdate(
    { email },
    { $set: payload, $setOnInsert: { email, createdAt: new Date() } },
    { upsert: true, returnDocument: "after" }
  );

  return NextResponse.json({ profile: res.value });
}
