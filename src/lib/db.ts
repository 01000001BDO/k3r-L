import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

interface MongooseConnection {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  var mongooseConnection: MongooseConnection | undefined;
}

const globalMongoose = global.mongooseConnection;
let cached: MongooseConnection = globalMongoose || {
  conn: null,
  promise: null,
};

if (!globalMongoose) {
  global.mongooseConnection = cached;
}

export async function connecterDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}