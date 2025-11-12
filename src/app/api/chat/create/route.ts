import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {
  DEMO_CHAT_LIMIT,
  getDemoCounters,
  incrementDemoChats,
} from "@/lib/demo";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json().catch(() => ({}));
  const { content } = body ?? {};

  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  if (!session?.user) {
    const { used } = await getDemoCounters();
    if (used >= DEMO_CHAT_LIMIT) {
      return NextResponse.json(
        { error: "Demo limit reached" },
        { status: 403 }
      );
    }
    await incrementDemoChats();
    return NextResponse.json({
      demo: true,
      reply: `Demo mode reply to: "${content}". Sign in to enable memory and persistent threads.`,
    });
  }

  return NextResponse.json({
    demo: false,
    reply: `Authed reply to: "${content}"`,
  });
}
