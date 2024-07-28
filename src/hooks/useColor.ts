import { useState } from "react";

export function useColor() {
  const [currentColor, setCurrentColor] = useState<string>("#000000");

  const setPredefinedColor = (color: string) => {
    setCurrentColor(color);
  };

  return { currentColor, setPredefinedColor, setCurrentColor };
}
