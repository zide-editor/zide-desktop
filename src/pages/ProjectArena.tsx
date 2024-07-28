import useCanvas from "@/hooks/useCanvas";
import useWindow from "@/hooks/useWindow";
import { TypeSelectableMenu } from "@/utils/type";
import { HexColorPicker } from "react-colorful";
import { primaryColors } from "@/utils/libs";
import { useState } from "react";
import { useColor } from "@/hooks/useColor";

export default function ProjectArena() {
  const { currentColor, setPredefinedColor, setCurrentColor } = useColor();
  const {
    downloadCanvas,
    canvasRef,
    setSelectedTool,
    selectedTool,
    grids,
    currentIndex,
    handleAddGrid,
    handleSelectGrid,
    togglePlay,
    isPlaying,
  } = useCanvas(8, 8, currentColor, 50);
  const [selectedMenu, setSelectedMenu] = useState<TypeSelectableMenu>("none");
  const { windowDim } = useWindow();

  return (
    <main className="h-screen w-full bg-[#F3EEE3] relative flex items-center justify-center">
      <Navbar
        downloadCanvas={downloadCanvas}
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
      />

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
                className="w-6 h-6 m-1 rounded-md cursor-pointer"
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
          className={`h-20 flex items-center justify-center w-full bg-red-300 ${selectedTool === "pencil" && "translate-x-3"}`}
        >
          Pencil
        </section>

        <section
          onClick={() => setSelectedTool("eraser")}
          className={`h-20 flex items-center justify-center w-full bg-red-300 ${selectedTool === "eraser" && "translate-x-3"}`}
        >
          Eraser
        </section>

        <section
          onClick={() => setSelectedTool("bucket")}
          className={`h-20 w-full bg-red-300 flex items-center justify-center ${selectedTool === "bucket" && "translate-x-3"}`}
        >
          Bucket
        </section>
      </section>

      <div className="absolute bottom-0 left-0 m-4"></div>

      <section className="w-3/4 border border-black h-32 bg-[#D9D0BE] absolute bottom-0 flex">
        <section className="h-full font-mono flex items-center justify-center bg-red-50 w-48">
          TIMELINE
        </section>

        <section className="w-full py-10 px-1">
          {grids.map((_, index) => (
            <button
              key={index}
              className="h-5 w-5 bg-white border border-black"
              onClick={() => handleSelectGrid(index)}
            >
              .
            </button>
          ))}
        </section>

        <section className="p-1 max-w-48 space-y-2">
          <button
            onClick={handleAddGrid}
            className="px-8 w-full bg-[#CD58FF] font-mono hover:bg-[#F578FF]"
          >
            ADD
          </button>

          <button
            className="px-8 w-full bg-[#CD58FF] font-mono hover:bg-[#F578FF]"
            onClick={togglePlay}
          >
            {isPlaying ? "STOP" : "PLAY"}
          </button>
        </section>
      </section>

      <canvas
        key={currentIndex}
        ref={canvasRef}
        height={windowDim.current?.x || 0}
        width={windowDim.current?.y || 0}
      />
    </main>
  );
}

const Navbar = ({
  selectedMenu,
  setSelectedMenu,
  downloadCanvas,
}: {
  downloadCanvas: () => Promise<void>;
  selectedMenu: TypeSelectableMenu;
  setSelectedMenu: React.Dispatch<React.SetStateAction<TypeSelectableMenu>>;
}) => {
  return (
    <nav className="p-5 w-full h-14 bg-[#D9D0BE] font-bold font-mono absolute top-0 flex space-x-5 items-center z-[999] select-none">
      <section className="relative">
        <h1
          className={`cursor-pointer ${selectedMenu === "file" && "text-[#8D75F1]"}`}
          onClick={() => {
            setSelectedMenu(selectedMenu === "file" ? "none" : "file");
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
          <h1
            onClick={downloadCanvas}
            className="text-black hover:text-[#8D75F1] cursor-pointer"
          >
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
            setSelectedMenu(selectedMenu === "edit" ? "none" : "edit");
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
            setSelectedMenu(selectedMenu === "help" ? "none" : "help");
          }}
        >
          HELP
        </h1>
      </section>
    </nav>
  );
};
