import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

let chats = []
let rooms = []
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
})

io.on("connection", (socket) => {
  console.log("User connected:", [socket.id])

  socket.on("disconnect", () => {
    console.log("User disconnected:", [socket.id])
  })

  socket.on("create room", (room) => {
    console.log("Room", [room], "created by", [socket.id])
    //socket.emit("join room", room);
    rooms.push(room)
  })

  socket.on("join room" , (Room) => {
    if(rooms.includes(Room)) {
      console.log("Room", [Room], "joined  by", [socket.id])
      socket.join(Room);
      socket.emit("join room", Room);
    } else {
      socket.emit("room not found");
    }
  })

  socket.on("chat", (payload) => {
    chats.push(payload)
    console.log("Chats:", chats)
    io.to(payload.room).emit("chat", chats.filter((chats) => payload.room === chats.room))
  })
})

server.listen(5000, () => {
  console.log("Server is listening at port 5000")
});
