'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import socket from "./lib/connection"

export default function Home() {
  const [userName, setUserName] = useState('')
  const [hasUserName, setHasUserName] = useState(true)
  const router = useRouter()

  function redirect(btnName) {
    if(userName) {
      console.log("Emitting username")
      socket.emit('username', {userName, });
      socket.on('approved username', () => {
        if(btnName == 'create') {
          router.push(`/createroom?user=${userName}`)
        } else if(btnName == 'join') {
          router.push(`/joinroom?user=${userName}`)
        }
      })

      socket.on('duplicate username', (payload) => {
        setHasUserName(`Username ${payload.userName} aready exists.`)
      })
      
    } else {
      console.log("no hello")
        setHasUserName(`Please enter a username`)
    }
  }

  return (
    <div className="flex flex-col justify-center h-screen w-max mx-auto">
      <div className="flex flex-col gap-3 justify-center items-center border-2 rounded-md border-black w-[20vw] min-w-[256px] h-[50vh] mt-8 p-5">
        <span className='font-bold text-2xl mb-3 text-center'>Enter your Username</span>
        <input className="focus:outline-none focus:bg-neutral-100 w-full px-3 py-1 border-2 rounded-sm border-black"
          type="text" name="userName" placeholder="Enter your User name..." value={userName} onChange={(e) => {setUserName(e.target.value)}}/>
        {!hasUserName ? '' : <span>{hasUserName}</span>}
        <button className="text-white font-semibold rounded-[4px] bg-black border-2 border-white px-3 py-1 w-max
        hover:text-black hover:bg-white hover:border-black" onClick={() => redirect('create')}>Create Room</button>
        <button className="text-white font-semibold rounded-[4px] bg-black border-2 border-white px-3 py-1 w-max
        hover:text-black hover:bg-white hover:border-black" onClick={() => redirect('join')}>Join Room</button>
      </div>
    </div>
  )
}
