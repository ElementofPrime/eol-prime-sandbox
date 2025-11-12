// /src/app/api/demo/status/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  const isAuthed = !!session?.user; // ← REAL AUTH

  return NextResponse.json({ isAuthed });
}
