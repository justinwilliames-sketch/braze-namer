import { DimensionConfig } from "./defaults";

export function buildName(
  dimensions: DimensionConfig[],
  selections: Record<string, string>
): string {
  return dimensions
    .map((d) => {
      const raw = selections[d.key]?.trim();
      if (!raw) return "";
      // Dates stay as YYYY-MM-DD; other values lowercase + space→hyphen
      if (d.type === "date") return raw;
      return raw.replace(/\s+/g, "-").toLowerCase();
    })
    .filter(Boolean)
    .join("_");
}
