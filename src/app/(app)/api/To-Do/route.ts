// src/app/(app)/api/To-Do/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/db";
import ToDo from "@/models/ToDo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );

  await dbConnect();
  const items =
    (await To) -
    Do.find({ userId: session.user.id })
      .sort({ done: 1, createdAt: -1 })
      .limit(100)
      .lean();

  return NextResponse.json({ ok: true, items });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );

  const { title } = await req.json();
  if (!title?.trim())
    return NextResponse.json(
      { ok: false, error: "Title required" },
      { status: 400 }
    );

  await dbConnect();
  const doc =
    new To() -
    Do({
      userId: session.user.id,
      title: title.trim(),
      done: false,
      createdAt: new Date(),
    });
  await doc.save();

  return NextResponse.json({ ok: true, item: doc.toObject() }, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );

  const { id, done } = await req.json();
  if (!id)
    return NextResponse.json(
      { ok: false, error: "id required" },
      { status: 400 }
    );

  await dbConnect();
  (await To) -
    Do.updateOne(
      { _id: id, userId: session.user.id },
      { $set: { done: !!done } }
    );

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );

  const { id } = await req.json();
  if (!id)
    return NextResponse.json(
      { ok: false, error: "id required" },
      { status: 400 }
    );

  await dbConnect();
  (await To) - Do.deleteOne({ _id: id, userId: session.user.id });

  return NextResponse.json({ ok: true });
}
