"use client";

import { useState } from "react";
import { DEFAULT_DIMENSIONS, DimensionConfig } from "@/lib/defaults";
import { useUser } from "@/lib/use-user";
import { applyTheme } from "@/components/theme-provider";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export default function SettingsPage() {
  const { user, loading, saveConfig, setTheme } = useUser();
  const [newValues, setNewValues] = useState<Record<string, string>>({});
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [labelDraft, setLabelDraft] = useState("");
  const [newField, setNewField] = useState<{
    label: string;
    type: "select" | "text" | "date";
  }>({ label: "", type: "select" });

  if (loading || !user) return null;

  const dimensions = user.config;
  const persist = (updated: DimensionConfig[]) => saveConfig(updated);

  // ---- value-level operations ----
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

  // ---- field-level operations ----
  const startEditLabel = (dim: DimensionConfig) => {
    setEditingLabel(dim.key);
    setLabelDraft(dim.label);
  };

  const saveLabel = (dimKey: string) => {
    const label = labelDraft.trim();
    if (!label) {
      setEditingLabel(null);
      return;
    }
    const updated = dimensions.map((d) =>
      d.key === dimKey ? { ...d, label } : d
    );
    persist(updated);
    setEditingLabel(null);
  };

  const deleteField = (dimKey: string, dimLabel: string) => {
    const confirmed = confirm(
      `Delete "${dimLabel}"? It will be removed from the generator and the output string. This cannot be undone.`
    );
    if (!confirmed) return;
    persist(dimensions.filter((d) => d.key !== dimKey));
  };

  const moveField = (dimKey: string, direction: -1 | 1) => {
    const idx = dimensions.findIndex((d) => d.key === dimKey);
    const target = idx + direction;
    if (idx === -1 || target < 0 || target >= dimensions.length) return;
    const updated = [...dimensions];
    [updated[idx], updated[target]] = [updated[target], updated[idx]];
    persist(updated);
  };

  const addField = () => {
    const label = newField.label.trim();
    if (!label) return;
    let key = slugify(label);
    if (!key) return;
    // ensure unique key
    const existingKeys = new Set(dimensions.map((d) => d.key));
    if (existingKeys.has(key)) {
      let suffix = 2;
      while (existingKeys.has(`${key}_${suffix}`)) suffix++;
      key = `${key}_${suffix}`;
    }
    const dim: DimensionConfig = {
      key,
      label,
      type: newField.type,
      ...(newField.type === "select" ? { values: [] } : {}),
    };
    persist([...dimensions, dim]);
    setNewField({ label: "", type: "select" });
  };

  // ---- theme ----
  const handleThemeChange = (t: "auto" | "light" | "dark") => {
    setTheme(t);
    applyTheme(t);
  };

  const handleReset = () => {
    const confirmed = confirm(
      "Reset all fields and values to defaults? Your custom fields will be lost."
    );
    if (!confirmed) return;
    saveConfig(DEFAULT_DIMENSIONS);
  };

  const defaultKeys = new Set(DEFAULT_DIMENSIONS.map((d) => d.key));

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-1">
            Settings
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Customise your fields, values, and appearance.
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

      {/* Fields */}
      <section className="mb-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 md:p-8">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
            Fields
          </h2>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            order = output string order
          </span>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
          Rename, reorder, delete, or add entirely new fields. Each field
          becomes a position in your output string.
        </p>

        <div className="space-y-2 mb-6">
          {dimensions.map((dim, i) => {
            const isDefault = defaultKeys.has(dim.key);
            const isEditing = editingLabel === dim.key;
            return (
              <div
                key={dim.key}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 px-3 py-2"
              >
                <div className="flex flex-col">
                  <button
                    onClick={() => moveField(dim.key, -1)}
                    disabled={i === 0}
                    className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-20 disabled:cursor-not-allowed text-xs leading-none"
                    aria-label="Move up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveField(dim.key, 1)}
                    disabled={i === dimensions.length - 1}
                    className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-20 disabled:cursor-not-allowed text-xs leading-none"
                    aria-label="Move down"
                  >
                    ▼
                  </button>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  {isEditing ? (
                    <input
                      autoFocus
                      value={labelDraft}
                      onChange={(e) => setLabelDraft(e.target.value)}
                      onBlur={() => saveLabel(dim.key)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveLabel(dim.key);
                        if (e.key === "Escape") setEditingLabel(null);
                      }}
                      className="flex-1 bg-white dark:bg-neutral-900 rounded border border-neutral-900 dark:border-white px-2 py-1 text-sm focus:outline-none"
                    />
                  ) : (
                    <button
                      onClick={() => startEditLabel(dim)}
                      className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                      title="Click to rename"
                    >
                      {dim.label}
                    </button>
                  )}
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                    {dim.type}
                  </span>
                  {!isDefault && (
                    <span className="text-[10px] uppercase tracking-wider text-neutral-900 dark:text-white font-semibold">
                      Custom
                    </span>
                  )}
                </div>

                <button
                  onClick={() => deleteField(dim.key, dim.label)}
                  className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 px-2 transition-colors"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>

        {/* Add new field */}
        <div className="rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
            Add a new field
          </h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Field name (e.g. Business Unit)"
              value={newField.label}
              onChange={(e) =>
                setNewField((f) => ({ ...f, label: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && addField()}
              className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
            />
            <select
              value={newField.type}
              onChange={(e) =>
                setNewField((f) => ({
                  ...f,
                  type: e.target.value as "select" | "text" | "date",
                }))
              }
              className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
            >
              <option value="select">Dropdown</option>
              <option value="text">Free text</option>
              <option value="date">Date</option>
            </select>
            <button
              onClick={addField}
              disabled={!newField.label.trim()}
              className="rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-1.5 text-sm font-semibold hover:opacity-90 disabled:opacity-30 transition-colors"
            >
              Add field
            </button>
          </div>
        </div>
      </section>

      {/* Values for dropdowns */}
      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 md:p-8">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
          Dropdown values
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
          Manage the options for each dropdown field.
        </p>
        <div className="space-y-8">
          {dimensions
            .filter((d) => d.type === "select")
            .map((dim) => (
              <div key={dim.key}>
                <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                  {dim.label}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {dim.values?.length ? (
                    dim.values.map((v) => (
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
                    ))
                  ) : (
                    <span className="text-xs text-neutral-400 italic">
                      No values yet — add one below.
                    </span>
                  )}
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
                    className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
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
