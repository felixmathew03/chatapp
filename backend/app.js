import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connection from "./connection.js";
import router from "./routes/router.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// 🔹 Socket.IO setup
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on("sendMessage", (data) => {
    // send only to the intended receiver
    socket.to(data.receiverId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// 🔹 Express setup
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/api", router);

// 🔹 Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  if (process.env.NODE_ENV === "development") console.error(err.stack);
  res.status(err.status || 500).json({
    msg: err.message || "Server error",
  });
});

// 🔹 Connect DB and start server
connection()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((error) => console.error("❌ DB Connection failed:", error));

// 🔹 Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down gracefully...");
  await mongoose.connection.close();
  server.close(() => {
    console.log("✅ Server closed.");
    process.exit(0);
  });
});
