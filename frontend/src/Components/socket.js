// socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  autoConnect: false, // Connect only when needed
  transports: ["websocket"], // Force WebSocket for better real-time reliability
});

export default socket;
