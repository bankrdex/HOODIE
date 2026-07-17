import { Layer } from "@/types/layer";

export interface EditorState {
  view: "front" | "back";
  front: Layer[];
  back: Layer[];
}

export const initialEditorState: EditorState = {
  view: "front",
  front: [],
  back: [],
};
