"use client";

import useCanvas from "@/hooks/useCanvas";
import { HexColorPicker } from "react-colorful";
import useWindow from "@/hooks/useWindow";
import { MENU_DATA } from "@/utils/libs";
import { TypeSelectableMenu } from "@/utils/type";
import { useState } from "react";

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
  const {
    canvasRef,
    setSelectedTool,
    selectedTool,
    setIsFloodFill,
    isFloodFill,
    currentColor,
    setCurrentColor,
    setPredefinedColor
  } = useCanvas(8, 8, 50);
  const { windowDim } = useWindow();

  return (
    <main className="h-screen w-full bg-[#F3EEE3] relative flex items-center justify-center">
      <Navbar />

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

      <section className="h-24 w-1/3 bg-[#D9D0BE] absolute bottom-0 left-0 right-0 mx-auto z-[999] flex justify-around">
        <section
          onClick={() => setSelectedTool("pencil")}
          className={`w-20 h-full bg-red-300 ${selectedTool === "pencil" && "-translate-y-3"}`}
        >
          PENCIL
        </section>
        <section
          onClick={() => setSelectedTool("eraser")}
          className={`w-20 h-full bg-red-300 ${selectedTool === "eraser" && "-translate-y-3"}`}
        >
          ERASER
        </section>
        <section
          onClick={() => setSelectedTool("bucket")}
          className={`w-20 h-full bg-red-300 ${selectedTool === "bucket" && "-translate-y-3"}`}
        >
          BUCKET
        </section>
      </section>
    </main>
  );
}

function Navbar() {
  const [selectedMenu, setSelectedMenu] = useState<TypeSelectableMenu>("none");
  MENU_DATA;

  return (
    <nav className="p-5 w-full h-14 bg-[#D9D0BE] font-bold font-mono absolute top-0 flex space-x-5 items-center z-[999] select-none">
      <section className="relative">
        <h1
          className={`cursor-pointer ${selectedMenu === "file" && "text-[#8D75F1]"}`}
          onClick={() => {
            if (selectedMenu === "none") setSelectedMenu("file");
            else setSelectedMenu("none");
          }}
        >
          FILE
        </h1>
        <div
          className={`absolute bg-[#F3EEE3] border border-black w-48 px-5 py-3 ${selectedMenu !== "file" && "hidden"}`}
        >
          <h1 className="text-black hover:text-[#8D75F1] cursor-pointer">
            New File
          </h1>
          <h1 className="text-black hover:text-[#8D75F1] cursor-pointer">
            Export
          </h1>
          <h1 className="text-black hover:text-[#8D75F1] cursor-pointer">
            Exit
          </h1>
        </div>
      </section>

      <section className="relative">
        <h1
          className={`cursor-pointer ${selectedMenu === "edit" && "text-[#8D75F1]"}`}
          onClick={() => {
            if (selectedMenu === "none") setSelectedMenu("edit");
            else setSelectedMenu("none");
          }}
        >
          EDIT
        </h1>
        <div
          className={`absolute bg-[#F3EEE3] border border-black w-48 px-5 py-3 ${selectedMenu !== "edit" && "hidden"}`}
        >
          <h1 className="text-black hover:text-[#8D75F1] cursor-pointer">
            Undo
          </h1>
          <h1 className="text-black hover:text-[#8D75F1] cursor-pointer">
            Redo
          </h1>
        </div>
      </section>

      <section className="relative">
        <h1
          className={`cursor-pointer ${selectedMenu === "help" && "text-[#8D75F1]"}`}
          onClick={() => {
            if (selectedMenu === "none") setSelectedMenu("help");
            else setSelectedMenu("none");
          }}
        >
          HELP
        </h1>
      </section>
    </nav>
  );
}
