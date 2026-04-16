"use client";

import { useState, useCallback } from "react";
import { buildName } from "@/lib/name-builder";
import { getRecommendedTags, TagGroup } from "@/lib/tags";
import TagTiles from "@/components/tag-tiles";
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

  const filledCount = Object.values(selections).filter(Boolean).length;

  const [bannerDismissed, setBannerDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try { return localStorage.getItem("orbit_namer_support_dismissed") === "1"; } catch { return false; }
  });
  const dismissBanner = () => {
    setBannerDismissed(true);
    try { localStorage.setItem("orbit_namer_support_dismissed", "1"); } catch {}
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Support banner */}
      {!bannerDismissed && (
        <div className="mb-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-5 py-3 flex items-center justify-between gap-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Orbit Namer is free. If it saves you time, consider supporting development.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://buymeacoffee.com/justinwilliames"
              target="_blank"
              rel="noopener"
              className="text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Buy me a coffee
            </a>
            <button
              onClick={dismissBanner}
              className="text-xs text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white transition-colors px-1"
            >
              No thanks
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-2">
          Orbit Web App
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-2">
          Orbit Namer
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Build a consistent naming string for any Braze asset.
        </p>
      </div>

      {/* Desktop: side-by-side · Mobile: stacked */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: form */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                Dimensions
              </span>
              {filledCount > 0 && (
                <button
                  onClick={reset}
                  className="text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
        </div>

        {/* Right: output + tags (sticky on desktop) */}
        <div className="w-full lg:w-[380px] lg:sticky lg:top-20 shrink-0">
          {/* Output */}
          <div className="rounded-2xl border border-neutral-900 dark:border-white/10 bg-neutral-900 dark:bg-neutral-950 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Output
              </span>
              <button
                onClick={copyName}
                disabled={!name}
                className="text-xs font-semibold bg-white text-neutral-900 rounded-md px-3 py-1.5 hover:opacity-90 disabled:opacity-30 transition-opacity"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <code className="block font-mono text-base text-white break-all min-h-[1.75rem]">
              {name || (
                <span className="text-neutral-600">
                  Make selections to the left…
                </span>
              )}
            </code>
            {filledCount > 0 && (
              <p className="text-[11px] text-neutral-500 mt-3">
                {filledCount} of {dimensions.length} dimensions filled
              </p>
            )}
          </div>

          {/* Tag recommendations */}
          <TagTiles groups={tags} />
        </div>
      </div>
    </div>
  );
}
