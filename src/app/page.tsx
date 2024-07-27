"use client";

import useCanvas from "@/hooks/useCanvas";
import { HexColorPicker } from "react-colorful";
import useWindow from "@/hooks/useWindow";
import { MENU_DATA } from "@/utils/libs";
import { TypeSelectableMenu } from "@/utils/type";
import { useState } from "react";
import { ArrowForward } from "@material-ui/icons";

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
  const [started, setStarted] = useState(false)
  return (
    <>
      { !started ? <StartUp setStarted={setStarted}/> : <ProjectArena/> }
    </>
  );
}

function ConfigProject ({ setStarted } : { setStarted: React.Dispatch<React.SetStateAction<boolean>>}) {
  const [name, setName] = useState("")
  const [rows, setCols] = useState(8)
  const [cols, setRows] = useState(8)

  const SubmitCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(name, rows, cols)
    setStarted(true)
  } 

  return(
    <main className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <form className="bg-white p-4 border-4 border-black" onSubmit={ (e) => SubmitCreate(e) }>
        <h2 className="text-xl font-semibold mb-4">Configure Project</h2>
        <div className="flex flex-col gap-5 justify-center items-center">

          <div className="flex items-center justify-center">
            <div className="flex justify-center items-center text-md font-semibold px-1"> Name </div>
              <input
                placeholder="Untitled"
                value={name}
                onChange={ (e) => setName(e.target.value) }
                className="w-9/11 py-2 px-3 border-2 border-black"
              />
          </div>

          <div className="flex gap-2">
            <div className="flex justify-center items-center text-md font-semibold"> Rows </div>
            <input
              type="number"
              value={rows}
              onChange={ (e) => setRows(e.target.valueAsNumber) }
              placeholder="0"
              className="w-20 py-2 px-2 border-2 border-black"
            />

            <div className="flex justify-center items-center text-md font-semibold"> Column </div>
            <input
              type="number"
              placeholder="0"
              value={cols}
              onChange={ (e) => setCols(e.target.valueAsNumber) }
              className="w-20 py-2 px-2 border-2 border-black"
            />
          </div>

          <button className="px-5 py-3 bg-black text-white">
            Create
          </button>

        </div>
      </form>
    </main>
  )
}

function OpenProject ({ setStarted } : { setStarted: React.Dispatch<React.SetStateAction<boolean>>}) {
  return(
    <main className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white">
      </div>
    </main>
  )
}

function StartUp ( { setStarted } : { setStarted: React.Dispatch<React.SetStateAction<boolean>> } ) {
  const [ config, setConfig ] = useState(false)
  const [ newProject, setNewProject ] = useState(false)
  return (
    <main className="h-screen w-full flex justify-center items-center bg-[#F3EEE3]">
      { config && (
        newProject ? <ConfigProject setStarted={setStarted}/> : <OpenProject setStarted={setStarted}/>
      ) }
      <div className="border-4 border-black flex flex-col gap-2 p-2">
        <button className="p-3 border-2 bg-white text-center border-black"
          onClick = { () => {
            setConfig(true)
            setNewProject(true)
          } }
        >
          <span className="mr-2 font-semibold">
            Create New Project
          </span>
          <ArrowForward/>
        </button>
        <button className="p-3 border-2 bg-white text-center border-black"
          onClick = { () => {
            setConfig(true)
          } }
        >
          <span className="mr-2 font-semibold">
            Open Project
          </span>
          <ArrowForward/>
        </button>
      </div>
    </main>
  )
}

function ProjectArena() {
  const {
    canvasRef,
    setSelectedTool,
    selectedTool,
    setIsFloodFill,
    isFloodFill,
    currentColor,
    setCurrentColor,
    setPredefinedColor,
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

      <section className="w-24 h-1/3 bg-[#D9D0BE] absolute bottom-0 top-0 left-0 my-auto z-[999] flex flex-col justify-around">
        <section
          onClick={() => setSelectedTool("pencil")}
          className={`h-20 w-full bg-red-300 ${selectedTool === "pencil" && "translate-x-3"}`}
        >
          PENCIL
        </section>
        <section
          onClick={() => setSelectedTool("eraser")}
          className={`h-20 w-full bg-red-300 ${selectedTool === "eraser" && "translate-x-3"}`}
        >
          ERASER
        </section>
        <section
          onClick={() => setSelectedTool("bucket")}
          className={`h-20 w-full bg-red-300 ${selectedTool === "bucket" && "translate-x-3"}`}
        >
          BUCKET
        </section>
      </section>

      <section className="w-3/4 h-32 bg-[#D9D0BE] absolute bottom-0"></section>
    </main>
  )
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
