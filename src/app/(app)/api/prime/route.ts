export const runtime = "nodejs";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { openai } from "@/lib/openai";

const MODEL = process.env.PRIME_MODEL || "gpt-4o-mini";

// --- helpers ---------------------------------------------------------------

type GuestCookie = { date: string; count: number };

function readGuestCookie(): GuestCookie {
  const raw = cookies().get("eol_guest_chat")?.value ?? "";
  try {
    const obj = JSON.parse(raw);
    if (typeof obj?.date === "string" && typeof obj?.count === "number") {
      return obj as GuestCookie;
    }
  } catch {}
  return { date: "", count: 0 };
}

function writeGuestCookie(value: GuestCookie) {
  cookies().set("eol_guest_chat", JSON.stringify(value), {
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: "lax",
  });
}

// --- route -----------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // ------------------ GUEST LIMITER (5/day) ------------------
    if (!session?.user) {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
      const store = readGuestCookie();
      const count = store.date === today ? store.count : 0;

      if (count >= 5) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Guest chat limit reached. Create a free account for full access.",
          },
          { status: 429 }
        );
      }

      // increment usage immediately (before model call)
      writeGuestCookie({ date: today, count: count + 1 });
    }
    // -----------------------------------------------------------

    const { messages = [] } = await req.json().catch(() => ({}));
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ ok: false, error: "No messages" }, { status: 400 });
    }

    // ---- OpenAI streaming ----
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

    return new NextResponse(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("prime route error:", err?.status, err?.message || err);
    return NextResponse.json(
      {
        ok: false,
        error: `Prime API error: ${err?.status ?? "unknown"} – ${err?.message ?? String(
          err
        )}`,
      },
      { status: 500 }
    );
  }
}
