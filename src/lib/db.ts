// src/lib/db.ts
import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";

// --- DEBUG OVERRIDE FOR SCRIPT ---
if (process.env.NODE_ENV !== "production" && !process.env.MONGODB_URI) {
  console.log("MONGODB_URI not found in env — forcing from .env.local");
  const envPath = path.resolve(process.cwd(), ".env.local");
  const raw = fs.readFileSync(envPath, "utf-8");
  const lines = raw.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("MONGODB_URI=")) {
      const parts = trimmed.split("=");
      let uri = parts.slice(1).join("=").trim();
      if (uri.startsWith('"') && uri.endsWith('"')) {
        uri = uri.slice(1, -1);
      } else if (uri.startsWith("'") && uri.endsWith("'")) {
        uri = uri.slice(1, -1);
      }
      process.env.MONGODB_URI = uri;
      console.log("Forced MONGODB_URI:", uri ? "YES" : "NO");
      break;
    }
  }
}
// --- END DEBUG ---

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}
interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}
let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect(): Promise<mongoose.Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
