import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {
  DEMO_CHAT_LIMIT,
  getDemoCounters,
  incrementDemoChats,
  isSignedIn,
} from "@/lib/demo";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json().catch(() => ({}));
  const { content } = body ?? {};

  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  if (!isSignedIn(session)) {
    const { used } = getDemoCounters();
    if (used >= DEMO_CHAT_LIMIT) {
      return NextResponse.json(
        {
          demo: true,
          error: "Demo limit reached",
          message: "Create an account to unlock unlimited chats and memory.",
        },
        { status: 403 }
      );
    }
    incrementDemoChats();
    // Return a lightweight demo echo
    return NextResponse.json({
      demo: true,
      reply: `Demo mode reply to: "${content}". Sign in to enable memory and persistent threads.`,
    });
  }

  // TODO: Real chat handling for authed users (store to DB, call model, etc.)
  return NextResponse.json({
    demo: false,
    reply: `Authed reply to: "${content}"`,
  });
}
