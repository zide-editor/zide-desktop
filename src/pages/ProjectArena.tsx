import useCanvas from "@/hooks/useCanvas";
import useWindow from "@/hooks/useWindow";
import { TypeSelectableMenu } from "@/utils/type";
import { primaryColors } from "@/utils/libs";
import { useState } from "react";
import { useColor } from "@/hooks/useColor";
import Image from "next/image";
import { Bucket, Eraser, Pencil } from "@/assets";
import useCollapse from "@/hooks/useCollapse";
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react";

export default function ProjectArena() {
  const { currentColor, setCurrentColor } = useColor();
  const { isTimelineVisibility, setTimelineVisiblity } = useCollapse();
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
    <main className="h-screen graph w-full bg-[#F3EEE3] relative flex items-center justify-center">
      <Navbar
        downloadCanvas={downloadCanvas}
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
      />

      <section className="absolute right-0 top-0 bottom-0 my-auto h-fit p-2 bg-[#D9D0BE] shadow-[5px_5px_0px_0px_rgba(153,142,119)]">
        <div className="grid grid-cols-2 justify-center max-h-48 overflow-scroll">
          {primaryColors.map((color, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentColor(color)}
              className={`flex gap-1 items-center rounded-md py-1 ${color === currentColor ? "bg-black/5 " : ""}`}
            >
              <button
                className="w-6 h-6 m-1 rounded-md cursor-pointer"
                style={{ backgroundColor: color }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="shadow-[5px_5px_0px_0px_rgba(153,142,119)] -translate-x-2 w-10 h-fit bg-[#D9D0BE] absolute bottom-0 top-0 left-0 my-auto z-[999] flex flex-col justify-around">
        <section
          onClick={() => setSelectedTool("pencil")}
          className={`h-16 flex items-center justify-center w-full  ${selectedTool === "pencil" ? "translate-x-6" : "-translate-x-4"} transition-transform ease-linear`}
        >
          <Image alt="pencil" className="rotate-90" src={Pencil} />
        </section>

        <section
          onClick={() => setSelectedTool("eraser")}
          className={`h-16 flex items-center justify-center w-full  ${selectedTool === "eraser" ? "translate-x-6" : "-translate-x-4"} transition-transform ease-linear`}
        >
          <Image alt="eraser" className="rotate-90" src={Eraser} />
        </section>

        <section
          onClick={() => setSelectedTool("bucket")}
          className={`h-16 w-full  flex items-center justify-center ${selectedTool === "bucket" ? "translate-x-6" : "-translate-x-4"} transition-transform ease-linear`}
        >
          <Image alt="bucket" className="rotate-90" src={Bucket} />
        </section>
      </section>

      <div className="absolute bottom-0 left-0 m-4"></div>

      <section
        className={`shadow-[5px_5px_0px_0px_rgba(153,142,119)] w-3/4 border border-black h-32 bg-[#D9D0BE] absolute bottom-0 flex ${isTimelineVisibility ? "translate-y-0" : "translate-y-32"} transition-transform ease-in-out`}
      >
        <button
          onClick={() => setTimelineVisiblity(!isTimelineVisibility)}
          className="absolute h-5 w-5 bg-[#D9D0BE] -top-5 right-10 flex  shadow-[5px_0px_0px_0px_rgba(153,142,119)] items-center justify-center border-black border-x border-t"
        >
          {isTimelineVisibility ? (
            <IconCaretDownFilled />
          ) : (
            <IconCaretUpFilled />
          )}
        </button>

        <div className="flex-grow max-w-48 min-w-36">
          <h1 className="px-1 h-6 bg-[#B7A7F0] border-b border-black font-mono">
            Layer Name
          </h1>
          <h1 className="px-1 h-5 text-xs bg-white border-b border-black font-mono">
            Layer 1
          </h1>
        </div>

        <div className="flex flex-col overflow-scroll flex-1">
          <div className=" flex ">
            {Array.from({ length: grids.length }, (_, i) => (
              <div className="min-w-5 border-black border-l h-6 bg-white text-xs text-gray-500 flex items-center justify-center">
                {i + 1}
              </div>
            ))}
          </div>
          <div className=" flex ">
            {grids.map((_, index) => (
              <button
                onClick={() => handleSelectGrid(index)}
                key={index}
                className={`min-w-5 border-black border-l h-5 transition-transform ease-in bg-white border-y ${index === currentIndex && "-translate-y-1"}`}
              >
                &bull;
              </button>
            ))}

            <button
              onClick={handleAddGrid}
              className="h-5 w-5 border border-black bg-[#B7A7F0] flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        <div className="p-3 w-full max-w-24">
          <button
            className="font-mono w-full px-4 py-1 border border-black bg-[#B7A7F0]"
            onClick={togglePlay}
          >
            {isPlaying ? "STOP" : "PLAY"}
          </button>
        </div>
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
    <nav className="shadow-[0px_5px_0px_0px_rgba(153,142,119)] p-5 w-full h-14 bg-[#D9D0BE] font-bold font-mono absolute top-0 flex space-x-5 items-center z-[999] select-none">
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
          className={`shadow-[5px_5px_0px_0px_rgba(153,142,119)] absolute bg-[#F3EEE3] border border-black w-48 px-5 py-3 ${selectedMenu !== "file" && "hidden"}`}
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
          className={`shadow-[5px_5px_0px_0px_rgba(153,142,119)] absolute bg-[#F3EEE3] border border-black w-48 px-5 py-3 ${selectedMenu !== "edit" && "hidden"}`}
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
