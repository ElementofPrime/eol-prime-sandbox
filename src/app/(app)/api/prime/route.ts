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

function buildGuestCookieHeader(value: GuestCookie): string {
  const encoded = encodeURIComponent(JSON.stringify(value));
  // lax + 1 day, path=/ so all routes see it
  return `eol_guest_chat=${encoded}; Path=/; Max-Age=86400; SameSite=Lax`;
}

/** Read the guest cookie (await cookies() in Next 15 route handlers) */
async function readGuestCookie(): Promise<GuestCookie> {
  const jar = await cookies();
  const raw = jar.get("eol_guest_chat")?.value ?? "";
  try {
    const decoded = raw ? JSON.parse(decodeURIComponent(raw)) : null;
    if (decoded && typeof decoded.date === "string" && typeof decoded.count === "number") {
      return decoded as GuestCookie;
    }
  } catch {}
  return { date: "", count: 0 };
}

// --- route -----------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // ---------- Guest limiter (5/day, UTC) ----------
    let setCookieHeader: string | null = null;

    if (!session?.user) {
      const today = new Date().toISOString().slice(0, 10);
      const store = await readGuestCookie();
      const count = store.date === today ? store.count : 0;

      if (count >= 5) {
        // Re-send the existing cookie value so the browser keeps it for the day
        const header = buildGuestCookieHeader({ date: today, count });
        return new NextResponse(
          JSON.stringify({
            ok: false,
            error: "Guest chat limit reached. Create a free account for full access.",
          }),
          {
            status: 429,
            headers: {
              "content-type": "application/json; charset=utf-8",
              "cache-control": "no-store",
              "set-cookie": header,
            },
          }
        );
      }

      // Increment immediately and attach Set-Cookie to the response we’ll return
      setCookieHeader = buildGuestCookieHeader({ date: today, count: count + 1 });
    }
    // ------------------------------------------------

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

    // Build streaming response, optionally with Set-Cookie for guest tracking
    const headers: Record<string, string> = {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    };
    if (setCookieHeader) headers["Set-Cookie"] = setCookieHeader;

    return new NextResponse(readable, { status: 200, headers });
  } catch (err: any) {
    console.error("prime route error:", err?.status, err?.message || err);
    return NextResponse.json(
      {
        ok: false,
        error: `Prime API error: ${err?.status ?? "unknown"} – ${err?.message ?? String(err)}`,
      },
      { status: 500 }
    );
  }
}