import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { isSignedIn } from "@/lib/demo";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isSignedIn(session)) {
    return NextResponse.json({
      demo: true,
      items: [
        {
          id: "demo-a",
          title: "Getting started with Prime",
          preview: "What can you do?",
        },
        {
          id: "demo-b",
          title: "Journaling prompts",
          preview: "Help me reflect on today…",
        },
      ],
    });
  }
  // TODO: return user’s chat threads from DB
  return NextResponse.json({ demo: false, items: [] });
}
