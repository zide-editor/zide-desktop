import { Dispatch, SetStateAction } from "react";
import { getCellCoords } from "./libs";
import { GridCell } from "./type";

export const floodFillUtil = (
  grid: Array<Array<GridCell>>,
  row: number,
  col: number,
  targetColor: string,
  replacementColor: string,
) => {
  if (targetColor === replacementColor) return;

  const fillStack = [[row, col]];

  while (fillStack.length) {
    const [currentRow, currentCol] = fillStack.pop() || [0, 0];
    if (
      currentRow >= 0 &&
      currentRow < grid.length &&
      currentCol >= 0 &&
      currentCol < grid[0].length &&
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

export const handleFloodFill = (
  x: number,
  y: number,
  fillColor: string,
  grid: GridCell[][],
  setGrid: Dispatch<SetStateAction<GridCell[][]>>,
  grids: GridCell[][][],
  setGrids: Dispatch<SetStateAction<GridCell[][][]>>,
  index: number,
) => {
  const { col, row } = getCellCoords(x, y, 50);

  if (grid[row] && grid[row][col]) {
    const targetColor = grid[row][col].color;
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    floodFillUtil(newGrid, row, col, targetColor, fillColor);

    setGrid(newGrid);

    const updatedGrids = [...grids];
    updatedGrids[index] = newGrid;
    setGrids(updatedGrids);
  }
};

export const updateCellColor = (
  x: number,
  y: number,
  color: string,
  grid: GridCell[][],
  setGrid: Dispatch<SetStateAction<GridCell[][]>>,
  grids: GridCell[][][],
  setGrids: Dispatch<SetStateAction<GridCell[][][]>>,
  index: number,
) => {
  const { col, row } = getCellCoords(x, y, 50);
  if (grid[row] && grid[row][col]) {
    const newGrid = grid.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col
          ? { ...cell, color, originalColor: color }
          : cell,
      ),
    );
    setGrid(newGrid);

    const updatedGrids = [...grids];
    updatedGrids[index] = newGrid;
    setGrids(updatedGrids);
  }
};

export function drawGrid(grid: GridCell[][], ctx: CanvasRenderingContext2D) {
  grid.forEach((row: GridCell[]) => {
    row.forEach((cell: GridCell) => {
      ctx.fillRect(cell.x, cell.y, 50, 50);
      ctx.strokeStyle = "black";
      ctx.strokeRect(cell.x, cell.y, 50, 50);
    });
  });
}

export default function createSampleArray() {
  [
    Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 8 }, (_, col) => ({
        x: col * 50,
        y: row * 50,
        color: "white",
        originalColor: "white",
      })),
    ),
  ];
}
