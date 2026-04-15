"use client";

import { useEffect } from "react";

export type ThemePref = "auto" | "light" | "dark";

export function applyTheme(pref: ThemePref) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (pref === "auto") {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", dark);
  } else {
    root.classList.toggle("dark", pref === "dark");
  }
}

export default function ThemeProvider({
  pref,
}: {
  pref: ThemePref | undefined;
}) {
  useEffect(() => {
    const p = pref ?? "auto";
    applyTheme(p);

    if (p === "auto") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("auto");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [pref]);

  return null;
}
