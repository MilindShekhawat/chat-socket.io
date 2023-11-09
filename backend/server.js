import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

let chats = []
let rooms = []
let users = {}
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

  socket.on("username", (payload) => {
//  Check if username exists.
    if(!users.hasOwnProperty(payload.userName)) {
      console.log([socket.id], "granted payload", payload)
      users[payload.userName] = null
      console.log("List of Users-if", [users]);
      socket.emit("approved username",)
    } 
//  If it does and its not in a room then let it be.
    else if(users.hasOwnProperty(payload.name) && users[payload.userName] == null) { 
      console.log("List of Users-elif", [users]);
      socket.emit("approved username",)
    }
//  Else deny request for that username
    else {                                    
      console.log([socket.id], "already has", [payload])
      socket.emit("duplicate username", payload)
    }
  })

  socket.on("create room", (payload) => {
//  Creates a room id only.
    console.log("Room", [payload.room], "created by", [payload.userName])
    rooms.push(payload.room)
    console.log("List of Users", [users])
  })

  socket.on("join room" , (payload) => {
//  Checks if a roomid is present in users dictionary.
    console.log("Users array", Object.values(users));
//  Checks if a room exists. If it does then let the users join.
    if(rooms.includes(payload.roomId)) {
//    If a user is not in any other room then they join.
      if(users[payload.userName] == null) {
        console.log("Room", [payload.roomId], "joined  by", [payload.userName])
        users[payload.userName] = payload.room
        socket.join(payload.roomId);
        socket.emit("join room", payload);
      }
      else {
        console.log("User", [payload.userName], "is already in room", [payload.roomId])
        socket.emit("already in room")
      }
    }
    else {
      console.log("Room", [payload.roomId], "not found.")
      socket.emit("room not found")
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
