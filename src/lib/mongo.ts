import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("MONGODB_URI is not set");

let _client: MongoClient;
let _clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _eolMongoPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._eolMongoPromise) {
    _client = new MongoClient(uri);
    global._eolMongoPromise = _client.connect();
  }
  _clientPromise = global._eolMongoPromise!;
} else {
  _client = new MongoClient(uri);
  _clientPromise = _client.connect();
}

/** For NextAuth adapter */
export const mongoClientPromise: Promise<MongoClient> = _clientPromise;

/** For your app/api routes */
export async function getDb(dbName = "eol"): Promise<Db> {
  const c = await _clientPromise;
  return c.db(dbName);
}
