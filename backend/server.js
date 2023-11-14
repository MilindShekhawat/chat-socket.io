import express from "express"
import { createServer } from "node:http"
import { Server } from "socket.io"

let chats = []
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
    let releasedColor = ""
    if (users[socket.id].hasOwnProperty("color")) {
      releasedColor = users[socket.id].color
    }
    delete users[socket.id]
    if (releasedColor != "") {
      COLORS.push(releasedColor)
    }
  })

  socket.on("username", (payload) => {
    //  Check if username exists. If it does not then add it.
    if (!isUserNameTaken(payload.userName)) {
      console.log("USERNAME- NEW USER")
      console.log(socket.id, "granted payload", payload)
      users[socket.id] = payload
      console.log("Users", users)
      socket.emit("approved username")
    }
    //  If it does and its not in a room then let it be.
    // else if (isUserNameTaken(payload.userName) && users[socket.id].roomId == null) {
    //   console.log("USERNAME - EXISTING USER")
    //   console.log("Existing User", payload)
    //   socket.emit("approved username")
    // }
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
    users[socket.id].roomId = payload.room
  })

  socket.on("join room", (payload) => {
    // Checks if a room exists. If it does then let the users join.
    if (isRoomAvailable(payload.roomId)) {
      // If a user is not in any other room then they join.
      if (users[socket.id].roomId == null || users[socket.id].roomId == payload.roomId) {
        console.log("JOIN ROOM - ROOM EXISTS")
        // Give the newly joined user a color
        if (users[socket.id].color == null) {
          const userColor = COLORS.pop()
          users[socket.id].color = userColor
        }
        const usersInRoom = Object.values(users).filter((user) => user.roomId === payload.roomId)
        if (usersInRoom.length < 10) {
          users[socket.id].roomId = payload.roomId
          console.log(users)
          console.log("User joined", payload)
          socket.join(payload.roomId)
          socket.emit("join room", payload)
        } else {
          console.log("JOIN ROOM - ROOM IS FULL")
          socket.emit("room full", payload.roomId)
        }
      }
      // if they are then do not.
      else {
        console.log("JOIN ROOM - USER IN DIFFERENT ROOM")
        console.log("User", payload.userName, "is already in room", payload.roomId)
        //TODO Currently no reference to this event on frontend
        socket.emit("already in room", payload.roomId)
      }
    }
    // If there is no room, then return this.
    else {
      console.log("JOIN ROOM - ROOM DOES NOT EXIST")
      console.log("Room", payload.roomId, "not found.")
      socket.emit("room not found", payload.roomId)
    }
  })
  socket.on("chat", (payload) => {
    if (payload.userName) {
      const color = users[socket.id].color
      chats.push({ ...payload, color })
    }
    console.log("Chats:", chats)
    io.to(payload.roomId).emit(
      "chat",
      chats.filter((chats) => payload.roomId === chats.roomId)
    )
  })
})

function isUserNameTaken(userName) {
  for (const socketid in users) {
    if (users[socketid].userName === userName) {
      return true
    }
  }
  return false
}
function isRoomAvailable(roomId) {
  for (const socketid in users) {
    if (users[socketid].roomId === roomId) {
      return true
    }
  }
  return false
}

server.listen(5000, () => {
  console.log("Server is listening at port 5000")
})
