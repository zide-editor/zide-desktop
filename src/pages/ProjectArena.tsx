import useCanvas from "@/hooks/useCanvas";
import useWindow from "@/hooks/useWindow";
import { TypeSelectableMenu } from "@/utils/type";
import { useState } from "react";
import { useColor } from "@/hooks/useColor";
import Image from "next/image";
import { Bucket, Eraser, Pencil } from "@/assets";
import useCollapse from "@/hooks/useCollapse";
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import { parseGimpPalette } from "@/utils/parse";
import { ChromePicker, ColorResult } from "react-color";

export default function ProjectArena() {
  const { colors, setColors, currentColor, setCurrentColor } = useColor();
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
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  const handleColorChange = (color: ColorResult) => {
    setColors((state) => {
      return state.map((c: string) => {
        if (currentColor === c) return color.hex;
        return c;
      });
    });
    setCurrentColor(color.hex);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        const parsedHexCodes = parseGimpPalette(content).slice(1);
        setColors((state) => {
          return [...parsedHexCodes, ...state];
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <main className="h-screen graph w-full bg-[#F3EEE3] relative flex items-center justify-center overflow-clip">
      <Navbar
        downloadCanvas={downloadCanvas}
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
      />

      <section className="absolute right-0 top-0 bottom-0 my-auto p-4 bg-[#D9D0BE] shadow-[5px_5px_0px_0px_rgba(153,142,119)] max-h-48 min-w-48 flex flex-col">
        <section className="grid grid-cols-4 flex-grow bg-[#D9D0BE] p-2 place-items-stretch color_row gap3 border border-black overflow-y-auto overflow-x-clip">
          {colors.map((color, idx) => (
            <div
              className={`flex justify-center w-10 h-10 gap-1 items-center rounded-md py-1 ${color === currentColor ? "bg-black/5 " : ""}`}
            >
              <button
                key={idx}
                onClick={() => setCurrentColor(color)}
                className="w-7 h-7  cursor-pointer rounded-md shadow "
                style={{ backgroundColor: color }}
              />
            </div>
          ))}

          <div
            className={`flex justify-center w-10 h-10 gap-1 items-center rounded-md py-1 `}
          >
            <button className="w-7 h-7  cursor-pointer rounded-md shadow inline-flex items-center justify-center bg-gray-400">
              <IconPlus color="white" size={18} />
            </button>
          </div>
        </section>
        <section className="min-h-10 w-full border-black border-x border-b px-2 flex">
          <div
            onClick={() => setShowColorPicker(!showColorPicker)}
            className={`flex gap-1 items-center rounded-md py-1 ${showColorPicker ? "bg-black/5 " : ""}`}
          >
            <button className="w-6 h-6 m-1 rounded-full cursor-pointer bg-gradient-to-r from-teal-400 to-yellow-200" />
          </div>

          <div className={`flex gap-1 items-center rounded-md py-1`}>
            <input
              id="file-upload"
              className="hidden"
              type="file"
              accept=".gpl"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-upload"
              className="w-6 h-6 m-1 border border-[#998E78] rounded-full cursor-pointer p-1 inline-flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(153,142,119)]"
            >
              <IconUpload size={15} />
            </label>
          </div>

          {showColorPicker && (
            <div className="absolute z-10 right-0 top-full p-2 bg-[#D9D0BE] rounded-l shadow-lg  ">
              <ChromePicker
                color={currentColor}
                onChange={handleColorChange}
                disableAlpha={true}
              />
            </div>
          )}
        </section>
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
