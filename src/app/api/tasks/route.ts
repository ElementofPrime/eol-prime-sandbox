// src/app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { clientPromise } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("eol_prime_dev");

    const tasks = await db
      .collection("tasks")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Tasks GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, dueDate } = await request.json();
  if (!title) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("eol_prime_dev");

    const result = await db.collection("tasks").insertOne({
      userId: session.user.id,
      title,
      dueDate: dueDate ? new Date(dueDate) : null,
      completed: false,
      createdAt: new Date(),
    });

    return NextResponse.json({
      id: result.insertedId,
      title,
      dueDate,
      completed: false,
    });
  } catch (error) {
    console.error("Tasks POST error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
