import { defineConfig } from "tsdown";

export default defineConfig({
   entry: {
      index: "src/index.ts",
      example: "src/example.ts",
   },
   format: ["esm"],
   outDir: "dist",
   sourcemap: true,
   minify: false,
   target: "es2020",
   platform: "browser",
   // Don't bundle external dependencies for the library build
   external: ["lit", "lucide", "highlight.js", "marked", "katex"],
   loader: {
      ".svg": "text",
      ".css": "text",
      ".md": "text",
   },
   define: {
      "process.env.NODE_ENV": '"production"',
      global: "globalThis",
   },
});
