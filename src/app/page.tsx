"use client";
import useCanvas from "@/hooks/useCanvas";
import { useState } from 'react'

export default function Home() {
  const [isFloodFill, setIsFloodFill] = useState(false)
  const { canvasRef } = useCanvas(8, 8, 50, isFloodFill);

  return (
    <main className="h-screen w-full bg-[#F3EEE3] relative flex items-center justify-center">
      <nav className="p-5 w-full h-14 bg-[#D9D0BE] font-bold font-mono absolute top-0 flex space-x-5 items-center z-[999]">
        <h1 className="cursor-pointer hover:text-[#B7A7F0]">FILE</h1>
        <h1 className="cursor-pointer hover:text-[#B7A7F0]">EDIT</h1>
        <h1 className="cursor-pointer hover:text-[#B7A7F0]">HELP</h1>
      </nav>

      <canvas
        ref={canvasRef}
        height={window.innerHeight}
        width={window.innerWidth}
        className="bg-black"
      ></canvas>
      <button className="text-white absolute bottom-0 right-0" onClick={() => setIsFloodFill(!isFloodFill)}>{isFloodFill ? 'FILL MODE' : 'DRAW MODE'}</button>

      <section className="h-24 w-1/3 bg-[#D9D0BE] absolute bottom-0 left-0 right-0 mx-auto z-[999]"></section>
    </main>
  );
}
