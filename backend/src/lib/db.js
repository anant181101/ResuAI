import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) throw new Error('MONGODB_URI missing');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: 'resuai' });
  return mongoose.connection;
}
