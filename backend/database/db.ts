import mongoose from "mongoose";
import "dotenv/config";

const uri: string = process.env.MONGODB_URI as string;

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(uri, {});
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
