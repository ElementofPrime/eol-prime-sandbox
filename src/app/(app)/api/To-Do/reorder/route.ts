// src/app/(app)/api/T-Do/reorder/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/db";
import To-Do from "@/models/To-Do";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ ok: false }, { status: 401 });

  const { items } = await req.json();

  await dbConnect();

  const bulkOps = items.map(({ id, order }: { id: string; order: number }) => ({
    updateOne: {
      filter: { _id: id, userId: session.user.id },
      update: { $set: { order } },
    },
  }));

  await To-Do.bulkWrite(bulkOps);

  return NextResponse.json({ ok: true });
}
