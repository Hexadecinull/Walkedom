export const SCHEMES = ["light", "system", "dark"];

export function applyScheme(scheme) {
  const root = document.documentElement;
  if (scheme === "dark") {
    root.setAttribute("data-theme", "dark");
  } else if (scheme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    // system
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }
}
