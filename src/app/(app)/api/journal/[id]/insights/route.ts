import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import PrimeInsight from '@/models/PrimeInsight';


export async function GET(_: Request, { params }: { params: { id: string } }) {
await dbConnect();
const insight = await PrimeInsight.findOne({ entryId: params.id }).lean();
return NextResponse.json({ insight });
}