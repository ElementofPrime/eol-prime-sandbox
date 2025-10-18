'use client';
import { useEffect, useState } from 'react';
import { getPrimePulse, Pulse } from '@/lib/prime/pulse';


export default function PrimePulseTile() {
const [pulse, setPulse] = useState<Pulse | null>(null);
useEffect(() => { getPrimePulse().then(setPulse); }, []);
if (!pulse) return (
<div className="rounded-2xl p-4 shadow border border-slate-800/20">Prime is listening…
</div>
);
return (
<div className="rounded-2xl p-4 shadow border border-slate-800/20">
<div className="text-sm opacity-70">Prime Pulse</div>
<div className="text-2xl font-semibold mt-1">Mood: {pulse.mood}</div>
<div className="mt-3 text-base">{pulse.prompt}</div>
</div>
);
}