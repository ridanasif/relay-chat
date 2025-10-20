import Message from "../model/Message.js";

// Maps to track connected users and their sockets
const users = new Map(); // username -> Set of socket IDs
const sockets = new Map(); // socket_id -> username

const socketController = async (io, socket) => {
  // Handle new user registration on socket connection
  socket.on("register", (username) => {
    const isNewUser = !users.has(username);
    if (isNewUser) {
      users.set(username, new Set());
    }
    users.get(username).add(socket.id); // add this socket to user's set
    sockets.set(socket.id, username); // reverse mapping for cleanup

    // Send the current active users list ONLY to this newly connected socket
    socket.emit("activeUsersUpdate", Array.from(users.keys()));

    // Broadcast the updated active users list to all other sockets
    socket.broadcast.emit("activeUsersUpdate", Array.from(users.keys()));
  });

  // Handle sending messages between users
  socket.on("message", async ({ from, to, message }) => {
    try {
      let m = { from, to, message };

      // Emit message to all sockets of sender
      const fromSockets = users.get(from);
      if (fromSockets) {
        fromSockets.forEach((socketId) => {
          io.to(socketId).emit("message", m);
        });
      }

      // Emit message to all sockets of recipient
      const toSockets = users.get(to);
      if (toSockets) {
        toSockets.forEach((socketId) => {
          io.to(socketId).emit("message", m);
        });
      }

      // Save the message to the database
      const newMessage = new Message(m);
      await newMessage.save();
    } catch (error) {
      console.log(error);
    }
  });

  // Handle socket disconnection
  socket.on("disconnect", function () {
    const username = sockets.get(socket.id);
    if (!username) return;

    // Remove this socket ID from the user's active set
    const socketSet = users.get(username);
    if (socketSet) {
      socketSet.delete(socket.id);
      if (socketSet.size === 0) {
        // If no sockets remain, user is offline; remove user from map
        users.delete(username);
        // Broadcast the updated active users list to everyone
        io.emit("activeUsersUpdate", Array.from(users.keys()));
      }
    }

    // Clean up the reverse mapping
    sockets.delete(socket.id);
  });
};

export default socketController;
