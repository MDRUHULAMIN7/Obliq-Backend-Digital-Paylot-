import mongoose from 'mongoose';
import config from '../config/index.js';

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: Cached | undefined;
}

const cached: Cached = global.mongooseCache ?? { conn: null, promise: null };

export default async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(config.database_url as string);
  }

  cached.conn = await cached.promise;
  global.mongooseCache = cached;
  return cached.conn;
}
