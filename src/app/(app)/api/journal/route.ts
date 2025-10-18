export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import JournalEntry from '@/models/JournalEntry';
import PrimeInsight from '@/models/PrimeInsight';
import { quickExtract, roughSentiment, inferTopics, makePrimePrompts, makePrimeSuggestions } from '@/lib/prime/journal/analyze';


// NOTE: wire to your auth; here we stub user
async function getUserId() { return 'stub-user'; }


export async function GET() {
await dbConnect();
const userId = await getUserId();
const items = await JournalEntry.find({ userId }).sort({ createdAt: -1 }).limit(50).lean();
return NextResponse.json({ items });
}


export async function POST(req: NextRequest) {
await dbConnect();
const userId = await getUserId();
const { content, tags } = await req.json();
if (!content) return NextResponse.json({ error: 'content required' }, { status: 400 });


const entry = await JournalEntry.create({ userId, content, tags: tags || [] });


// Analysis v0.1 (sync)
const extract = quickExtract(content);
const { mood, score } = roughSentiment(content);
const topics = inferTopics(content);
const primePrompts = makePrimePrompts({ extract, topics });
const primeSuggestions = makePrimeSuggestions({ extract, topics });


await PrimeInsight.create({
entryId: entry._id,
userId,
mood,
sentimentScore: score,
topics,
extract,
primePrompts,
primeSuggestions
});


return NextResponse.json({ entryId: entry._id });
}