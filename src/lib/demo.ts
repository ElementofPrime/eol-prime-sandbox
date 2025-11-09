import { cookies } from "next/headers";

export const DEMO_CHAT_LIMIT = 5;

export function isSignedIn(session: any) {
  return Boolean(session?.user?.id || session?.user?.email);
}

export function getDemoCounters() {
  const store = cookies();
  const used = Number(store.get("eol_demo_chats_used")?.value ?? "0");
  return { used, remaining: Math.max(DEMO_CHAT_LIMIT - used, 0) };
}

export function incrementDemoChats() {
  const store = cookies();
  const used = Number(store.get("eol_demo_chats_used")?.value ?? "0") + 1;
  // Cookie scope: 7 days, HTTP-only
  store.set("eol_demo_chats_used", String(used), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  return used;
}
