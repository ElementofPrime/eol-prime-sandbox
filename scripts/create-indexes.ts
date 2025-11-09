// scripts/create-indexes.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 1) Resolve and load .env.* FIRST (local dev). Vercel already injects envs.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidates = [
  path.resolve(__dirname, "../.env.local"),
  path.resolve(__dirname, "../.env"),
];

const dotenvPath = candidates.find((p) => fs.existsSync(p));
if (dotenvPath) {
  const { config } = await import("dotenv");
  config({ path: dotenvPath });
  console.log(`🔑 Loaded env from ${path.basename(dotenvPath)}`);
} else {
  console.log("🔑 No local .env file (OK). Using process.env only.");
}

// 2) NOW that envs are loaded, import runtime modules that read them.
const { dbConnect } = await import("../src/lib/db"); // named export
const { default: JournalEntry } = await import("../src/models/JournalEntry");
const { default: PrimeInsight } = await import("../src/models/PrimeInsight");

// 3) Validate env (defensive)
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing after dotenv load.");
  process.exit(1);
}

// 4) Create indexes
async function run() {
  try {
    await dbConnect();

    const res1 = await JournalEntry.collection.createIndex(
      { content: "text", tags: "text" },
      { weights: { content: 10, tags: 5 }, name: "journal_search" }
    );
    console.log("✅ JournalEntry index:", res1);

    // Optional examples:
    // await PrimeInsight.collection.createIndex({ userId: 1, createdAt: -1 }, { name: "user_createdAt" });
    await PrimeInsight.collection.createIndex(
      { entryId: 1 },
      { unique: true, name: "entry_unique" }
    );
  } catch (err: any) {
    console.error("❌ Index creation failed:", err?.message ?? err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

await run();
