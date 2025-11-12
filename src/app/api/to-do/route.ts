// src/app/api/to-do/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { clientPromise } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("eol_prime_dev");

    const items = await db
      .collection("todo_items")
      .find({ userId: session.user.id })
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json({ items });
  } catch (error) {
    console.error("To-do GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title } = await request.json();
  if (!title) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("eol_prime_dev");

    const maxOrder = await db
      .collection("todo_items")
      .find({ userId: session.user.id })
      .sort({ order: -1 })
      .limit(1)
      .toArray();

    const order = maxOrder.length > 0 ? maxOrder[0].order + 1 : 0;

    const result = await db.collection("todo_items").insertOne({
      userId: session.user.id,
      title,
      order,
      completed: false,
      createdAt: new Date(),
    });

    return NextResponse.json({
      id: result.insertedId,
      title,
      order,
      completed: false,
    });
  } catch (error) {
    console.error("To-do POST error:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
