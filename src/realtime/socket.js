const { Server } = require("socket.io");
const logger = require("../utils/logger");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" } 
  });

  io.on("connection", (socket) => {
    logger.info({ message: "User connected", socketId: socket.id });

    socket.on("joinBoard", (boardId) => {
      try {
        const room = `board:${boardId}`;
        socket.join(room);
        logger.info({ message: "User joined board room", socketId: socket.id, boardId, room });
      } catch (error) {
        logger.error({ message: "Failed to join board room", socketId: socket.id, boardId, error: error.message, stack: error.stack });
      }
    });

    socket.on("disconnect", (reason) => {
      logger.info({ message: "User disconnected", socketId: socket.id, reason });
    });

    socket.on("error", (error) => {
      logger.error({ message: "Socket error", socketId: socket.id, error: error.message, stack: error.stack });
    });
  });
};

const getIO = () => {
  if (!io) {
    logger.error({ message: "Socket.io not initialized" });
    throw new Error("Socket not initialized");
  }
  return io;
};

module.exports = { initSocket, getIO };