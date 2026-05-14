import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Set VITE_BASE_PATH env var to override (e.g. "/" for a custom domain)
const base = process.env.VITE_BASE_PATH ?? "/Walkedom/";

export default defineConfig({
  plugins: [react()],
  base,
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
