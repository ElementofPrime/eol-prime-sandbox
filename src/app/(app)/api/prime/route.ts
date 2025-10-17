import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const stream = await openai.chat.completions.create({
    model: "gpt-5-thinking",
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
      } catch (err) {
        controller.error(err);
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
}
