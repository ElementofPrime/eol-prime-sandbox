// src/app/(app)/api/subscribe/route.ts
//import { NextResponse } from 'next/server';
//import Stripe from 'stripe';

//const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

//export async function POST(req: Request) {
//const { priceId } = await req.json();  // 'price_4.99_pro'

//const session = await stripe.checkout.sessions.create({
//mode: 'subscription',
//payment_method_types: ['card'],
//line_items: [{ price: priceId, quantity: 1 }],
//success_url: `${req.headers.get('origin')}/profile?success=true`,
//cancel_url: `${req.headers.get('origin')}/profile?cancel=true`,
//});

//return NextResponse.json({ url: session.url });