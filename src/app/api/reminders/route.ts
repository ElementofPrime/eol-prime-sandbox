// src/app/api/reminders/route.ts
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

    const reminders = await db
      .collection("reminders")
      .find({ userId: session.user.id, dismissed: false })
      .sort({ triggerAt: 1 })
      .toArray();

    return NextResponse.json({ reminders });
  } catch (error) {
    console.error("Reminders GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reminders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, triggerAt } = await request.json();
  if (!message || !triggerAt) {
    return NextResponse.json(
      { error: "Message and triggerAt required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("eol_prime_dev");

    const result = await db.collection("reminders").insertOne({
      userId: session.user.id,
      message,
      triggerAt: new Date(triggerAt),
      dismissed: false,
      createdAt: new Date(),
    });

    return NextResponse.json({ id: result.insertedId, message, triggerAt });
  } catch (error) {
    console.error("Reminders POST error:", error);
    return NextResponse.json(
      { error: "Failed to create reminder" },
      { status: 500 }
    );
  }
}
