// src/app/(app)/api/prime/route.ts
export const runtime = "nodejs";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { xai, GROK_MODELS } from "@/lib/xai";
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'; // Assuming xai follows OpenAI-like types; adjust if needed.

// Define the system prompt constant
const PRIME_SYSTEM_PROMPT = "You are a helpful AI assistant. Provide accurate, concise, and relevant responses.";

// === GUEST CHAT LIMITER (5/day, UTC) ===
type GuestCookie = { date: string; count: number };

function buildGuestCookieHeader(value: GuestCookie): string {
  const encoded = encodeURIComponent(JSON.stringify(value));
  return `eol_guest_chat=${encoded}; Path=/; Max-Age=86400; SameSite=Lax; Secure; HttpOnly`;
}

async function readGuestCookie(): Promise<GuestCookie> {
  const jar = await cookies();
  const raw = jar.get("eol_guest_chat")?.value ?? "";
  try {
    const decoded = raw ? JSON.parse(decodeURIComponent(raw)) : null;
    if (decoded && typeof decoded.date === "string" && typeof decoded.count === "number") {
      return decoded;
    }
  } catch { }
  return { date: "", count: 0 };
}

// === MAIN POST HANDLER ===
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const model = body.model as string || 'chat';
    const messages: ChatCompletionMessageParam[] = body.messages || [];
    if (!session?.user && model !== 'mini') {
      return NextResponse.json({ ok: false, error: "Authenticated users only for advanced models" }, { status: 401 });
    }


    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No messages provided" },
        { status: 400 }
      );
    }

    // === GUEST LIMITER ===
    let setCookieHeader: string | null = null;

    if (!session?.user) {
      const today = new Date().toISOString().slice(0, 10);
      const { date, count } = await readGuestCookie();

      if (date === today && count >= 5) {
        setCookieHeader = buildGuestCookieHeader({ date: today, count });
        return new NextResponse(
          JSON.stringify({
            ok: false,
            error: "Guest chat limit reached (5/day). Create a free account for unlimited access.",
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
              "Set-Cookie": setCookieHeader,
            },
          }
        );
      }

      // Increment count
      setCookieHeader = buildGuestCookieHeader({
        date: today,
        count: date === today ? count + 1 : 1,
      });
    }

    // === SELECT MODEL ===
    const MODEL_MAP = {
      code: GROK_MODELS.CODE,
      deep: GROK_MODELS.DEEP,
      chat: GROK_MODELS.CHAT,
      mini: GROK_MODELS.MINI,
    } as const;

    type ModelKey = keyof typeof MODEL_MAP;
    const modelKey = (model as unknown) as ModelKey;

    const selectedModel = MODEL_MAP[modelKey] ?? MODEL_MAP.chat;

    // === STREAMING RESPONSE (Grok-powered) ===
    const stream = await xai.chat.completions.create({
      model: selectedModel,
      messages: [
        { role: "system", content: PRIME_SYSTEM_PROMPT },
        ...messages,
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content ?? "";
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    // === BUILD RESPONSE HEADERS ===
    const headers: Record<string, string> = {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "Transfer-Encoding": "chunked",
    };

    if (setCookieHeader) {
      headers["Set-Cookie"] = setCookieHeader;
    }

    return new NextResponse(readable, { status: 200, headers });
  } catch (err: any) {
    console.error("Prime API Error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: `Prime is resting. Try again soon. (${err?.message || "Unknown error"})`,
      },
      { status: 500 }
    );
  }
}