import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn('MONGO_URI is not set in the environment. Continuing without database connection.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    console.warn('Continuing without database connection. API routes that require MongoDB will fail until the database is reachable.');
    return false;
  }
};

export default connectDB;
