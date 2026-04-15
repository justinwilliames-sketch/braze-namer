"use client";

import { useState, useEffect, useCallback } from "react";
import { loadDimensions } from "@/lib/storage";
import { DimensionConfig } from "@/lib/defaults";
import { buildName } from "@/lib/name-builder";
import { getRecommendedTags, TagGroup } from "@/lib/tags";
import TagTiles from "@/components/tag-tiles";

export default function GeneratorPage() {
  const [dimensions, setDimensions] = useState<DimensionConfig[]>([]);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDimensions(loadDimensions());
  }, []);

  const update = useCallback(
    (key: string, value: string) =>
      setSelections((prev) => ({ ...prev, [key]: value })),
    []
  );

  const reset = () => setSelections({});

  const name = buildName(dimensions, selections);
  const tags: TagGroup[] = getRecommendedTags(selections);

  const copyName = async () => {
    if (!name) return;
    await navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (dimensions.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-1">Name Generator</h1>
      <p className="text-sm text-neutral-500 mb-8">
        Build a Braze naming convention string.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {dimensions.map((dim) =>
          dim.type === "select" ? (
            <label key={dim.key} className="block">
              <span className="text-xs font-medium text-neutral-600 uppercase tracking-wide">
                {dim.label}
              </span>
              <select
                value={selections[dim.key] ?? ""}
                onChange={(e) => update(dim.key, e.target.value)}
                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <option value="">—</option>
                {dim.values?.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label key={dim.key} className="block">
              <span className="text-xs font-medium text-neutral-600 uppercase tracking-wide">
                {dim.label}
              </span>
              <input
                type="text"
                placeholder={dim.label}
                value={selections[dim.key] ?? ""}
                onChange={(e) => update(dim.key, e.target.value)}
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </label>
          )
        )}
      </div>

      {/* Output */}
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
            Output
          </span>
          <div className="flex gap-2">
            <button
              onClick={reset}
              className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={copyName}
              disabled={!name}
              className="text-xs font-medium text-neutral-900 bg-white border border-neutral-300 rounded px-3 py-1 hover:bg-neutral-100 disabled:opacity-30 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <code className="block font-mono text-base text-neutral-900 break-all min-h-[1.5rem]">
          {name || (
            <span className="text-neutral-300">
              Make selections above…
            </span>
          )}
        </code>
      </div>

      {/* Tag recommendations */}
      <TagTiles groups={tags} />
    </div>
  );
}
