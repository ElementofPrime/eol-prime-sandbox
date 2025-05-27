import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Missing OpenAI API Key' }, { status: 500 });
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are Prime, a wise and encouraging guide from Element of Life. Speak with warmth, insight, and purpose.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    const data = await res.json();

    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error('[CHAT_API_ERROR]', err);
    return NextResponse.json({ error: 'Failed to fetch from OpenAI' }, { status: 500 });
  }
}
