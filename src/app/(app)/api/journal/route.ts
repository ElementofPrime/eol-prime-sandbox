import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { dbConnect } from '@/lib/db';
import JournalEntry from '@/models/JournalEntry';
import { JournalCreateSchema } from '@/lib/validation/journal';
import { json, error } from '@/lib/http';
import { NextRequest } from "next/server";
import { db } from "@/lib/mongo";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return error('Unauthorized', 401);
  await dbConnect();
  const items = await JournalEntry.find({ userId: session.user.id }).sort({ createdAt: -1 });
  return json({ items });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return error('Unauthorized', 401);

  const body = await req.json();
  const parsed = JournalCreateSchema.safeParse(body);
  if (!parsed.success) return error(parsed.error.issues[0]?.message || 'Invalid body', 422);

  await dbConnect();
  const doc = await JournalEntry.create({ ...parsed.data, userId: session.user.id });
  return json({ item: doc }, 201);
}

export {};
