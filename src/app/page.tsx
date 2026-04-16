"use client";

import { useState, useCallback } from "react";
import { buildName } from "@/lib/name-builder";
import { getRecommendedTags, TagGroup } from "@/lib/tags";
import TagTiles from "@/components/tag-tiles";
import Flame from "@/components/flame";
import { useUser } from "@/lib/use-user";

export default function GeneratorPage() {
  const { user, loading } = useUser();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const update = useCallback(
    (key: string, value: string) =>
      setSelections((prev) => ({ ...prev, [key]: value })),
    []
  );

  const reset = () => setSelections({});

  if (loading || !user) return null;

  const dimensions = user.config;
  const name = buildName(dimensions, selections);
  const tags: TagGroup[] = getRecommendedTags(selections);

  const copyName = async () => {
    if (!name) return;
    await navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-2">Orbit Web App</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-2">
          Orbit Namer
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Build a consistent naming string for any Braze asset.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 md:p-8 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {dimensions.map((dim) => {
            if (dim.type === "select") {
              return (
                <label key={dim.key} className="block">
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    {dim.label}
                  </span>
                  <select
                    value={selections[dim.key] ?? ""}
                    onChange={(e) => update(dim.key, e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  >
                    <option value="">—</option>
                    {dim.values?.map((v) => (
                      <option key={v} value={v}>
                        {dim.labels?.[v] ? `${dim.labels[v]} (${v})` : v}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }
            if (dim.type === "date") {
              return (
                <label key={dim.key} className="block">
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide inline-flex items-center gap-1.5">
                    {dim.label}
                    <span
                      className="group relative inline-flex h-4 w-4 items-center justify-center rounded-full border border-neutral-400 dark:border-neutral-600 text-[10px] font-bold text-neutral-500 dark:text-neutral-400 cursor-help"
                      tabIndex={0}
                    >
                      ?
                      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-md bg-neutral-900 text-white text-xs font-normal normal-case tracking-normal px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                        If you&rsquo;re using Braze&rsquo;s built-in versioning,
                        you don&rsquo;t need a date — Braze tracks revisions
                        automatically. Only add a date if you&rsquo;re creating
                        a new Canvas or Campaign per version.
                      </span>
                    </span>
                  </span>
                  <input
                    type="date"
                    value={selections[dim.key] ?? ""}
                    onChange={(e) => update(dim.key, e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  />
                </label>
              );
            }
            return (
              <label key={dim.key} className="block">
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  {dim.label}
                </span>
                <input
                  type="text"
                  placeholder={dim.label}
                  value={selections[dim.key] ?? ""}
                  onChange={(e) => update(dim.key, e.target.value)}
                  className="mt-1.5 block w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Output */}
      <div className="rounded-2xl border border-neutral-900 dark:border-neutral-900 dark:border-white/30 bg-neutral-900 dark:bg-neutral-950 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
            Output
          </span>
          <div className="flex gap-2">
            <button
              onClick={reset}
              className="text-xs text-neutral-400 hover:text-white transition-colors px-2 py-1"
            >
              Reset
            </button>
            <button
              onClick={copyName}
              disabled={!name}
              className="text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 hover:opacity-90 disabled:opacity-30 disabled:hover:opacity-100 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <code className="block font-mono text-base md:text-lg text-white break-all min-h-[1.75rem]">
          {name || (
            <span className="text-neutral-600">
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
