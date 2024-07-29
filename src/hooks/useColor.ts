import { primaryColors } from "@/utils/libs";
import { useState } from "react";

export function useColor() {
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const [colors, setColors] = useState<string[]>(primaryColors);

  return { currentColor, setCurrentColor, colors, setColors };
}
