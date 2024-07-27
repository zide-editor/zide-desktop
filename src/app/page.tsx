"use client";

import useCanvas from "@/hooks/useCanvas";
import { Point } from "@/utils/type";
import { useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

const primaryColors = [
  {
    name: "cyan",
    code: "#00FFFF",
  },
  {
    name: "red",
    code: "#FF0000",
  },
  {
    name: "green",
    code: "#00FF00",
  },
  {
    name: "blue",
    code: "#0000FF",
  },
  {
    name: "yellow",
    code: "#FFFF00",
  },
  {
    name: "magenta",
    code: "#FF00FF",
  },
];

export default function Home() {
  const [isFloodFill, setIsFloodFill] = useState(false);
  const { canvasRef, currentColor, setCurrentColor, setPredefinedColor } =
    useCanvas(8, 8, 50, isFloodFill);
  const windowDim = useRef<Point>();

  if (typeof window !== "undefined") {
    windowDim.current = { x: window.innerWidth, y: window.innerHeight };
  }

  return (
    <main className="h-screen w-full bg-[#F3EEE3] relative flex items-center justify-center">
      <nav className="p-5 w-full h-14 bg-[#D9D0BE] font-bold font-mono absolute top-0 flex space-x-5 items-center z-[999]">
        <h1 className="cursor-pointer hover:text-[#B7A7F0]">FILE</h1>
        <h1 className="cursor-pointer hover:text-[#B7A7F0]">EDIT</h1>
        <h1 className="cursor-pointer hover:text-[#B7A7F0]">HELP</h1>
      </nav>

      <canvas
        ref={canvasRef}
        height={windowDim.current?.x || 0}
        width={windowDim.current?.y || 0}
      ></canvas>

      <button
        className="text-white absolute bottom-0 right-0"
        onClick={() => setIsFloodFill(!isFloodFill)}
      >
        {isFloodFill ? "FILL MODE" : "DRAW MODE"}
      </button>

      <div className="absolute top-16 right-4 p-2 bg-white rounded-lg shadow-md">
        <HexColorPicker color={currentColor} onChange={setCurrentColor} />
        <div className="flex flex-col mt-2 justify-center">
          {primaryColors.map((color, idx) => (
            <div
              key={idx}
              onClick={() => setPredefinedColor(color.code)}
              className={`flex gap-1 items-center rounded-md py-1 ${color.code === currentColor ? "bg-black/5 " : ""}`}
            >
              <button
                className={`w-6 h-6 m-1 rounded-md cursor-pointer`}
                style={{ backgroundColor: color.code }}
              />
              <h3>{color.name}</h3>
            </div>
          ))}
        </div>
      </div>

      <section className="w-24 h-1/3 bg-[#D9D0BE] absolute top-0 bottom-0 left-0 my-auto z-[999]"></section>
      <section className="h-24 w-8/12 bg-[#D9D0BE] absolute bottom-0 left-0 right-0 mx-auto"></section>
    </main>
  );
}
