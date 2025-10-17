import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";

// Start with Node for easier debugging; we can flip to "edge" after it's green.
export const runtime = "edge";

const MODEL = process.env.PRIME_MODEL || "gpt-4o-mini";

export async function POST(req: NextRequest) {
  try {
    const { messages = [] } = await req.json();

    // Call a model you have access to
    const stream = await openai.chat.completions.create({
      model: MODEL,
      messages,
      stream: true,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk?.choices?.[0]?.delta?.content ?? "";
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });
    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("No messages", { status: 400 });
    }
  } catch (err: any) {
    // Bubble helpful error info to the client (and your terminal)
    console.error("prime route error:", err?.status, err?.message || err);
    return new Response(
      `Prime API error: ${err?.status ?? "unknown"} – ${err?.message ?? err}`,
      { status: 500 },
    );
  }
}
