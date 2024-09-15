import mongoose from "mongoose";
const mongoDbUri = process.env.MONGODB_URI!;

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoDbUri);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error,);
    process.exit(1);
  }
};
