export const computeCoords = (e: MouseEvent) => {
  if (e.clientX && e.clientY) return { x: e.clientX, y: e.clientY };
};

export const MENU_DATA = {
  file: ["New File", "Export", "Exit"],
  edit: ["Undo", "Redo"],
};
