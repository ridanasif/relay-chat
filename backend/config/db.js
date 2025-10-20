import mongoose from "mongoose";

export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONN);
    console.log("MongoDB Connection Successful!");
  } catch (error) {
    console.error("Couldn't connect to MongoDB", error);
    process.exit(1); // exit with failure
  }
};
