// src/app/(app)/api/journal/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { getDb } from "@/lib/mongo";
import { authOptions } from "@/lib/authOptions";
import { PRIME_SYSTEM_PROMPT } from '@/lib/primePrompt';

// --- GROK IMPORT ---
const GROK_API_KEY = process.env.GROK_API_KEY;

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";
// export const revalidate = 0;
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  const page = parseInt(new URL(req.url).searchParams.get('page') || '1', 10);
  const limit = 20;
  const skip = (page - 1) * limit;

  const items = await db
    .collection("journalentries")
    .find({ userId: (session.user as any).id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await db.collection("journalentries").countDocuments({ userId: (session.user as any).id });

  return NextResponse.json({ ok: true, items, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  const { content, mood, tags } = await req.json();

  if (!content?.trim()) return NextResponse.json({ ok: false, error: "Content required" }, { status: 400 });

  const doc = {
    userId: (session.user as any).id,
    content: content.trim(),
    mood: mood || null,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const r = await db.collection("journalentries").insertOne(doc);

  // ——— GROK PRIME NUDGE ———
  let nudge = null;
  if (GROK_API_KEY) {
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-3-mini',
          messages: [
            {
              role: 'system',
              content: PRIME_SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: `Analyze journal: "${content}". Return JSON: {nudge: "2-sentence Prime insight"}`
            }
          ],
          temperature: 0.7,
          max_tokens: 100
        })
      });

      if (response.ok) {
        const data = await response.json();
        const output = data.choices?.[0]?.message?.content;
        try {
          const parsed = JSON.parse(output);
          nudge = parsed.nudge;
        } catch {
          nudge = output?.trim();
        }
      }
    } catch (err) {
      console.warn('Grok nudge failed:', err);
      // Silent fail — never break journal save
    }
  }

  return NextResponse.json(
    { ok: true, item: { _id: r.insertedId, ...doc, nudge } },
    { status: 201 }
  );
}