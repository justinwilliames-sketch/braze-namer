"use client";

import { useState, useEffect } from "react";
import { loadDimensions, saveDimensions, resetDimensions } from "@/lib/storage";
import { DEFAULT_DIMENSIONS, DimensionConfig } from "@/lib/defaults";

export default function SettingsPage() {
  const [dimensions, setDimensions] = useState<DimensionConfig[]>([]);
  const [newValues, setNewValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setDimensions(loadDimensions());
  }, []);

  const persist = (updated: DimensionConfig[]) => {
    setDimensions(updated);
    saveDimensions(updated);
  };

  const addValue = (dimKey: string) => {
    const val = newValues[dimKey]?.trim();
    if (!val) return;
    const updated = dimensions.map((d) => {
      if (d.key !== dimKey || !d.values) return d;
      if (d.values.some((v) => v.toLowerCase() === val.toLowerCase())) return d;
      return { ...d, values: [...d.values, val] };
    });
    persist(updated);
    setNewValues((prev) => ({ ...prev, [dimKey]: "" }));
  };

  const removeValue = (dimKey: string, value: string) => {
    const updated = dimensions.map((d) => {
      if (d.key !== dimKey || !d.values) return d;
      return { ...d, values: d.values.filter((v) => v !== value) };
    });
    persist(updated);
  };

  const handleReset = () => {
    resetDimensions();
    setDimensions(DEFAULT_DIMENSIONS);
  };

  const selectDimensions = dimensions.filter((d) => d.type === "select");

  if (dimensions.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Settings</h1>
          <p className="text-sm text-neutral-500">
            Add or remove values for each dimension.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-red-600 hover:text-red-800 transition-colors"
        >
          Reset to defaults
        </button>
      </div>

      <div className="space-y-8">
        {selectDimensions.map((dim) => (
          <div key={dim.key}>
            <h2 className="text-sm font-semibold text-neutral-800 mb-3">
              {dim.label}
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {dim.values?.map((v) => {
                const isDefault = DEFAULT_DIMENSIONS.find(
                  (dd) => dd.key === dim.key
                )?.values?.includes(v);
                return (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-sm text-neutral-700"
                  >
                    {v}
                    <button
                      onClick={() => removeValue(dim.key, v)}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                      title={isDefault ? "Hide default value" : "Remove value"}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Add to ${dim.label}…`}
                value={newValues[dim.key] ?? ""}
                onChange={(e) =>
                  setNewValues((prev) => ({ ...prev, [dim.key]: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && addValue(dim.key)}
                className="flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <button
                onClick={() => addValue(dim.key)}
                className="rounded-md bg-neutral-900 text-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
