'use client'
import React from 'react'
import { useState, useEffect } from "react"
import socket from '../lib/connection'
import { useSearchParams } from 'next/navigation'

export default function chatroom() {
  const [message, setMessage] = useState('')
  const [messageArray, setMessageArray] = useState([])
  const searchParams = useSearchParams()
  const room = searchParams.get('room')
  const userName = searchParams.get('user')
  
  const sendMessage = (e) => {
    //e.preventDefault()
    console.log(userName)
    socket.emit('chat', {message , userName, room})
    console.log("got data")
    socket.on('chat', (chats) => {
      setMessageArray(chats)
      console.log("Messages----", chats)
    })
    setMessage('')
  }

  useEffect(() => {
    console.log("got data")
    socket.on('chat', (chats) => {
      setMessageArray(chats)
      console.log("Messages----", chats)
    })
  }, [])
  
  return (
    <div className="flex flex-col border-2 border-black rounded-md w-[30vw] min-w-[320px] h-[95vh] mx-auto my-4">
      <div className='flex flex-col gap-3 p-3'>
            {/* style */}
            <div  className="flex flex-col w-fit max-w-xs bg-black rounded-md border-2 border-black">
              <span className="pl-2 pr-3 text-yellow-400 text-sm font-bold">
                payload.userName
              </span>
              <span className="bg-white pl-2 pr-3 py-1 rounded-[4px]">
                payload.message
              </span>
            </div>
        <div className="flex flex-col max-w-xs bg-black rounded-md border-2 border-black self-end">
          {/* <div className="pl-2 pr-3 w-max text-red-400 text-sm font-bold">
            Milind
          </div> */}
          <div className="bg-white pl-2 pr-3 py-1 rounded-[4px]">
            User 2's message.
          </div>
        </div>
        {messageArray.map((payload, index) => (
          <div key={index} className="flex flex-col w-fit max-w-xs bg-black rounded-md border-2 border-black">
            <span className="pl-2 pr-3 text-yellow-400 text-sm font-bold">
              {payload.userName}
            </span>
            <span className="bg-white pl-2 pr-3 py-1 rounded-[4px]">
              {payload.message}
            </span>
          </div>
          ))}
      </div>

      <div className="flex gap-[3px] w-full mt-auto bg-black pt-[2px]">
        <input className="px-3 py-1 focus:outline-none focus:bg-neutral-100 w-full rounded-[4px]" 
        type="text" name="chat" placeholder="Enter message..." value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="px-3 py-1 text-white font-semibold bg-black rounded-[4px]" onClick={() => sendMessage()}>Send</button>
      </div>
    </div>
  )
}
