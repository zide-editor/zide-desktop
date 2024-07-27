import { compouteCords } from "@/utils/libs";
import { Point } from "@/utils/type";
import { useEffect, useRef, useState } from "react";

export default function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef<boolean>(false);

  const [cameraOffset, setCameraOffset] = useState<Point>({
    x: 0,
    y: 0,
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
      if (!canvasRef.current) return;
      const position = compouteCords(e) || { x: 0, y: 0 };
      const newCam = {
        x: position.x - dragStartPoint.current.x,
        y: position.y - dragStartPoint.current.y,
      };
      setCameraOffset(newCam);
    }
  };

  const mouseUpHandler = () => {
    isDragging.current = false;
  };

  const drawCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.save(); 

    
    ctx.translate(cameraOffset.x, cameraOffset.y);

    ctx.fillStyle = "#eecc77";
    ctx.fillRect(20, 20, 100, 100);

    ctx.restore(); 
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    drawCanvas(ctx);

    const canvasElement = canvasRef.current;
    canvasElement.addEventListener("mousedown", mouseDownHandler);
    canvasElement.addEventListener("mouseup", mouseUpHandler);
    canvasElement.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      canvasElement.removeEventListener("mousedown", mouseDownHandler);
      canvasElement.removeEventListener("mouseup", mouseUpHandler);
      canvasElement.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [cameraOffset]);

  return { canvasRef };
}
