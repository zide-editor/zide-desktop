import { useEffect, useRef, useState } from "react";
import { computeCoords } from "@/utils/libs";
import { Point } from "@/utils/type";

type GridCell = {
  x: number;
  y: number;
  color: string;
};

export default function useCanvas(gridRows: number, gridCols: number, cellSize: number, isFloodFill: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef<boolean>(false);
  const isDrawing = useRef<boolean>(false);
  const isSpacebarHeld = useRef<boolean>(false);
  const lastPosition = useRef<Point | null>(null);
  const dragStartPoint = useRef<Point>({ x: 0, y: 0 });
  const isFloodFillRef = useRef(isFloodFill);

  const [cameraOffset, setCameraOffset] = useState<Point>({ x: 0, y: 0 });
  const [cameraZoom, setCameraZoom] = useState<number>(1);
  const [grid, setGrid] = useState<GridCell[][]>(() => {
    const initialGrid = Array.from({ length: gridRows }, (_, row) =>
      Array.from({ length: gridCols }, (_, col) => ({
        x: col * cellSize,
        y: row * cellSize,
        color: 'white',
      }))
    );
    return initialGrid;
  });

  useEffect(() => {
    isFloodFillRef.current = isFloodFill;
  }, [isFloodFill]);

  const getCellCoords = (x: number, y: number) => ({
    col: Math.floor(x / cellSize),
    row: Math.floor(y / cellSize),
  });

  const updateCellColor = (x: number, y: number, color: string) => {
    const { col, row } = getCellCoords(x, y);
    if (grid[row] && grid[row][col]) {
      const newGrid = grid.map((r, rowIndex) =>
        r.map((cell, colIndex) =>
          rowIndex === row && colIndex === col
            ? { ...cell, color }
            : cell
        )
      );
      setGrid(newGrid);
    }
  };

  const floodFillUtil = (grid: Array<Array<GridCell>>, row:number, col:number, targetColor:string, replacementColor:string) => {
    if (targetColor === replacementColor) return;

    const fillStack = [[row, col]];

    while (fillStack.length) {
      const [currentRow, currentCol] = fillStack.pop() || [0,0];
      if (
        currentRow >= 0 && currentRow < grid.length &&
        currentCol >= 0 && currentCol < grid[0].length &&
        grid[currentRow][currentCol].color === targetColor
      ) {
        grid[currentRow][currentCol].color = replacementColor;

        fillStack.push([currentRow + 1, currentCol]);
        fillStack.push([currentRow - 1, currentCol]);
        fillStack.push([currentRow, currentCol + 1]);
        fillStack.push([currentRow, currentCol - 1]);
      }
    }
  };

  const handleFloodFill = (x:number, y:number, fillColor: string) => {
    const { col, row } = getCellCoords(x, y);
    if (grid[row] && grid[row][col]) {
      const targetColor = grid[row][col].color;
      const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
      floodFillUtil(newGrid, row, col, targetColor, fillColor);
      setGrid(newGrid);
    }
  };

  const mouseDownHandler = (e: MouseEvent) => {
    const position = computeCoords(e) || { x: 0, y: 0 };
    if (isSpacebarHeld.current) {
      isDragging.current = true;
      dragStartPoint.current = {
        x: position.x - cameraOffset.x,
        y: position.y - cameraOffset.y,
      };
    } else if (e.button === 0) {
      isDrawing.current = true;
      lastPosition.current = position;
      if (isFloodFillRef.current) {
        handleFloodFill(position.x - cameraOffset.x, position.y - cameraOffset.y, 'black');
      } else {
        updateCellColor(position.x - cameraOffset.x, position.y - cameraOffset.y, 'black');
      }
    }
    dragStartPoint.current = {
      x: position.x / cameraZoom - cameraOffset.x,
      y: position.y / cameraZoom - cameraOffset.y,
    };
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    if (isDragging.current) {
      if (!canvasRef.current) return;
      const position = computeCoords(e) || { x: 0, y: 0 };
      const newCam = {
        x: position.x / cameraZoom - dragStartPoint.current.x,
        y: position.y / cameraZoom - dragStartPoint.current.y,
      };
      setCameraOffset(newCam);
    } else if (isDrawing.current) {
      if (!canvasRef.current) return;
      const position = computeCoords(e) || { x: 0, y: 0 };
      if (lastPosition.current) {
        updateCellColor(position.x - cameraOffset.x, position.y - cameraOffset.y, 'black');  
        lastPosition.current = position;
      }
    }
  };

  const mouseUpHandler = () => {
    isDragging.current = false;
    isDrawing.current = false;
    lastPosition.current = null;
  };

  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      isSpacebarHeld.current = true;
    }
  };

  const keyUpHandler = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      isSpacebarHeld.current = false;
      isDragging.current = false;  
    }
  };

  const wheelHandler = (e: WheelEvent) => {
    e.preventDefault();

    const zoomSensitivity = 0.001;
    const newZoom = cameraZoom - e.deltaY * zoomSensitivity;

    const minZoom = 0.5;
    const maxZoom = 3;
    const clampedZoom = Math.min(maxZoom, Math.max(minZoom, newZoom));

    setCameraZoom(clampedZoom);
  };

  const drawCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();

    ctx.translate(cameraOffset.x, cameraOffset.y);
    ctx.scale(cameraZoom, cameraZoom);

    grid.forEach(row => {
      row.forEach(cell => {
        ctx.fillStyle = cell.color;
        ctx.fillRect(cell.x, cell.y, cellSize, cellSize);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(cell.x, cell.y, cellSize, cellSize);
      });
    });
    ctx.restore();
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
  }, [cameraOffset, cameraZoom, grid, cellSize]);

  return { canvasRef };
}

