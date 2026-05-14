/** Parse a text file into an array of entry strings */
export function parseEntryFile(text) {
  // Support: .wheel JSON, CSV, newline-separated, tab-separated
  const trimmed = text.trim();

  // .wheel format
  if (trimmed.startsWith("{")) {
    try {
      const json = JSON.parse(trimmed);
      // single wheel or array
      const wheel = json.wheels?.[0] ?? json;
      const entries = wheel?.wheelConfig?.entries ?? wheel?.entries ?? [];
      return entries.map((e) => (typeof e === "string" ? e : e.text)).filter(Boolean);
    } catch {}
  }

  // JSON array of strings
  if (trimmed.startsWith("[")) {
    try {
      const arr = JSON.parse(trimmed);
      if (Array.isArray(arr)) return arr.map(String).filter(Boolean);
    } catch {}
  }

  // CSV single line
  if (!trimmed.includes("\n") && trimmed.includes(",")) {
    return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
  }

  // Newline / TSV
  return trimmed
    .split(/\r?\n/)
    .flatMap((line) => line.split("\t"))
    .map((s) => s.trim())
    .filter(Boolean);
}
