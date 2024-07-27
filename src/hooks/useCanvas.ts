import { compouteCords } from "@/utils/libs";
import { Point } from "@/utils/type";
import { useEffect, useRef, useState } from "react";

export default function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef<boolean>(false);

  const [cameraOffset, setCameraOffset] = useState<Point>({
    x: window.innerWidth,
    y: window.innerHeight,
  });
  const dragStartPoint = useRef<Point>({ x: 0, y: 0 });

  const mouseDownHandler = (e: MouseEvent) => {
    isDragging.current = true;
    const position = compouteCords(e) || { x: 0, y: 0 };
    dragStartPoint.current = {
      x: position.x - cameraOffset.x,
      y: position.y - cameraOffset.y,
    };
  };
  const mouseMoveHandler = (e: MouseEvent) => {
    if (isDragging.current) {
      const position = compouteCords(e) || { x: 0, y: 0 };
      const newCam = { x: 0, y: 0 };
      newCam.x = position.x - dragStartPoint.current.x;
      newCam.y = position.y - dragStartPoint.current.y;
      setCameraOffset(newCam);
    }
  };
  const mouseUpHandler = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
    ctx.fillStyle = "#eecc77";

    ctx.fillRect(20, 20, 100, 100);
    ctx.translate(
      -window.innerWidth / 2 + cameraOffset.x,
      -window.innerHeight / 2 + cameraOffset.y,
    );
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    canvasRef.current.addEventListener("mousedown", mouseDownHandler);
    canvasRef.current.addEventListener("mouseup", mouseUpHandler);
    canvasRef.current.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      canvasRef.current?.removeEventListener("mousedown", mouseDownHandler);
      canvasRef.current?.removeEventListener("mouseup", mouseUpHandler);
      canvasRef.current?.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [cameraOffset]);
  console.log(cameraOffset)

  return { canvasRef };
}
