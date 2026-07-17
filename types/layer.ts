export type LayerType = "image" | "text";

export interface Layer {
  id: string;
  type: LayerType;

  x: number;
  y: number;

  width: number;
  height: number;

  rotation: number;

  text?: string;
  image?: string;

  color?: string;
  fontSize?: number;
}
