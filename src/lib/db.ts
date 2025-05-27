import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined in environment variables');
}

let cached = global.mongoose || { conn: null, promise: null };

async function connect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'element_of_life',
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}

export default connect;
