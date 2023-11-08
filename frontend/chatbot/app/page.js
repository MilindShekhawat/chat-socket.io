import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col justify-center h-screen w-max mx-auto">
      <div className="flex flex-col gap-3 justify-center items-center border-2 rounded-md border-black w-[20vw] min-w-[256px] h-[50vh] mt-8 p-5">
        <Link href="./createroom" 
        className="font-bold text-2xl text-center text-neutral-100 bg-black rounded-sm w-44 p-2 border-2 border-white
                  hover:text-black hover:bg-white hover:border-black">
          Create Room
        </Link>
        <Link href="./joinroom"   
        className="font-bold text-2xl text-center text-neutral-100 bg-black rounded-sm w-44 p-2 border-2 border-white
                  hover:text-black hover:bg-white hover:border-black">
          Join Room
        </Link>
      </div>
    </div>
  )
}
