export const computeCoords = (e: MouseEvent) => {
  if (e.clientX && e.clientY) return { x: e.clientX, y: e.clientY };
};

export const MENU_DATA = {
  file: ["New File", "Export", "Exit"],
  edit: ["Undo", "Redo"],
};

export const primaryColors = [
  "#00FFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
];

export const getCellCoords = (x: number, y: number, cellSize: number) => ({
  col: Math.floor(x / cellSize),
  row: Math.floor(y / cellSize),
});
