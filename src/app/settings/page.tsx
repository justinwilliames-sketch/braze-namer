"use client";

import { useState } from "react";
import { DEFAULT_DIMENSIONS, DimensionConfig } from "@/lib/defaults";
import { useUser } from "@/lib/use-user";
import { applyTheme } from "@/components/theme-provider";

export default function SettingsPage() {
  const { user, loading, saveConfig, setTheme } = useUser();
  const [newValues, setNewValues] = useState<Record<string, string>>({});

  if (loading || !user) return null;

  const dimensions = user.config;

  const persist = (updated: DimensionConfig[]) => saveConfig(updated);

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
    saveConfig(DEFAULT_DIMENSIONS);
  };

  const handleThemeChange = (t: "auto" | "light" | "dark") => {
    setTheme(t);
    applyTheme(t);
  };

  const selectDimensions = dimensions.filter((d) => d.type === "select");

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-1">
            Settings
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Customise your dimensions and appearance.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          Reset to defaults
        </button>
      </div>

      {/* Theme */}
      <section className="mb-12 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
          Appearance
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
          Auto follows your system preference.
        </p>
        <div className="inline-flex rounded-lg border border-neutral-300 dark:border-neutral-700 p-0.5 bg-neutral-100 dark:bg-neutral-950">
          {(["auto", "light", "dark"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleThemeChange(t)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                user.theme === t
                  ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Dimensions */}
      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 md:p-8">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-white mb-6">
          Dimensions
        </h2>
        <div className="space-y-8">
          {selectDimensions.map((dim) => (
            <div key={dim.key}>
              <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                {dim.label}
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {dim.values?.map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-2.5 py-1 text-sm text-neutral-700 dark:text-neutral-300"
                  >
                    {dim.labels?.[v] ? (
                      <>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          {dim.labels[v]}
                        </span>
                        <span className="font-mono text-xs text-neutral-900 dark:text-neutral-200">
                          {v}
                        </span>
                      </>
                    ) : (
                      v
                    )}
                    <button
                      onClick={() => removeValue(dim.key, v)}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                      aria-label={`Remove ${v}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Add to ${dim.label}…`}
                  value={newValues[dim.key] ?? ""}
                  onChange={(e) =>
                    setNewValues((prev) => ({
                      ...prev,
                      [dim.key]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && addValue(dim.key)}
                  className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
                <button
                  onClick={() => addValue(dim.key)}
                  className="rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
