import Message from "../model/Message.js";

const users = new Map(); // username -> {socketid1, socketid2}
const sockets = new Map(); // socket_id -> username

const socketController = async (io, socket) => {
  socket.on("register", (username) => {
    const isNewUser = !users.has(username);
    if (isNewUser) {
      users.set(username, new Set());
    }
    users.get(username).add(socket.id);
    sockets.set(socket.id, username);

    // Send the current list ONLY to the newly connected socket
    socket.emit("activeUsersUpdate", Array.from(users.keys()));

    // broadcast the new full list to everyone else
    socket.broadcast.emit("activeUsersUpdate", Array.from(users.keys()));
  });

  socket.on("message", async ({ from, to, message }) => {
    try {
      let m = { from, to, message };

      const fromSockets = users.get(from);
      if (fromSockets) {
        fromSockets.forEach((socketId) => {
          io.to(socketId).emit("message", m);
        });
      }

      const toSockets = users.get(to);
      if (toSockets) {
        toSockets.forEach((socketId) => {
          io.to(socketId).emit("message", m);
        });
      }

      const newMessage = new Message(m);
      await newMessage.save();
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", function () {
    const username = sockets.get(socket.id);
    if (!username) return;

    // Remove this socket ID from that user's active set
    const socketSet = users.get(username);
    if (socketSet) {
      socketSet.delete(socket.id);
      if (socketSet.size === 0) {
        // No sockets open for the user anymore. This means the user is offline
        users.delete(username);
        // Broadcast the update list to everyone
        io.emit("activeUsersUpdate", Array.from(users.keys()));
      }
    }

    // Clean up the reverse map
    sockets.delete(socket.id);
  });
};

export default socketController;
