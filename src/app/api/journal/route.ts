import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connect from '@/lib/db';
import JournalEntry from '@/models/JournalEntry';

export async function GET(req: NextRequest) {
  await connect();
  const session = await getServerSession(authOptions);

  const filter = session?.user?.email
    ? { email: session.user.email }
    : {}; // For dev/testing: returns all entries if unauthenticated

  const entries = await JournalEntry.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  await connect();
  const session = await getServerSession(authOptions);
  const body = await req.json();

  if (!body.content || body.content.trim() === '') {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const email = session?.user?.email || 'guest@unknown.com';
  const date = new Date().toLocaleDateString();

  const newEntry = await JournalEntry.create({
    email,
    content: body.content,
    date,
  });

  return NextResponse.json({ entry: newEntry });
}
