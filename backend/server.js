import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
})

io.on("connection", (socket) => {
  console.log("User connected")

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on("chat", (payload) => {
    console.log("Payload:", payload)
    io.emit("chat", payload)
  })
})

server.listen(5000, () => {
  console.log("Server is listening at port 5000")
});
