import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = new Map(); 

export function getReceiverSocketId(userId) {
  return userSocketMap[userId] || null;
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId || userId === "undefined") {
    console.log("❌ Invalid userId received:", userId);
    return;
  }

  console.log("✅ A user connected:", socket.id, "with userId:", userId);

  userSocketMap.set(userId, socket.id);
  console.log("🔵 Online Users:", [...userSocketMap.keys()]);

  io.emit("getOnlineUsers", [...userSocketMap.keys()]);

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);

    if (userSocketMap.has(userId)) {
      userSocketMap.delete(userId);
      console.log("🔴 Updated Online Users:", [...userSocketMap.keys()]);
      io.emit("getOnlineUsers", [...userSocketMap.keys()]);
    }
  });
});


export { io, app, server };
