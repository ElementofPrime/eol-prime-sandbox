// /src/app/api/chat/list/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Define chat structure — Prime's memory
interface Chat {
  id: string;
  title: string;
  createdAt: string;
  lastMessage?: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Fetch from DB — typed!
  const chats: Chat[] = []; // ← EXPLICIT TYPE

  return NextResponse.json({ chats });
}
