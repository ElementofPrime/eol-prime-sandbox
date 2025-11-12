// src/lib/mongo.ts — FINAL
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let clientPromise: Promise<MongoClient>;

if (!uri) {
  console.log("MONGODB_URI not set — DEMO MODE");
  const mockDb = {
    collection: () => ({
      findOne: async () => null,
      insertOne: async () => ({ insertedId: "mock-id" }),
      updateOne: async () => ({ modifiedCount: 1 }),
      deleteOne: async () => ({ deletedCount: 0 }),
      bulkWrite: async () => ({ modifiedCount: 0 }),
      find: () => ({
        sort: () => ({
          limit: () => ({
            toArray: async () => [],
          }),
        }),
      }),
    }),
    command: async () => ({ ok: 1 }),
  };
  const mockClient = { db: () => mockDb } as unknown as MongoClient;
  clientPromise = Promise.resolve(mockClient);
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export { clientPromise };
