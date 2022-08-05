import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL_LOCAL;

if (!MONGO_URL) {
  throw new Error(
    "Please define the MONGO_URL environment variable inside .env.local"
  );
}

type cachedMongoose = {
  conn: typeof mongoose;
  promise: Promise<typeof mongoose>;
};

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose as cachedMongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

function close() {
  if (cached.conn) return cached.conn.disconnect();
}

export default { connect, close };
