import { MongoClient, Db } from "mongodb";

// TS: env vars can be undefined; assert + guard so the type is string.
const MONGODB_URI = process.env.MONGODB_URI as string | undefined;
if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment");
}
const DB_NAME = (process.env.MONGODB_DB as string | undefined) ?? "eol";

// Cache across hot reloads (Next.js dev)
let _client: MongoClient | null = null;
let _promise: Promise<MongoClient> | null = null;

async function getClient(): Promise<MongoClient> {
  if (!_promise) {
    // After the guard above, cast to string for the constructor.
    _client = new MongoClient(MONGODB_URI as string);
    _promise = _client.connect();
  }
  return _promise;
}

/** Preferred helper */
export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(DB_NAME);
}

/** Back-compat alias so existing imports keep working */
export async function dbConnect(): Promise<Db> {
  return getDb();
}
