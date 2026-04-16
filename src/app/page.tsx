"use client";

import { useState, useCallback, useEffect } from "react";
import { buildName } from "@/lib/name-builder";
import { getRecommendedTags, TagGroup } from "@/lib/tags";
import { DEFAULT_DIMENSIONS, DimensionConfig } from "@/lib/defaults";
import TagTiles from "@/components/tag-tiles";
import { useUser } from "@/lib/use-user";

export default function GeneratorPage() {
  const { user, loading } = useUser();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(true);

  useEffect(() => {
    try {
      setBannerDismissed(localStorage.getItem("orbit_namer_support_dismissed") === "1");
    } catch {
      setBannerDismissed(false);
    }
  }, []);

  const update = useCallback(
    (key: string, value: string) =>
      setSelections((prev) => ({ ...prev, [key]: value })),
    []
  );

  const reset = () => setSelections({});

  const dismissBanner = () => {
    setBannerDismissed(true);
    try { localStorage.setItem("orbit_namer_support_dismissed", "1"); } catch {}
  };

  // Guest mode: use defaults when not logged in
  const dimensions: DimensionConfig[] = user?.config ?? DEFAULT_DIMENSIONS;
  const name = buildName(dimensions, selections);
  const tags: TagGroup[] = getRecommendedTags(selections);
  const filledCount = Object.values(selections).filter(Boolean).length;

  const copyName = async () => {
    if (!name) return;
    await navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-6 h-6 border-2 border-neutral-200 dark:border-white/[0.06] border-t-neutral-900 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1080px] mx-auto px-6 py-12">
      {/* Support banner */}
      {!bannerDismissed && (
        <div className="mb-6 rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.02] px-5 py-3 flex items-center justify-between gap-4">
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
          {!user && <span className="text-xs ml-2 text-neutral-400 dark:text-neutral-600">Sign in to save custom fields.</span>}
        </p>
      </div>

      {/* Desktop: side-by-side · Mobile: stacked */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: form */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl border border-neutral-200/60 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.02] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                Dimensions
              </span>
              {filledCount > 0 && (
                <button
                  onClick={reset}
                  className="text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:outline-none rounded"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {dimensions.map((dim) => {
                const inputCls = "mt-1.5 block w-full rounded-lg border border-neutral-200/60 dark:border-white/[0.06] bg-white dark:bg-[#0A0A0B] px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white";
                if (dim.type === "select") {
                  return (
                    <label key={dim.key} className="block">
                      <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                        {dim.label}
                      </span>
                      <select
                        value={selections[dim.key] ?? ""}
                        onChange={(e) => update(dim.key, e.target.value)}
                        className={inputCls}
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
                      <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide inline-flex items-center gap-1.5">
                        {dim.label}
                        <span
                          className="group relative inline-flex h-4 w-4 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 cursor-help"
                          tabIndex={0}
                          role="note"
                        >
                          ?
                          <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-normal normal-case tracking-normal px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
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
                        className={inputCls}
                      />
                    </label>
                  );
                }
                return (
                  <label key={dim.key} className="block">
                    <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                      {dim.label}
                    </span>
                    <input
                      type="text"
                      placeholder={dim.label}
                      value={selections[dim.key] ?? ""}
                      onChange={(e) => update(dim.key, e.target.value)}
                      className={inputCls}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: output + tags (sticky on desktop) */}
        <div className="w-full lg:w-[380px] lg:sticky lg:top-16 shrink-0">
          {/* Output */}
          <div className="rounded-2xl border border-neutral-900 dark:border-white/10 bg-neutral-900 dark:bg-[#111113] p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Output
              </span>
              <button
                onClick={copyName}
                disabled={!name}
                className="text-xs font-semibold bg-white text-neutral-900 rounded-md px-3 py-1.5 hover:opacity-90 disabled:opacity-30 transition-opacity focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <code className="block font-mono text-base text-white break-all min-h-[1.75rem]">
              {name || (
                <span className="text-neutral-600">
                  <span className="hidden lg:inline">Make selections to the left…</span>
                  <span className="lg:hidden">Make selections above…</span>
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
