import { config } from 'config/index';
import mongoose from 'mongoose';

export const connectToDatabase = async (): Promise<void> => {
  try {
    const uri = config.mongoDbUri;
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
