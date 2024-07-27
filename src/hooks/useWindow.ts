import { TypePoint } from "@/utils/type";
import { useRef } from "react";

export default function useWindow() {
  const windowDim = useRef<TypePoint>();

  if (typeof window !== "undefined") {
    windowDim.current = { x: window.innerWidth, y: window.innerHeight };
  }

  return { windowDim };
}
