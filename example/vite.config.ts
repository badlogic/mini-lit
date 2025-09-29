import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import packageJson from "../package.json";

export default defineConfig({
   plugins: [tailwindcss(), react()],
   define: {
      __MINI_LIT_VERSION__: JSON.stringify(packageJson.version),
   },
});
