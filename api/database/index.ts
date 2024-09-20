import { config } from 'config/config';
import mongoose from 'mongoose';

export const connectToDatabase = async (): Promise<void> => {
  try {
    const uri = config.mongoDbUri;
    if (!uri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
