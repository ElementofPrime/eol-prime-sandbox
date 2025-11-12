// /src/lib/demo.ts
import { cookies } from "next/headers";
import { DEMO_CHAT_LIMIT } from "@/constants"; // ← Already imported

export { DEMO_CHAT_LIMIT }; // ← ADD THIS LINE

export async function getDemoCounters() {
  const store = await cookies();
  const used = Number(store.get("eol_demo_chats_used")?.value ?? "0");
  return { used, remaining: Math.max(DEMO_CHAT_LIMIT - used, 0) };
}

export async function incrementDemoChats() {
  const store = await cookies();
  const current = Number(store.get("eol_demo_chats_used")?.value ?? "0");
  store.set("eol_demo_chats_used", String(current + 1));
}
