import mongoose from "mongoose";

// Function to connect to MongoDB using Mongoose
export const connect = async () => {
  try {
    // Attempt to connect using connection string from environment variables
    await mongoose.connect(process.env.MONGODB_CONN);
    console.log("MongoDB Connection Successful!");
  } catch (error) {
    // Log error if connection fails and exit the process
    console.error("Couldn't connect to MongoDB", error);
    process.exit(1); // exit with failure
  }
};
