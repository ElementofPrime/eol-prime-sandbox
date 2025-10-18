import mongoose, { Mongoose } from 'mongoose';

const envUri = process.env.MONGODB_URI;
if (!envUri) throw new Error('Missing MONGODB_URI in environment');
const URI: string = envUri; // now it's a concrete string

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
    cached.promise = mongoose.connect(URI);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
