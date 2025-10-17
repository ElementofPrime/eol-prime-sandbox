"use client";
import useSWR from "swr";


export default function PrimePulseTile(){
const { data } = useSWR("/api/journal", (u)=>fetch(u).then(r=>r.json()));
const count = data?.length ?? 0;
return (
<div className="rounded-2xl border p-4 shadow-sm">
<div className="text-sm opacity-70">Prime Pulse</div>
<div className="text-3xl font-semibold mt-1">{count}</div>
<div className="text-sm opacity-70">entries processed</div>
</div>
);
}