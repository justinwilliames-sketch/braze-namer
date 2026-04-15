import { DEFAULT_DIMENSIONS, DimensionConfig } from "./defaults";

const STORAGE_KEY = "braze-namer-config";

export function loadDimensions(): DimensionConfig[] {
  if (typeof window === "undefined") return DEFAULT_DIMENSIONS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_DIMENSIONS;
  try {
    return JSON.parse(raw) as DimensionConfig[];
  } catch {
    return DEFAULT_DIMENSIONS;
  }
}

export function saveDimensions(dims: DimensionConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dims));
}

export function resetDimensions() {
  localStorage.removeItem(STORAGE_KEY);
}
