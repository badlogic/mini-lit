import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import packageJson from "../package.json";

export default defineConfig({
   plugins: [tailwindcss()],
   define: {
      __MINI_LIT_VERSION__: JSON.stringify(packageJson.version),
   },
});
