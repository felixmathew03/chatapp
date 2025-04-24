import express from "express";
import connection from "./connection.js";
import env from "dotenv";
import router from "./router.js";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

env.config();

const app = express();
const server = http.createServer(app); // Create HTTP server from Express app

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend origin
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", (data) => {
    // Broadcast the message to all other clients
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Express middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/api", router);

// Connect to DB and start server
connection()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
