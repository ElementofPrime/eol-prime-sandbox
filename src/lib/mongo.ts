// src/lib/mongo.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.log("MONGODB_URI not set — running in DEMO MODE (in-memory mock)");
}

let clientPromise: Promise<MongoClient>;

// === DEMO MODE: In-memory mock ===
if (!uri) {
  const mockDb = {
    collection: () => ({
      findOne: async () => null,
      insertOne: async (doc: any) => ({
        insertedId: `mock-${Date.now()}`,
        ...doc,
      }),
      updateOne: async () => ({ modifiedCount: 1 }),
      deleteOne: async () => ({ deletedCount: 1 }),
      find: () => ({
        toArray: async () => [],
      }),
    }),
  };

  const mockClient = {
    db: () => mockDb,
    close: async () => {},
  } as unknown as MongoClient;

  clientPromise = Promise.resolve(mockClient);
}
// === REAL DB: Connect ===
else {
  const client = new MongoClient(uri);
  clientPromise = client.connect().catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
}

export { clientPromise };
