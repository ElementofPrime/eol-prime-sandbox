// src/app/(app)/api/chat/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { grok } from '@/lib/grok';
import { primesystemPrompt } from '@/lib/prime/primePrompt';
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { message } = await req.json();

    const completion = await grok.chat.completions.create({
        model: 'grok-3-mini',
        messages: [
            { role: 'system', content: primesystemPrompt },
            { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300
    });

    return NextResponse.json({
        reply: completion.choices[0].message.content
    });
}