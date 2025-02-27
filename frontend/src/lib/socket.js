import { io } from "socket.io-client";


const token = localStorage.getItem("accessToken"); // If you are storing token in localStorage

export const socket = io("http://localhost:3000/api", {
  auth: {
    token: token,
  },
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});
