import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

let client: MongoClient | null = null;
async function getDb() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI!, { maxPoolSize: 5 });
    await client.connect();
  }
  return client.db(process.env.MONGODB_DB || 'eol');
}

// GET: list latest 100 to-dos
export async function GET() {
  try {
    const db = await getDb();
    const items = await db.collection('todos')
      .find({})
      .sort({ done: 1, createdAt: -1 })
      .limit(100)
      .toArray();
    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}

// POST: create { title }
export async function POST(req: Request) {
  try {
    const db = await getDb();
    const { title } = await req.json();
    if (!title?.trim()) {
      return NextResponse.json({ ok: false, error: 'Title required' }, { status: 400 });
    }
    const doc = { title: title.trim(), done: false, createdAt: new Date() };
    const r = await db.collection('todos').insertOne(doc);
    return NextResponse.json({ ok: true, item: { _id: r.insertedId, ...doc } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}

// PATCH: toggle done by id
export async function PATCH(req: Request) {
  try {
    const db = await getDb();
    const { id, done } = await req.json();
    if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });
    await db.collection('todos').updateOne({ _id: new ObjectId(id) }, { $set: { done: !!done } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}

// DELETE: remove by id
export async function DELETE(req: Request) {
  try {
    const db = await getDb();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });
    await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
