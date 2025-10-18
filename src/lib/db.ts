// Mongoose connection (single source of truth)
import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI in environment');

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache:
    | { conn: Mongoose | null; promise: Promise<Mongoose> | null }
    | undefined;
}

const cached =
  global.mongooseCache || (global.mongooseCache = { conn: null, promise: null });

export async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
