import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { app, server, io } from "./lib/socket.js";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

import cors from "cors";
import cookieParser from "cookie-parser";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
const PORT = process.env.PORT || 3000;
import { connectDB } from "./lib/db.js";
app.use(express.json());
app.use(express.static("public"));

server.listen(PORT, () => {
  console.log("Server is running on port 3000");
  connectDB();
});

import router from "./routes/auth.js";

app.use("/api/user", router);

import messageRouter from "./routes/messages.js";

app.use("/api/messages", messageRouter);
