// src/app/api/journal/route.ts
import { connectToDatabase } from '@/lib/mongodb';
import JournalEntry from '@/models/JournalEntry';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { content, audioUrl } = await req.json();

  try {
    await connectToDatabase();
    const entry = await JournalEntry.create({
      email: session.user.email,
      content,
      date: new Date().toLocaleDateString(),
      audioUrl,
    });
    return NextResponse.json({ success: true, entry });
  } catch (err) {
    console.error('[JOURNAL_SAVE_ERROR]', err);
    return NextResponse.json({ error: 'Failed to save journal entry' }, { status: 500 });
  }
}
