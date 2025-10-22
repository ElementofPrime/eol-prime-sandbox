import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getDb } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  const s = await getServerSession(authOptions);
  if (!s?.user) return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });

  const db = await getDb();
  const items = await db.collection("todos")
    .find({ userId: (s.user as any).id })
    .sort({ done: 1, createdAt: -1 })
    .limit(100)
    .toArray();
  return NextResponse.json({ ok:true, items });
}

export async function POST(req: Request) {
  const s = await getServerSession(authOptions);
  if (!s?.user) return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });

  const db = await getDb();
  const { title } = await req.json();
  if (!title?.trim()) return NextResponse.json({ ok:false, error:"Title required" }, { status:400 });

  const doc = { userId: (s.user as any).id, title: title.trim(), done:false, createdAt:new Date() };
  const r = await db.collection("todos").insertOne(doc);
  return NextResponse.json({ ok:true, item:{ _id:r.insertedId, ...doc } }, { status:201 });
}

export async function PATCH(req: Request) {
  const s = await getServerSession(authOptions);
  if (!s?.user) return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });

  const db = await getDb();
  const { id, done } = await req.json();
  if (!id) return NextResponse.json({ ok:false, error:"id required" }, { status:400 });

  await db.collection("todos").updateOne(
    { _id: new ObjectId(id), userId: (s.user as any).id },
    { $set: { done: !!done } }
  );
  return NextResponse.json({ ok:true });
}

export async function DELETE(req: Request) {
  const s = await getServerSession(authOptions);
  if (!s?.user) return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });

  const db = await getDb();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ ok:false, error:"id required" }, { status:400 });

  await db.collection("todos").deleteOne({ _id: new ObjectId(id), userId: (s.user as any).id });
  return NextResponse.json({ ok:true });
}
