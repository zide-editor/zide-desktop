export const computeCoords = (e: MouseEvent) => {
  if (e.clientX && e.clientY) return { x: e.clientX, y: e.clientY };
};

export const MENU_DATA = {
  file: ["New File", "Export", "Exit"],
  edit: ["Undo", "Redo"],
};

export const primaryColors = [
  { name: "cyan", code: "#00FFFF" },
  { name: "red", code: "#FF0000" },
  { name: "green", code: "#00FF00" },
  { name: "blue", code: "#0000FF" },
  { name: "yellow", code: "#FFFF00" },
  { name: "magenta", code: "#FF00FF" },
];

export const getCellCoords = (x: number, y: number, cellSize: number) => ({
  col: Math.floor(x / cellSize),
  row: Math.floor(y / cellSize),
});
