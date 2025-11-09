// src/app/api/pulse/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getDb } from "@/lib/mongo";
import { isSignedIn } from "@/lib/demo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

/** Simple journal sentiment + nudge prompt */
function analyze(t: string) {
  const txt = (t || "").toLowerCase();
  const pos = [
    "great",
    "grateful",
    "good",
    "progress",
    "win",
    "joy",
    "happy",
    "love",
  ];
  const neg = [
    "stressed",
    "overwhelmed",
    "anxious",
    "sad",
    "angry",
    "worried",
    "tired",
    "lost",
  ];
  let score = 0;
  for (const w of pos) if (txt.includes(w)) score++;
  for (const w of neg) if (txt.includes(w)) score--;
  const mood = score > 0 ? "positive" : score < 0 ? "negative" : "neutral";
  const prompt =
    mood === "negative"
      ? "Take one small step you can control. What is it?"
      : mood === "positive"
        ? "Momentum is up—what tiny action compounds it today?"
        : "What would make today 1% better?";
  return { mood, sentimentScore: score, prompt };
}

async function generateElementPrompt({
  mood,
  streak,
  trend,
  userId,
  lastAction,
}: {
  mood: string;
  streak: number;
  trend: string;
  userId: string;
  lastAction?: string;
}) {
  // Placeholder — plug real user context later
  const userElements: string[] = [];
  return `Your ${mood} energy is growing. With a ${streak}-day streak, let's build on ${userElements[0] || "your light"}.`;
}

function norm(score: number): number {
  return Math.max(0, Math.min(1, (score + 8) / 16)); // assuming -8..+8
}

function mapMoodToAura(
  mood: string
): "calm" | "excited" | "reflective" | "stressed" | "neutral" {
  const map: Record<string, any> = {
    positive: "excited",
    negative: "stressed",
    neutral: "reflective",
  };
  return map[mood] || "neutral";
}

function calculateStreak(entries: any[]): number {
  // TODO: implement real streak logic
  return entries.length >= 3 ? 3 : entries.length;
}

function getTrend(moods: string[]): "rising" | "falling" | "steady" {
  if (moods.length < 2) return "steady";
  const recent = moods.slice(0, 3);
  const positiveCount = recent.filter((m) => m === "positive").length;
  return positiveCount >= 2
    ? "rising"
    : positiveCount === 0
      ? "falling"
      : "steady";
}

function toneFromText(text: string) {
  const t = (text || "").toLowerCase();
  let tone: "calm" | "excited" | "reflective" | "stressed" | "neutral" =
    "neutral";
  if (/[!?]{2,}/.test(t) || /(wow|let's go|on fire)/.test(t)) tone = "excited";
  else if (/(thank|grateful|breathe|peace)/.test(t)) tone = "calm";
  else if (/(hmm|thinking|reflect|journal)/.test(t)) tone = "reflective";
  else if (/(stressed|anxious|worried|help)/.test(t)) tone = "stressed";
  return tone;
}

/**
 * GET /api/pulse
 * - Demo payload when not signed in
 * - Live pulse from latest journal insight when signed in (stubbed)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!isSignedIn(session)) {
      return NextResponse.json({
        demo: true,
        pulse: {
          mood: "demo",
          energy: 0.72,
          ts: Date.now(),
          hint: "Sign in for live Prime Pulse",
        },
      });
    }

    const userId = (session!.user as any).id as string;
    const db = await getDb();

    // Pull recent entries for streak/trend calc
    const entries = await db
      .collection("journalentries")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .toArray();

    const streak = calculateStreak(entries);
    const moodHistory = entries
      .slice(0, 7)
      .map((e) => analyze(e.content || "").mood);
    const trend = getTrend(moodHistory);

    const latest = entries[0];
    let a = {
      mood: "neutral",
      sentimentScore: 0,
      prompt: "What matters to you most right now?",
    };

    if (latest) a = analyze(latest.content || "");

    const prompt = await generateElementPrompt({
      mood: a.mood,
      streak,
      trend,
      userId,
      lastAction: (entries[0] as any)?.tags?.[0],
    });

    return NextResponse.json({
      demo: false,
      pulse: {
        mood: a.mood,
        strength: norm(a.sentimentScore),
        streak,
        trend,
        prompt,
        aura: mapMoodToAura(a.mood),
        glowIntensity: norm(a.sentimentScore),
        ts: Date.now(),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pulse
 * Modes:
 *  - Tone check (no auth required): { text }
 *  - Create insight (auth): { entryId? } -> analyzes specified or latest entry
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as any;
    const { text, entryId } = body || {};

    // Tone-only flow (no auth required)
    if (typeof text === "string" && !entryId) {
      const tone = toneFromText(text);
      return NextResponse.json({ tone });
    }

    // Insight creation flow (auth required)
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = (session.user as any).id as string;
    const db = await getDb();

    // Fetch target entry: explicit by id, else latest
    const entry = entryId
      ? await db
          .collection("journalentries")
          .findOne({ _id: new ObjectId(entryId), userId })
      : await db
          .collection("journalentries")
          .find({ userId })
          .sort({ createdAt: -1 })
          .limit(1)
          .next();

    if (!entry) {
      return NextResponse.json(
        { ok: false, error: "No journal entry found" },
        { status: 404 }
      );
    }

    const a = analyze(entry.content || "");
    const ins = {
      entryId: entry._id,
      userId,
      mood: a.mood,
      sentimentScore: a.sentimentScore,
      topics: [] as string[],
      extract: {} as Record<string, unknown>,
      primePrompts: [a.prompt],
      primeSuggestions: [] as string[],
      createdAt: new Date(),
    };

    const r = await db.collection("primeinsights").insertOne(ins);
    return NextResponse.json(
      { ok: true, insight: { _id: r.insertedId, ...ins } },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
