export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import PrimeInsight from "@/models/PrimeInsight";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await ctx.params;
  const insight = await PrimeInsight.findOne({ entryId: id }).lean();
  return NextResponse.json({ insight });
}
