import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

let _client: MongoClient | null = null;
async function db() {
  if (!_client) {
    _client = new MongoClient(process.env.MONGODB_URI!, { maxPoolSize: 5 });
    await _client.connect();
  }
  return _client.db(process.env.MONGODB_DB || 'eol');
}

// super-light heuristic; we’ll replace with ML later
function analyze(content: string) {
  const t = (content || '').toLowerCase();
  const pos = ['great','grateful','good','progress','win','joy','happy','love'];
  const neg = ['stressed','overwhelmed','anxious','sad','angry','worried','tired','lost'];
  let score = 0;
  pos.forEach(w => { if (t.includes(w)) score++; });
  neg.forEach(w => { if (t.includes(w)) score--; });
  const mood = score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
  const prompt =
    mood === 'negative'
      ? 'Take one small step you can control. What is it?'
      : mood === 'positive'
      ? 'Momentum is up—what tiny action compounds it today?'
      : 'What would make today 1% better?';
  return { mood, sentimentScore: score, prompt };
}

/**
 * GET: return last 5 journal entries + most recent insight (creates one
 * for the latest entry if missing, so the tile always has something to show).
 */
export async function GET() {
  const d = await db();

  // NOTE: your collection names from screenshots: eol.journalentries & eol.primeinsights
  const entries = await d
    .collection('journalentries')
    .find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

  const latest = entries[0];

  // try to read last insight for latest entry
  let lastInsight =
    latest &&
    (await d
      .collection('primeinsights')
      .find({ entryId: latest._id })
      .sort({ createdAt: -1 })
      .limit(1)
      .next());

  // if none exists yet, create one on the fly (lightweight “upsert” behavior)
  if (latest && !lastInsight) {
    const a = analyze(latest.content || '');
    const ins = {
      entryId: latest._id,
      userId: 'stub-user',
      mood: a.mood,
      sentimentScore: a.sentimentScore,
      topics: [],
      extract: {},
      primePrompts: [a.prompt],
      primeSuggestions: [],
      createdAt: new Date(),
    };
    const r = await d.collection('primeinsights').insertOne(ins);
    lastInsight = { _id: r.insertedId, ...ins } as any;
  }

  const mood = lastInsight?.mood || 'neutral';
  const prompt =
    lastInsight?.primePrompts?.[0] || 'What matters most right now?';

  return NextResponse.json({
    ok: true,
    entriesCount: entries.length,
    lastInsight: lastInsight || null,
    mood,
    prompt,
  });
}

/** POST: force-generate a fresh insight for a given entryId (or latest). */
export async function POST(req: Request) {
  const d = await db();
  const body = await req.json().catch(() => ({}));
  const { entryId } = body;

  const entry =
    entryId
      ? await d.collection('journalentries').findOne({ _id: new ObjectId(entryId) })
      : await d.collection('journalentries').find({}).sort({ createdAt: -1 }).limit(1).next();

  if (!entry) {
    return NextResponse.json({ ok: false, error: 'No journal entry found' }, { status: 404 });
  }

  const a = analyze(entry.content || '');
  const ins = {
    entryId: entry._id,
    userId: 'stub-user',
    mood: a.mood,
    sentimentScore: a.sentimentScore,
    topics: [],
    extract: {},
    primePrompts: [a.prompt],
    primeSuggestions: [],
    createdAt: new Date(),
  };
  const r = await d.collection('primeinsights').insertOne(ins);
  return NextResponse.json({ ok: true, insight: { _id: r.insertedId, ...ins } }, { status: 201 });
}
