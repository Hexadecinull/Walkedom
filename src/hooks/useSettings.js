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
    } catch (_e) { return DEFAULTS; }
  });

  useEffect(() => {
    localStorage.setItem("walkedom-settings", JSON.stringify(settings));
    applyScheme(settings.scheme);
  }, [settings]);

  // Apply scheme on first mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { applyScheme(settings.scheme); }, []);

  const update = (key, value) => setSettings((s) => ({ ...s, [key]: value }));

  return { settings, update };
}
