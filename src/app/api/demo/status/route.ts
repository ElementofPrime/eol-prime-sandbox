import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DEMO_CHAT_LIMIT, getDemoCounters, isSignedIn } from "@/lib/demo";

export async function GET() {
  const session = await getServerSession(authOptions);
  const authed = isSignedIn(session);
  if (authed) {
    return NextResponse.json({ demo: false, authed: true });
  }
  const { used, remaining } = getDemoCounters();
  return NextResponse.json({
    demo: true,
    authed: false,
    chatLimit: DEMO_CHAT_LIMIT,
    chatsUsed: used,
    chatsRemaining: remaining,
    note: "Create an account to unlock memory, unlimited chats, To-Dos, and Reminders.",
  });
}
