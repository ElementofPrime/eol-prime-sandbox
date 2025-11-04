// scripts/create-indexes.ts
import { fileURLToPath } from "url";
import path from "path";
import { config } from "dotenv";
import { resolve } from "path";
import fs from "fs";

// 1. HARD CODE PATH
const envPath = "C:/Dev/EOL_Main/.env.local";
console.log("🔍 Looking for .env.local at:", envPath);

// 2. CHECK FILE EXISTS
if (!fs.existsSync(envPath)) {
  console.error("❌ .env.local NOT FOUND at path!");
  process.exit(1);
}
console.log("✅ .env.local FOUND");

// 3. READ RAW FILE
const raw = fs.readFileSync(envPath, "utf-8");
console.log("📄 Raw file content:\n", raw);

// 4. PARSE MANUALLY
const lines = raw.split("\n");
const env: Record<string, string> = {};

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//")) continue;
  const [key, ...valueParts] = trimmed.split("=");
  const value = valueParts.join("=").trim();
  if (key && value) {
    env[key.trim()] = value;
  }
}

console.log("🔑 Parsed ENV keys:", Object.keys(env));
console.log("MONGODB_URI =", env.MONGODB_URI ? "YES" : "NO");

// 5. SET process.env
Object.assign(process.env, env);

console.log(
  "✅ process.env.MONGODB_URI =",
  process.env.MONGODB_URI ? "YES" : "NO"
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { dbConnect } from "../src/lib/db.js";
import JournalEntry from "../src/models/JournalEntry.js";

async function run() {
  try {
    await dbConnect();
    const result = await JournalEntry.collection.createIndex(
      {
        content: "text",
        tags: "text",
      },
      {
        weights: { content: 10, tags: 5 },
        name: "journal_search",
      }
    );
    console.log("Text index created:", result);
  } catch (err: any) {
    console.error("Index creation failed:", err.message || err);
  } finally {
    process.exit(0);
  }
}

run();
