import { useState, useEffect } from "react";
import { applyScheme } from "../utils/theme";

const DEFAULTS = {
  scheme: "system",
  showClickHint: true,
  soundEnabled: true,
};

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("walkedom-settings") || "{}");
      return { ...DEFAULTS, ...stored };
    } catch { return DEFAULTS; }
  });

  useEffect(() => {
    localStorage.setItem("walkedom-settings", JSON.stringify(settings));
    applyScheme(settings.scheme);
  }, [settings]);

  // also apply on mount
  useEffect(() => { applyScheme(settings.scheme); }, []);

  const update = (key, value) => setSettings((s) => ({ ...s, [key]: value }));

  return { settings, update };
}
