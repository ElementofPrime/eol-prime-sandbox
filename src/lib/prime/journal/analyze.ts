import type { QuickExtract } from "@/models/PrimeInsight";

const POS = /(grateful|confident|excited|progress|win|blessed|joy|peace|calm)/i;
const NEG = /(stressed|anxious|worried|sad|angry|overwhelmed|tired|lost|pain)/i;

const TOPIC_MAP: Record<string, string> = {
  // loose keyword→topic
  trading: "finance",
  stock: "finance",
  crypto: "finance",
  btc: "finance",
  eth: "finance",
  spy: "finance",
  mes: "finance",
  family: "family",
  kids: "family",
  spouse: "family",
  gym: "fitness",
  workout: "fitness",
  run: "fitness",
  code: "build",
  deploy: "build",
  vercel: "build",
  mongo: "build",
  prayer: "spirit",
  church: "spirit",
  scripture: "spirit",
};

const TICKER = /\b(BTC|ETH|SOL|XRP|SUI|LINK|SPY|QQQ|ES|MES|NQ|MNQ)\b/gi;
const MONEY = /(?:\$\s?\d[\d,]*(?:\.\d{1,2})?|\d+(?:\.\d+)?%)/g;
const DATE =
  /\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\b/gi;
const ToDo = /(?:^|[\n\r])\s*(?:- \[? ?\]?|•|\*)\s+(.+)/g; // markdown bullets
const PERSON = /@([A-Za-z0-9_\.\-]+)/g; // simple handle/mention
const HASH = /#([A-Za-z0-9_\-]+)/g;

export function quickExtract(text: string): QuickExtract {
  const ToDos: string[] = [];
  const dates = (text.match(DATE) || []).map((s) => s.trim());
  const amounts = (text.match(MONEY) || []).map((s) => s.trim());
  const tickers = Array.from(
    new Set((text.match(TICKER) || []).map((s) => s.toUpperCase()))
  );
  const people = Array.from(text.matchAll(PERSON), (m) => m[1]);
  const hashtags = Array.from(text.matchAll(HASH), (m) => m[1]);
  for (const m of text.matchAll(ToDo)) ToDos.push(m[1].trim());
  return { ToDos, dates, amounts, tickers, people, hashtags };
}

export function roughSentiment(text: string): {
  mood: "positive" | "neutral" | "negative";
  score: number;
} {
  const posHits = (text.match(POS) || []).length;
  const negHits = (text.match(NEG) || []).length;
  const score = Math.max(-1, Math.min(1, (posHits - negHits) / 5));
  const mood = score > 0.2 ? "positive" : score < -0.2 ? "negative" : "neutral";
  return { mood, score };
}

export function inferTopics(text: string): string[] {
  const found = new Set<string>();
  for (const [key, topic] of Object.entries(TOPIC_MAP)) {
    const re = new RegExp(`\\b${key}\\b`, "i");
    if (re.test(text)) found.add(topic);
  }
  return Array.from(found);
}

export function makePrimePrompts({
  extract,
  topics,
}: {
  extract: QuickExtract;
  topics: string[];
}): string[] {
  const prompts: string[] = [];
  if (extract.ToDos.length)
    prompts.push(`Want me to schedule or remind: ${extract.ToDos[0]}?`);
  if (topics.includes("finance") && extract.tickers.length)
    prompts.push(`Log a trade plan for ${extract.tickers.join(", ")}?`);
  if (topics.includes("build"))
    prompts.push("Create a tiny task list to ship the next commit?");
  return prompts.length
    ? prompts
    : ["What feels most important to move forward right now?"];
}

export function makePrimeSuggestions({
  extract,
  topics,
}: {
  extract: QuickExtract;
  topics: string[];
}): string[] {
  const out: string[] = [];
  if (extract.amounts.length) out.push("Track that amount in Finance journal.");
  if (extract.dates.length)
    out.push(`Add ${extract.dates[0]} to your calendar?`);
  if (topics.includes("fitness"))
    out.push("Log a quick workout target for this week.");
  return out;
}
