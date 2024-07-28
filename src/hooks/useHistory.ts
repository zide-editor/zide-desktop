import { GridCell } from "@/utils/type";
import { Dispatch, SetStateAction, useRef } from "react";

export function useHistory(
  grid: GridCell[][],
  setGrid: Dispatch<SetStateAction<GridCell[][]>>,
  grids: GridCell[][][],
  setGrids: Dispatch<SetStateAction<GridCell[][][]>>,
  index: number,
) {
  const undoStack = useRef<GridCell[][][]>([]);
  const redoStack = useRef<GridCell[][][]>([]);

  const saveStateToUndoStack = () => {
    undoStack.current = [
      ...undoStack.current,
      grid.map((row) => row.map((cell) => ({ ...cell }))),
    ];
    redoStack.current = [];
  };

  const undo = () => {
    if (undoStack.current.length > 0) {
      const previousState = undoStack.current.pop();
      if (previousState) {
        redoStack.current = [...redoStack.current, grid];
        setGrid(previousState);

        const updatedGrids = [...grids];
        updatedGrids[index] = previousState;
        setGrids(updatedGrids);
      }
    }
  };

  const redo = () => {
    if (redoStack.current.length > 0) {
      const nextState = redoStack.current.pop();
      if (nextState) {
        undoStack.current = [...undoStack.current, grid];
        setGrid(nextState);

        const updatedGrids = [...grids];
        updatedGrids[index] = nextState;
        setGrids(updatedGrids);
      }
    }
  };

  return { saveStateToUndoStack, redo, undo };
}
