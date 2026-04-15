"use client";

import { useState } from "react";
import { TagGroup } from "@/lib/tags";

function CopyFlash({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs bg-neutral-800 text-white px-2 py-0.5 rounded whitespace-nowrap">
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
    "relative inline-flex items-center cursor-pointer select-none transition-colors text-sm rounded-md border";
  const styles =
    variant === "primary"
      ? "bg-neutral-900 text-white border-neutral-900 px-3 py-1.5 font-medium hover:bg-neutral-700"
      : "bg-white text-neutral-700 border-neutral-300 px-2.5 py-1 hover:bg-neutral-100";

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
    <div className="mt-8">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-4">
        Recommended Tags
        <span className="ml-2 font-normal normal-case tracking-normal text-neutral-400">
          — click to copy
        </span>
      </h3>
      <div className="space-y-3">
        {groups.map((g) => (
          <div key={g.primary} className="flex flex-wrap items-center gap-2">
            <TagChip label={g.primary} variant="primary" />
            {g.children.length > 0 && (
              <>
                <span className="text-neutral-300 text-sm">›</span>
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
