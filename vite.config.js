// @ts-check
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["cjs", "es"],
      fileName: "index",
    },
    rollupOptions: { external: ["react"] },
  },
});
