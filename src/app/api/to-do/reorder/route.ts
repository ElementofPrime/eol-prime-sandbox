// src/app/api/to-do/reorder/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { clientPromise } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // ← NO PRERENDER

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items } = await request.json();
  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("eol_prime_dev");

    const bulkOps = items.map((item: any, index: number) => ({
      updateOne: {
        filter: { _id: item.id, userId: session.user.id },
        update: { $set: { order: index } },
      },
    }));

    await db.collection("todo_items").bulkWrite(bulkOps);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("To-do reorder error:", error);
    return NextResponse.json({ error: "Failed to reorder" }, { status: 500 });
  }
}
