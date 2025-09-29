import { defineConfig } from "vitest/config";

export default defineConfig({
   test: {
      globals: true,
      environment: "node",
      include: ["src/tests/**/*.test.ts"],
      coverage: {
         provider: "v8",
         reporter: ["text", "html"],
         exclude: [
            "src/tests/**",
            "example/**",
            "dist/**",
         ],
      },
      server: {
         deps: {
            inline: ["html-parse-string"],
         },
      },
   },
   ssr: {
      noExternal: ["html-parse-string"],
   },
});