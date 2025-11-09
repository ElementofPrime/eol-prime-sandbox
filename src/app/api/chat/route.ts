import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { xai } from "@/lib/xai";
import { PRIME_SYSTEM_PROMPT } from "@/lib/primePrompt";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message } = await req.json();

  const create = xai.chat.completions.create as (options: {
    model: string;
    messages: Array<{ role: string; content: string }>;
  }) => Promise<any>;

  // ... existing code
}
