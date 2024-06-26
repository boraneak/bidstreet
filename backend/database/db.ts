import mongoose from "mongoose";
import "dotenv/config";

const mongoDbUri: string = process.env.MONGODB_URI as string;

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoDbUri);
    console.log("\x1b[32m", "Successfully connected to MongoDB!", "\x1b[0m");
  } catch (error) {
    console.error("\x1b[31m", "Error connecting to MongoDB:", error, "\x1b[0m");
    process.exit(1);
  }
};
