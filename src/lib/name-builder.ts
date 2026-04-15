import { DimensionConfig } from "./defaults";

export function buildName(
  dimensions: DimensionConfig[],
  selections: Record<string, string>
): string {
  return dimensions
    .map((d) => selections[d.key]?.trim())
    .filter(Boolean)
    .join("_")
    .replace(/\s+/g, "-")
    .toLowerCase();
}
