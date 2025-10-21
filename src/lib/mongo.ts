import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("Missing MONGODB_URI");

let client: MongoClient | null = null;
let promise: Promise<MongoClient> | null = null;

export const mongoClientPromise = (async () => {
  if (client) return client;
  if (!promise) {
    promise = (async () => {
      const c = new MongoClient(uri, { maxPoolSize: 5 });
      await c.connect();
      client = c;
      return c;
    })();
  }
  return promise;
})();

export async function getMongoDb() {
  const c = await mongoClientPromise;
  return c.db(process.env.MONGODB_DB || "eol");
}
