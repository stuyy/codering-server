import mongoose from 'mongoose';

export default async function() {
  const db = await mongoose.connect('mongodb://localhost:27017/intellectualdevs', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return db.connection;
}