"use client"
import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import back from "../img/back.png"
import socket from "../lib/connection"
import { useRouter, useSearchParams } from "next/navigation"
import { nanoid } from "nanoid"

export default function createroompage() {
  const [roomId, setRoomId] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const userName = searchParams.get("user")

  function createRoom() {
    const room = nanoid()
    setRoomId(room)
    socket.emit("create room", { userName, room })
  }

  function joinRoom() {
    console.log(`Room ${roomId} joined`)
    socket.emit("join room", { userName, roomId })
    router.push(`/chatroom?user=${userName}&room=${roomId}`)
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
        <span className='font-bold text-2xl mb-3'>Create Room</span>
        <button
          className='text-white font-semibold rounded-[4px] bg-black border-2 border-white px-3 py-1 w-max
                  hover:text-black hover:bg-white hover:border-black'
          onClick={() => createRoom()}>
          Create Room
        </button>
        {roomId == "" ? (
          ""
        ) : (
          <>
            <div className='text-center'>
              <span className='font-semibold block'>Your Room id is: </span>
              <span className='block'>{roomId}</span>
            </div>
            <button
              className='text-white font-semibold rounded-sm bg-black border-2 border-white px-3 py-1 w-max
                          hover:text-black hover:bg-white hover:border-black'
              onClick={() => joinRoom()}>
              Join Room
            </button>
          </>
        )}
      </div>
    </div>
  )
}
