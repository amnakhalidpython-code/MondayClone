import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Agar already connected hai to return kar do
    if (mongoose.connection.readyState >= 1) {
      console.log('MongoDB already connected');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('DB connection error:', error.message);
    // Serverless mein process.exit() mat use karo
    throw error; // Error throw karo instead
  }
};

export default connectDB;