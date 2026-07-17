export interface SelectionState {
  selectedLayerId: string | null;
}

export const initialSelectionState: SelectionState = {
  selectedLayerId: null,
};

export function selectLayer(id: string | null): SelectionState {
  return {
    selectedLayerId: id,
  };
}
