import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  throw new Error("MongoDB URI not found in environment variables.");
}

export const connectDB = async (): Promise<boolean> => {
  try {
    const { connection } = await mongoose.connect(MONGO_URI);
    if (connection.readyState === 1) {
      console.log("MongoDB connected successfully");
      return Promise.resolve(true);
    } else {
      throw new Error("MongoDB connection failed");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return Promise.reject(false);
  }
};