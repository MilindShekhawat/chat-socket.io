'use client'
import React from 'react'
import { useState, useEffect } from "react"
import socket from '../lib/connection'
import { useSearchParams } from 'next/navigation'

export default function chatroom() {
  const [message, setMessage] = useState('')
  const [userName, setUserName] = useState('')
  const [messageArray, setMessageArray] = useState([])
  const searchParams = useSearchParams()
  const room = searchParams.get('room')
  
  const sendMessage = (e) => {
    e.preventDefault()
    console.log(userName)
    socket.emit('chat', {message , userName, room})
    setMessage('')
  }

  useEffect(() => {
    socket.on('chat', (chats) => {
      setMessageArray(chats)
      console.log("Messages----", chats)
    })
  }, [])
  
  return (
    <div className="flex flex-col items-center border-2 rounded-md border-black w-[30vw] min-w-fit h-[95vh] mx-auto my-4">
      <h1 className="font-bold text-3xl m-5">Chat</h1>
      {messageArray.map((payload, index) => (
        <div key={index} className="flex justify-between border-y-2 border-black my-2 w-full">
          <span className="px-3 py-1">
            {payload.message}
          </span>
          <span className="px-3 py-1 text-white font-semibold bg-black">
            {payload.userName}
          </span>
        </div>
        ))}
      <form className="flex flex-col gap-3 w-full mt-auto" onSubmit={sendMessage}>
        <div className="flex border-y-2 border-black">
          <input className="px-3 py-1 focus:outline-none focus:bg-neutral-100 w-full" 
          type="text" name="chat" placeholder="Enter message..." value={message} onChange={(e) => setMessage(e.target.value)} />
          <button className="text-white font-semibold bg-black px-3 py-1" type="submit">Send</button>
        </div>
        <input className="px-3 pt-1 mb-1 border-t-2 border-black focus:outline-none focus:bg-white active:bg-white" 
        type="text" name="user" placeholder="Enter your name..." value={userName} onChange={(e) => setUserName(e.target.value)} />
      </form>
    </div>
  )
}
