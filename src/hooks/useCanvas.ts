import { useEffect, useRef, useState } from "react";
import { computeCoords, getCellCoords } from "@/utils/libs";
import { TypeSelectable, TypePoint, GridCell } from "@/utils/type";
import { handleFloodFill, updateCellColor } from "@/utils/algorithm";
import { useHistory } from "./useHistory";
import { writeBinaryFile } from "@tauri-apps/api/fs";
import { save } from "@tauri-apps/api/dialog";
import useWindow from "./useWindow";

export default function useCanvas(
  gridRows: number,
  gridCols: number,
  currentColor: string,
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [grids, setGrids] = useState<GridCell[][][]>([
    Array.from({ length: gridRows }, (_, row) =>
      Array.from({ length: gridCols }, (_, col) => ({
        x: col * 50,
        y: row * 50,
        color: "#00000000",
        originalColor: "#00000000",
      })),
    ),
  ]);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [grid, setGrid] = useState<GridCell[][]>(grids[currentIndex]);

  const { windowDim } = useWindow();

  const isSpacebarHeld = useRef<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef<boolean>(false);
  const isDrawing = useRef<boolean>(false);
  const lastPosition = useRef<TypePoint | null>(null);
  const dragStartPoint = useRef<TypePoint>({ x: 0, y: 0 });

  const [selectedTool, setSelectedTool] = useState<TypeSelectable>("pencil");
  const [cameraOffset, setCameraOffset] = useState<TypePoint>({
    x: (windowDim.current?.x || 0) / 2,
    y: (windowDim.current?.y || 0) / 2,
  });
  const [cameraZoom, setCameraZoom] = useState<number>(1);
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    setGrid(grids[currentIndex]);
  }, [currentIndex, grids]);
  
  const { undo, redo, saveStateToUndoStack } = useHistory(
    grid,
    setGrid,
    grids,
    setGrids,
    currentIndex,
  );

  const handleAddGrid = () => {
    setGrids([
      ...grids,
      Array.from({ length: gridRows }, (_, row) =>
        Array.from({ length: gridCols }, (_, col) => ({
          x: col * 50,
          y: row * 50,
          color: "#00000000",
          originalColor: "#00000000",
        })),
      ),
    ]);
    setCurrentIndex(grids.length); // Switch to the newly added grid
  };

  const handleSelectGrid = (index: number) => {
    setCurrentIndex(index);
  };

  const mouseDownHandler = (e: MouseEvent) => {
    const position = computeCoords(e) || { x: 0, y: 0 };
    const adjustedX = (position.x - cameraOffset.x) / cameraZoom;
    const adjustedY = (position.y - cameraOffset.y) / cameraZoom;

    if (isSpacebarHeld.current) {
      isDragging.current = true;
      dragStartPoint.current = { x: adjustedX, y: adjustedY };
    } else if (e.button === 0) {
      isDrawing.current = true;
      lastPosition.current = position;
      saveStateToUndoStack();

      if (selectedTool === "bucket") {
        handleFloodFill(
          adjustedX,
          adjustedY,
          currentColor,
          grid,
          setGrid,
          grids,
          setGrids,
          currentIndex,
        );
      } else {
        updateCellColor(
          adjustedX,
          adjustedY,
          currentColor,
          grid,
          setGrid,
          grids,
          setGrids,
          currentIndex,
        );
      }
    }
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    const position = computeCoords(e) || { x: 0, y: 0 };
    const adjustedX = (position.x - cameraOffset.x) / cameraZoom;
    const adjustedY = (position.y - cameraOffset.y) / cameraZoom;

    if (isDragging.current) {
      const newCam = {
        x: position.x - dragStartPoint.current.x * cameraZoom,
        y: position.y - dragStartPoint.current.y * cameraZoom,
      };
      setCameraOffset(newCam);
    } else if (isDrawing.current) {
      if (lastPosition.current) {
        updateCellColor(
          adjustedX,
          adjustedY,
          currentColor,
          grid,
          setGrid,
          grids,
          setGrids,
          currentIndex,
        );
        lastPosition.current = position;
      }
    } else {
      const { col, row } = getCellCoords(adjustedX, adjustedY);
      if (grid[row] && grid[row][col]) {
        setHoveredCell({ row, col });
      } else {
        setHoveredCell(null);
      }
    }
  };

  const mouseUpHandler = () => {
    isDragging.current = false;
    isDrawing.current = false;
    lastPosition.current = null;
  };

  const wheelHandler = (e: WheelEvent) => {
    e.preventDefault();

    const zoomSensitivity = 0.001;
    const newZoom = cameraZoom - e.deltaY * zoomSensitivity;

    const minZoom = 0.2;
    const maxZoom = 3;
    const clampedZoom = Math.min(maxZoom, Math.max(minZoom, newZoom));
    console.log(clampedZoom);

    const position = computeCoords(e) || { x: 0, y: 0 };
    const mouseWorldX = (position.x - cameraOffset.x) / cameraZoom;
    const mouseWorldY = (position.y - cameraOffset.y) / cameraZoom;

    setCameraOffset({
      x: position.x - mouseWorldX * clampedZoom,
      y: position.y - mouseWorldY * clampedZoom,
    });

    setCameraZoom(clampedZoom);
  };

  // const drawCanvas = (ctx: CanvasRenderingContext2D) => {
  //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  //   ctx.save();
  //
  //   ctx.translate(cameraOffset.x, cameraOffset.y);
  //   ctx.scale(cameraZoom, cameraZoom);
  //
  //   ctx.restore();
  // };

  const drawCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();

    ctx.translate(cameraOffset.x, cameraOffset.y);
    ctx.scale(cameraZoom, cameraZoom);

    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, gridCols * 50, gridRows * 50);

    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        ctx.fillStyle =
          hoveredCell &&
          hoveredCell.row === rowIndex &&
          hoveredCell.col === colIndex
            ? "#75726C"
            : cell.color;
        ctx.fillRect(cell.x, cell.y, 50, 50);
      });
    });
    ctx.restore();
  };

  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      isSpacebarHeld.current = true;
    }
    if (e.ctrlKey && e.code === "KeyZ") {
      undo();
    }
    if (e.ctrlKey && e.code === "KeyY") {
      redo();
    }
  };

  const keyUpHandler = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      isSpacebarHeld.current = false;
      isDragging.current = false;
    }
  };

  const downloadCanvas = async () => {
    if (canvasRef.current) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = gridCols * 50 * grids.length;
      tempCanvas.height = gridRows * 50;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        grids.forEach((grid, gridIndex) => {
          grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
              tempCtx.fillStyle = cell.color;
              tempCtx.fillRect(
                (gridIndex * gridCols + colIndex) * 50,
                rowIndex * 50,
                50,
                50,
              );
            });
          });
        });
        const dataURL = tempCanvas.toDataURL("image/png");

        if (dataURL) {
          const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
          const binaryData = atob(base64Data);
          const uint8Array = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
          }

          try {
            const filePath = await save({
              filters: [
                {
                  name: "Image",
                  extensions: ["png"],
                },
              ],
            });

            if (filePath) {
              await writeBinaryFile(filePath, uint8Array);
              console.log("File saved successfully");
            }
          } catch (err) {
            console.error("Failed to save the file:", err);
          }
        }
      }
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playIntervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % grids.length);
      }, 400);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasElement = canvasRef.current;
    const ctx = canvasElement.getContext("2d");
    if (!ctx) return;

    const resizeHandler = () => {
      if (canvasElement) {
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;
        drawCanvas(ctx);
      }
    };

    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
    drawCanvas(ctx);

    canvasElement.addEventListener("mousedown", mouseDownHandler);
    canvasElement.addEventListener("mouseup", mouseUpHandler);
    canvasElement.addEventListener("mousemove", mouseMoveHandler);
    canvasElement.addEventListener("wheel", wheelHandler);

    window.addEventListener("resize", resizeHandler);
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    return () => {
      canvasElement.removeEventListener("mousedown", mouseDownHandler);
      canvasElement.removeEventListener("mouseup", mouseUpHandler);
      canvasElement.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
      canvasElement.removeEventListener("wheel", wheelHandler);
    };
  }, [cameraOffset, cameraZoom, grid, hoveredCell]);

  return {
    downloadCanvas,
    selectedTool,
    setSelectedTool,
    canvasRef,
    grids,
    currentIndex,
    handleAddGrid,
    handleSelectGrid,
    togglePlay,
    isPlaying,
  };
}
