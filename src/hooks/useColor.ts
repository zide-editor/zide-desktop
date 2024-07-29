import { primaryColors } from "@/utils/libs";
import { parseGimpPalette } from "@/utils/parse";
import { useState } from "react";
import { ColorResult } from "react-color";

export function useColor() {
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const [colors, setColors] = useState<string[]>(primaryColors);
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

  return {
    currentColor,
    setCurrentColor,
    colors,
    setColors,
    handleColorChange,
    handleFileUpload,
    showColorPicker,
    setShowColorPicker,
  };
}
