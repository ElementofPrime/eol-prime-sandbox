import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasMongoUri = !!process.env.MONGODB_URI;
  try {
    await dbConnect();
    return NextResponse.json({ ok: true, env: { MONGODB_URI: hasMongoUri } }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, env: { MONGODB_URI: hasMongoUri }, error: e?.message }, { status: 500 });
  }
}
