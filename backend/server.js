import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

let chats = []
let rooms = []
let users = {}
//TODO Add COLOR property to user.
const COLORS = []
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
//  Check if username exists. If it does not then add it.
    if(!users.hasOwnProperty(payload.userName)) {
      let id = 1;
      console.log([socket.id], "granted payload", payload)
      users[payload.userName] = {id: id++, room:null}
      console.log("New User", payload);
      socket.emit("approved username",)
    } 
//  If it does and its not in a room then let it be.
    else if(users.hasOwnProperty(payload.name) && users[payload.userName] == {room:null}) { 
      console.log("Existing User", payload);
      socket.emit("approved username",)
    }
    else if(users.hasOwnProperty(payload.name) && users[payload.userName].room == payload.roomId) { 
      console.log("User in Room", payload);
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
  })

  socket.on("join room" , (payload) => {
//  Checks if a room exists. If it does then let the users join.
    if(rooms.includes(payload.roomId)) {
//    If a user is not in any other room then they join.
      if(users[payload.userName].room == null || users[payload.userName].room == payload.roomId) {
        users[payload.userName].room = payload.roomId
        console.log("User joined", payload);
        socket.join(payload.roomId);
        socket.emit('join room', payload)
      }
//    if they are then do not.
      else {
        console.log("User", [payload.userName], "is already in room", [payload.roomId])
        //TODO Currently no reference to this event on frontend
        socket.emit("already in room")
      }
    }
//  If there is no room, then return this.
    else {
      console.log("Room", [payload.roomId], "not found.")
      socket.emit("room not found")
    }
  })
  socket.on("chat", (payload) => {
    if(payload.userName != null) {
      chats.push(payload)
    }
    console.log("Chats:", chats)
    io.to(payload.roomId).emit("chat", chats.filter((chats) => payload.roomId === chats.roomId))
  })
})

server.listen(5000, () => {
  console.log("Server is listening at port 5000")
});
