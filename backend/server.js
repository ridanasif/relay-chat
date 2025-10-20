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

app.use(express.json());
app.use(cors());

connect();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use("/auth", authRouter);

app.get("/users", authMiddleware, async (req, res) => {
  try {
    const username = req.user.username;
    const users = await User.find({ username: { $ne: username } }).select(
      "username fullname"
    ); // Select username,fullname of all users except the current logged in user
    return sendResponse(res, { success: true, data: users });
  } catch (err) {
    console.log(err);
    return sendResponse(res, { success: false, message: "Error fetching users" });
  }
});

app.get("/messages", authMiddleware, async (req, res) => {
  try {
    const userOne = req.user.username;
    const { userTwo } = req.query;
    const messages = await Message.find({
      $or: [
        { from: userOne, to: userTwo },
        { from: userTwo, to: userOne },
      ],
    }).select("from to message"); // Select username,fullname of all users except the current logged in user
    return sendResponse(res, { success: true, data: messages });
  } catch (err) {
    console.log(err);
    return sendResponse(res, { success: false, message: "Error fetching messages" });
  }
});

io.on("connection", (socket) => socketController(io, socket));

const PORT = process.env.PORT || 5050;

httpServer.listen(PORT, () =>
  console.log(`Server started running on port ${PORT}`)
);
