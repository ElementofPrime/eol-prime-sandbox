import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import JournalEntry from '@/models/JournalEntry';

export const dynamic = 'force-dynamic'; // disable route caching

export async function GET() {
  try {
    await dbConnect();
    const items = await JournalEntry.find().sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'GET error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { content, mood, tags } = await req.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ ok: false, error: 'Content required' }, { status: 400 });
    }
    const doc = await JournalEntry.create({
      content: content.trim(),
      mood: mood || null,
      tags: Array.isArray(tags) ? tags : []
    });
    return NextResponse.json({ ok: true, item: doc }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'POST error' }, { status: 500 });
  }
}
