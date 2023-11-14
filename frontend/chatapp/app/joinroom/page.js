"use client"
import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import back from "../img/back.png"
import socket from "../lib/connection"
import { useRouter, useSearchParams } from "next/navigation"

export default function joinroompage() {
  const [roomId, setRoomId] = useState("")
  const [hasRoom, setHasRoom] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const userName = searchParams.get("user")

  function joinRoom() {
    console.log("User", userName, "is joining room:", roomId)
    socket.emit("join room", { userName, roomId })

    socket.on("join room", (payload) => {
      console.log(`Room ${payload.roomId} joined by ${payload.userName}`)
      router.push(`/chatroom?user=${payload.userName}&room=${payload.roomId}`)
    })
    socket.on("room not found", (roomId) => {
      console.log(`Room is not available.`)
      setHasRoom(`Room ${roomId} is not available.`)
    })
    socket.on("room full", (roomId) => {
      console.log(`Room is full`)
      setHasRoom(`Room ${roomId} is full`)
    })
  }

  return (
    <div className='flex flex-col justify-center h-screen w-max mx-auto'>
      <Link
        href='./'
        className='self-start pr-3 pb-2 hover:text-neutral-600'>
        <Image
          src={back}
          height={20}
          width={20}
          className='inline'
        />
        <span className='align-middle ml-1'>Home</span>
      </Link>
      <div className='flex flex-col gap-3 justify-center items-center border-2 rounded-md border-black w-[20vw] min-w-[256px] h-[50vh] p-5'>
        <span className='font-bold text-2xl mb-3'>Join Room</span>
        <input
          className='focus:outline-none focus:bg-neutral-100 w-full px-3 py-1 border-2 rounded-sm border-black'
          type='text'
          name='roomid'
          placeholder='Enter Room Id...'
          value={roomId}
          onChange={(e) => {
            setRoomId(e.target.value)
          }}
        />
        <button
          className='text-white font-semibold rounded-[4px] bg-black border-2 border-white px-3 py-1 w-max hover:text-black hover:bg-white hover:border-black'
          onClick={() => joinRoom()}>
          Join Room
        </button>
        {!hasRoom ? (
          ""
        ) : (
          <span>
            <span>{hasRoom}</span>
          </span>
        )}
      </div>
    </div>
  )
}
