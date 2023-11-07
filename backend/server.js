import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

let chats = []
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
})

io.on("connection", (socket) => {
  console.log("User connected", socket.id)

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });

  socket.on("chat", (payload) => {
    chats.push(payload)
    console.log("Chats:", chats)
    io.emit("chat", chats)
  })
})

server.listen(5000, () => {
  console.log("Server is listening at port 5000")
});
