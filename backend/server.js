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
  });

  socket.on("message", (message) => {
    let user = users.get(socket.id) || "Anonymous";
    let m = { id: socket.id, user, message };
    messages.push(m);
    io.emit("message", m);
  });

  socket.on("disconnect", function () {
    users.delete(socket.id);
  });
});

httpServer.listen(5050, () =>
  console.log("Server started running on port 5050")
);
