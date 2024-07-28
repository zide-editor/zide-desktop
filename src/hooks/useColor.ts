import { useState } from "react";

export function useColor() {
  const [currentColor, setCurrentColor] = useState<string>("#000000");

  return { currentColor, setCurrentColor };
}
