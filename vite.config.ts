import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [react(), eslint()],
  server: {
    port: parseInt(process.env.PORT || "3000"),
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
