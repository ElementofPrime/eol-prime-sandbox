import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
export const runtime='nodejs'; export const dynamic='force-dynamic'; export const revalidate=0; export const fetchCache='force-no-store';

let c: MongoClient | null = null; async function D(){ if(!c){ c=new MongoClient(process.env.MONGODB_URI!); await c.connect(); } return c.db(process.env.MONGODB_DB || 'eol'); }

export async function POST(req: Request){
  const { title } = await req.json();
  if(!title?.trim()) return NextResponse.json({ ok:false, error:'Title required' }, { status:400 });
  const db = await D(); const doc = { title: title.trim(), done:false, createdAt:new Date() };
  const r = await db.collection('tasks').insertOne(doc);
  return NextResponse.json({ ok:true, item:{ _id:r.insertedId, ...doc } }, { status:201 });
}
