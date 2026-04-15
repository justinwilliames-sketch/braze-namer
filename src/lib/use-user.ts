"use client";

import { useEffect, useState, useCallback } from "react";
import { DimensionConfig, DEFAULT_DIMENSIONS } from "./defaults";

export interface User {
  id: string;
  email: string;
  config: DimensionConfig[];
  theme: "auto" | "light" | "dark";
  secret_question: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/me");
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      // Ensure defaults are merged in case schema grew
      if (!data.config || data.config.length === 0) {
        data.config = DEFAULT_DIMENSIONS;
      }
      setUser(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveConfig = useCallback(
    async (config: DimensionConfig[]) => {
      await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      setUser((u) => (u ? { ...u, config } : u));
    },
    []
  );

  const setTheme = useCallback(async (theme: "auto" | "light" | "dark") => {
    await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "theme", theme }),
    });
    setUser((u) => (u ? { ...u, theme } : u));
  }, []);

  return { user, loading, refresh, saveConfig, setTheme };
}
