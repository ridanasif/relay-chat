import mongoose from "mongoose";

// Create Message Schema
const msgSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

// Create Model Out Of The Schema
const Message = mongoose.model("Message", msgSchema);

export default Message;
