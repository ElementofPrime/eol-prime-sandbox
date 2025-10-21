import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getMongoDb } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function analyze(t: string) {
  const txt = (t || "").toLowerCase();
  const pos = ["great","grateful","good","progress","win","joy","happy","love"];
  const neg = ["stressed","overwhelmed","anxious","sad","angry","worried","tired","lost"];
  let score = 0; pos.forEach(w => txt.includes(w) && score++); neg.forEach(w => txt.includes(w) && score--);
  const mood = score > 0 ? "positive" : score < 0 ? "negative" : "neutral";
  const prompt = mood === "negative"
    ? "Take one small step you can control. What is it?"
    : mood === "positive"
    ? "Momentum is up—what tiny action compounds it today?"
    : "What would make today 1% better?";
  return { mood, sentimentScore: score, prompt };
}

export async function GET() {
  const s = await getServerSession(authOptions);
  if (!s?.user) return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  const userId = (s.user as any).id;

  const db = await getMongoDb();
  const entries = await db.collection("journalentries")
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

  const latest = entries[0];

  let lastInsight = latest && await db.collection("primeinsights")
    .find({ userId, entryId: latest._id })
    .sort({ createdAt: -1 })
    .limit(1)
    .next();

  if (latest && !lastInsight) {
    const a = analyze(latest.content || "");
    const ins = {
      entryId: latest._id,
      userId,
      mood: a.mood,
      sentimentScore: a.sentimentScore,
      topics: [],
      extract: {},
      primePrompts: [a.prompt],
      primeSuggestions: [],
      createdAt: new Date(),
    };
    const r = await db.collection("primeinsights").insertOne(ins);
    lastInsight = { _id: r.insertedId, ...ins } as any;
  }

  return NextResponse.json({
    ok: true,
    entriesCount: entries.length,
    lastInsight: lastInsight || null,
    mood: lastInsight?.mood || "neutral",
    prompt: lastInsight?.primePrompts?.[0] || "What matters most right now?",
  });
}

export async function POST(req: Request) {
  const s = await getServerSession(authOptions);
  if (!s?.user) return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  const userId = (s.user as any).id;

  const db = await getMongoDb();
  const { entryId } = await req.json().catch(() => ({}));

  const entry = entryId
    ? await db.collection("journalentries").findOne({ _id: new ObjectId(entryId), userId })
    : await db.collection("journalentries").find({ userId }).sort({ createdAt: -1 }).limit(1).next();

  if (!entry) return NextResponse.json({ ok:false, error:"No journal entry found" }, { status:404 });

  const a = analyze(entry.content || "");
  const ins = {
    entryId: entry._id,
    userId,
    mood: a.mood,
    sentimentScore: a.sentimentScore,
    topics: [],
    extract: {},
    primePrompts: [a.prompt],
    primeSuggestions: [],
    createdAt: new Date(),
  };
  const r = await db.collection("primeinsights").insertOne(ins);
  return NextResponse.json({ ok:true, insight:{ _id:r.insertedId, ...ins } }, { status:201 });
}
