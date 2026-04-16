"use client";

import { useState } from "react";
import { TagGroup } from "@/lib/tags";

function CopyFlash({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-2 py-0.5 rounded whitespace-nowrap shadow-lg">
      Copied!
    </span>
  );
}

function TagChip({
  label,
  variant,
}: {
  label: string;
  variant: "primary" | "child";
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(label);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const base =
    "relative inline-flex items-center cursor-pointer select-none transition-all text-sm rounded-lg border font-medium";
  const styles =
    variant === "primary"
      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent px-3.5 py-1.5 hover:opacity-90"
      : "bg-white dark:bg-[#0A0A0B] text-neutral-600 dark:text-neutral-400 border-neutral-200/60 dark:border-white/[0.06] px-3 py-1 hover:border-neutral-400 dark:hover:border-white/[0.12] hover:text-neutral-900 dark:hover:text-white";

  return (
    <button onClick={copy} className={`${base} ${styles}`}>
      <CopyFlash show={copied} />
      {label}
    </button>
  );
}

export default function TagTiles({ groups }: { groups: TagGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex items-baseline gap-2 mb-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          Recommended Tags
        </h3>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          click any tag to copy
        </span>
      </div>
      <div className="space-y-3">
        {groups.map((g) => (
          <div
            key={g.primary}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.02] p-3"
          >
            <TagChip label={g.primary} variant="primary" />
            {g.children.length > 0 && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600 text-sm mx-1">
                  ›
                </span>
                {g.children.map((c) => (
                  <TagChip key={c} label={c} variant="child" />
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
