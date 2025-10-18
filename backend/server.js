import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const users = new Map();
const messages = [];

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", function (socket) {
  socket.on("register", (username) => {
    users.set(socket.id, username);
    socket.emit("history", messages);
    console.log(users);
  });

  socket.on("message", (message) => {
    let user = users.get(socket.id);
    messages.push({ user, message });
    io.emit("message", { user, message });
  });

  socket.on("disconnect", function () {
    users.delete(socket.id);
    console.log(users);
  });
});

httpServer.listen(5050, () =>
  console.log("Server started running on port 5050")
);
