export interface TypePoint {
  x: number;
  y: number;
}

export type TypeSelectable = "pencil" | "eraser" | "bucket";
export type TypeSelectableMenu = "file" | "edit" | "help" | "none";

export type GridCell = {
  x: number;
  y: number;
  color: string;
  originalColor: string;
};
