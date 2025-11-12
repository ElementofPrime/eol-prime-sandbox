import { cookies } from "next/headers";
import { DEMO_CHAT_LIMIT } from "@/constants";

export function isSignedIn(session: any) {
  return Boolean(session?.user?.id || session?.user?.email);
}

export async function getDemoCounters() {
  const store = await cookies(); // ← AWAIT THE PROMISE
  const used = Number(store.get("eol_demo_chats_used")?.value ?? "0");
  return { used, remaining: Math.max(DEMO_CHAT_LIMIT - used, 0) };
}
