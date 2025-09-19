import { defineConfig } from "tsdown";

export default defineConfig({
   entry: {
      index: "src/index.ts",
   },
   format: ["esm"],
   outDir: "dist",
   sourcemap: true,
   minify: false,
   target: "es2020",
   platform: "browser",
   // Don't bundle anything - just compile TypeScript to JavaScript
   external: [/(.*)/],
   // Don't create chunks, compile each file separately
   splitting: false,
   loader: {
      ".svg": "text",
      ".css": "text",
      ".md": "text",
   },
});
