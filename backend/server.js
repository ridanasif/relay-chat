import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connect } from "./config/db.js";
import authRouter from "./router/authRouter.js";
import socketController from "./controller/socketController.js";
import cors from "cors";
import User from "./model/User.js";
import { sendResponse } from "./utils/sendResponse.js";
import Message from "./model/Message.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
// Enable CORS for frontend requests
app.use(cors());

// Connect to MongoDB
connect();

const httpServer = createServer(app);

// Initialize Socket.io server with CORS settings
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Mount authentication routes
app.use("/auth", authRouter);

// Route to fetch all users except the current logged-in user
app.get("/users", authMiddleware, async (req, res) => {
  try {
    const username = req.user.username;
    const users = await User.find({ username: { $ne: username } }).select(
      "username fullname"
    ); // Only select username and fullname
    return sendResponse(res, { success: true, data: users });
  } catch (err) {
    console.log(err);
    return sendResponse(res, {
      success: false,
      message: "Error fetching users",
    });
  }
});

// Route to fetch messages between the logged-in user and another user
app.get("/messages", authMiddleware, async (req, res) => {
  try {
    const userOne = req.user.username;
    const { userTwo } = req.query;
    const messages = await Message.find({
      $or: [
        { from: userOne, to: userTwo },
        { from: userTwo, to: userOne },
      ],
    }).select("from to message"); // Only select sender, receiver, and message
    return sendResponse(res, { success: true, data: messages });
  } catch (err) {
    console.log(err);
    return sendResponse(res, {
      success: false,
      message: "Error fetching messages",
    });
  }
});

// Handle Socket.io connections
io.on("connection", (socket) => socketController(io, socket));

// Start server
const PORT = process.env.PORT || 5050;
httpServer.listen(PORT, () =>
  console.log(`Server started running on port ${PORT}`)
);
