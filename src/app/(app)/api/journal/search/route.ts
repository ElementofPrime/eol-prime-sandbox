// src/app/(app)/api/journal/search/route.ts
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/db";
import JournalEntry from "@/models/JournalEntry";
import { json, error } from "@/lib/http";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return error("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return json({ items: [] });

  await dbConnect();

  const items = await JournalEntry.find({
    userId: session.user.id,
    $text: { $search: q },
  })
    .sort({ score: { $meta: "textScore" } })
    .limit(20)
    .lean();

  return json({ items: items.map((i) => ({ ...i, _id: i._id.toString() })) });
}
