'use client'
import React, { useState } from 'react'
import Link from "next/link"
import Image from 'next/image'
import back from '../img/back.png'
import socket from '../lib/connection'
import { useRouter } from 'next/navigation'

export default function joinroompage() {
  const [roomId, setRoomId] = useState('')
  const [hasRoom, setHasRoom] = useState('')
  const router = useRouter()

  function joinRoom() {
    console.log('Joining room:', roomId);
    socket.emit('join room', roomId);

    socket.on('join room', (room) => {
      console.log(`Room ${room} joined`);
      router.push(`/chatroom?room=${room}`)
    })
    socket.on('room not found', () => {
      console.log(`Room is not available.`);
      setHasRoom(`This room is not available.`)
    })
  }

  return (
    <div className="flex flex-col justify-center h-screen w-max mx-auto">
      <Link href="./" className="self-start pr-3 pb-2 hover:text-neutral-600">
        <Image src={back} height={20} width={20} className='inline'/>
        <span className='align-middle ml-1'>Home</span>
      </Link>
      <div className="flex flex-col gap-3 justify-center items-center border-2 rounded-md border-black w-[20vw] min-w-[256px] h-[50vh] p-5">
        <span className='font-bold text-2xl mb-3'>Join Room</span>
        <input className="focus:outline-none focus:bg-neutral-100 w-full px-3 py-1 border-2 rounded-sm border-black"
          type="text" name="roomid" placeholder="Enter Room Id..." value={roomId} onChange={(e) => {setRoomId(e.target.value)}}/>
        <button className="text-white font-semibold rounded-sm bg-black border-2 border-white px-3 py-1 w-max
          hover:text-black hover:bg-white hover:border-black" onClick={() => joinRoom()}>
          Join Room
        </button>
        {
          !hasRoom ? '' :
          <span>{hasRoom}</span> 
        }
      </div>
    </div>
  )
}
