import { Layer } from "@/types/layer";

export function addLayer(
  layers: Layer[],
  layer: Layer
) {
  return [...layers, layer];
}

export function removeLayer(
  layers: Layer[],
  id: string
) {
  return layers.filter((layer) => layer.id !== id);
}

export function duplicateLayer(
  layers: Layer[],
  id: string
) {
  const layer = layers.find((l) => l.id === id);

  if (!layer) return layers;

  return [
    ...layers,
    {
      ...layer,
      id: crypto.randomUUID(),
      x: layer.x + 20,
      y: layer.y + 20,
    },
  ];
}

export function updateLayer(
  layers: Layer[],
  id: string,
  updates: Partial<Layer>
) {
  return layers.map((layer) =>
    layer.id === id
      ? { ...layer, ...updates }
      : layer
  );
}
