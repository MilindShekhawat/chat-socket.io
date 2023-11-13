import express from "express"
import { createServer } from "node:http"
import { Server } from "socket.io"

let chats = []
let rooms = []
let users = {}
const COLORS = [
  "text-white",
  "text-blue-400",
  "text-lime-400",
  "text-gray-400",
  "text-red-400",
  "text-teal-400",
  "text-purple-500",
  "text-pink-400",
  "text-green-400",
  "text-yellow-400",
]
//TODO Add COLOR property to user.
const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
  },
})

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })

  socket.on("username", (payload) => {
    //  Check if username exists. If it does not then add it.
    if (!users.hasOwnProperty(payload.userName)) {
      console.log("USERNAME- NEW USER")
      console.log(socket.id, "granted payload", payload)
      users[payload.userName] = { roomId: null }
      console.log(users)
      console.log("New User", payload)
      socket.emit("approved username")
    }
    //  If it does and its not in a room then let it be.
    else if (users.hasOwnProperty(payload.userName) && users[payload.userName] == { roomId: null }) {
      console.log("USERNAME - EXISTING USER")
      console.log("Existing User", payload)
      socket.emit("approved username")
    }
    // //TODO getting called unintentionally
    // else if (users.hasOwnProperty(payload.userName) && users[payload.userName].roomId == payload.roomId) {
    //   console.log("USERNAME -EXISTING USER IN A ROOM")
    //   console.log("User in Room", payload)
    //   socket.emit("approved username")
    // }
    //Else deny request for that username
    else {
      console.log("USERNAME - ELSE")
      console.log(socket.id, "already has", payload)
      socket.emit("duplicate username", payload)
    }
  })

  socket.on("create room", (payload) => {
    //  Creates a room id only.
    console.log("CREATE ROOM")
    console.log("Room", payload.room, "created by", payload.userName)
    rooms.push(payload.room)
  })

  socket.on("join room", (payload) => {
    // Checks if a room exists. If it does then let the users join.
    if (rooms.includes(payload.roomId)) {
      // If a user is not in any other room then they join.
      if (users[payload.userName].roomId == null || users[payload.userName].roomId == payload.roomId) {
        console.log("JOIN ROOM - ROOM EXISTS")
        // Give the newly joined user a color
        if (users[payload.userName].color == null) {
          const userColor = COLORS.pop()
          users[payload.userName].color = userColor
        }
        users[payload.userName].roomId = payload.roomId
        console.log(users)
        console.log("User joined", payload)
        socket.join(payload.roomId)
        socket.emit("join room", payload)
      }
      // if they are then do not.
      else {
        console.log("JOIN ROOM - USER IN DIFFERENT ROOM")
        console.log("User", payload.userName, "is already in room", [payload.roomId])
        //TODO Currently no reference to this event on frontend
        socket.emit("already in room")
      }
    }
    // If there is no room, then return this.
    else {
      console.log("JOIN ROOM - ROOM DOES NOT EXIST")
      console.log("Room", payload.roomId, "not found.")
      socket.emit("room not found")
    }
  })
  socket.on("chat", (payload) => {
    if (payload.userName != null) {
      const color = users[payload.userName].color
      chats.push({ ...payload, color })
    }
    console.log("Chats:", chats)
    io.to(payload.roomId).emit(
      "chat",
      chats.filter((chats) => payload.roomId === chats.roomId)
    )
  })
})

server.listen(5000, () => {
  console.log("Server is listening at port 5000")
})
