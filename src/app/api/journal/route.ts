// src/app/api/journal/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/db";
import JournalEntry from "@/models/JournalEntry";
import { PRIME_SYSTEM_PROMPT } from "@/lib/primePrompt";
import { z } from "zod";

const GROK_API_KEY = process.env.GROK_API_KEY;

const JournalSchema = z.object({
  content: z.string().min(1).max(5000),
  mood: z.enum(["positive", "negative", "neutral"]).optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  // DEMO MODE (signed out): return sample payload
  if (!session?.user?.id) {
    return NextResponse.json({
      demo: true,
      items: [
        {
          _id: "demo-1",
          title: "Welcome to Element of Life",
          content: "Start journaling your wins.",
          createdAt: Date.now() - 86_400_000,
        },
        {
          _id: "demo-2",
          title: "Prime nudges",
          content: "Try a 2-minute reflection.",
          createdAt: Date.now() - 43_200_000,
        },
      ],
      page: 1,
      totalPages: 1,
      note: "Create an account to save entries, sync insights, and unlock memory.",
    });
  }

  await dbConnect();

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    JournalEntry.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    JournalEntry.countDocuments({ userId: session.user.id }),
  ]);

  return NextResponse.json({
    ok: true,
    demo: false,
    items,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();

  const body = await req.json();
  const parsed = JournalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { content } = parsed.data;

  // ——— GROK PRIME ANALYSIS ———
  let analysis: { mood?: string; tags?: string[]; nudge?: string } = {};

  if (GROK_API_KEY) {
    try {
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "grok-3-mini",
          messages: [
            { role: "system", content: PRIME_SYSTEM_PROMPT },
            {
              role: "user",
              content:
                `Analyze: "${content}". Return JSON: ` +
                `{ "mood": "positive|negative|neutral", "tags": ["tag1"], "nudge": "2-sentence insight" }`,
            },
          ],
          temperature: 0.7,
          max_tokens: 120,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const output = data.choices?.[0]?.message?.content || "";
        try {
          analysis = JSON.parse(output);
        } catch {
          analysis.nudge = output.trim();
        }
      }
    } catch (err) {
      console.warn("Grok analysis failed:", err);
      // Non-blocking
    }
  }

  const doc = new JournalEntry({
    userId: session.user.id,
    content: content.trim(),
    mood: analysis.mood || null,
    tags: Array.isArray(analysis.tags) ? analysis.tags : [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await doc.save();

  return NextResponse.json(
    {
      ok: true,
      item: {
        ...doc.toObject(),
        _id: doc._id.toString(),
        nudge: analysis.nudge || null,
      },
    },
    { status: 201 }
  );
}
