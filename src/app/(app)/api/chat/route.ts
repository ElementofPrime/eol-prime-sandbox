import { NextResponse } from "next/server";
import { primeSystemPrompt } from "@/lib/primePrompt";
import type { ChatMessage } from "@/types/chat";

export const runtime = "nodejs"; // switch to "edge" when we stream

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    const body = {
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: primeSystemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
    };

    const r = await fetch(`${process.env.OPENAI_BASE_URL ?? "https://api.openai.com"}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const text = await r.text();
      return NextResponse.json({ error: `Upstream error: ${text}` }, { status: 500 });
    }

    const json = await r.json();
    const content = json.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ content });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
