// scripts/create-indexes.ts
import { fileURLToPath } from "url";
import path from "path";

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
