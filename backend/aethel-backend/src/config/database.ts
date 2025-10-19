import mongoose from 'mongoose';
import ENV from '@/config';

/**
 * Connects to MongoDB using Mongoose with proper error handling and logging.
 */
export const connectDB = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    console.log(ENV.MONGODB_URI);
    await mongoose.connect(ENV.MONGODB_URI);

    console.log(' MongoDB connected successfully');
  } catch (error) {
    console.error(' MongoDB connection failed:', error);
    process.exit(1); 
  }
};
