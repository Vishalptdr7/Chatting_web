import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Adjust based on your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = new Map(); // Stores userId → socketId

export function getReceiverSocketId(userId) {
  return userSocketMap.get(userId) || null;
}

io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId;

  if (!userId || userId === "undefined") {
    console.log("❌ Invalid userId received:", userId);
    socket.disconnect(true); // Force disconnect to avoid ghost sockets
    return;
  }

  console.log("✅ User connected:", socket.id, "with userId:", userId);

  userSocketMap.set(userId, socket.id);
  console.log("🔵 Online Users:", [...userSocketMap.keys()]);

  io.emit("getOnlineUsers", [...userSocketMap.keys()]);

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`📌 User ${userId} joined group ${groupId}`);
  });

  socket.on("sendGroupMessage", ({ groupId, message }) => {
    console.log(`📨 Group message sent in ${groupId} by ${userId}`);
    io.to(groupId).emit("receiveGroupMessage", { sender: userId, message });
  });

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
