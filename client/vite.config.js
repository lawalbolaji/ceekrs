import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: "/src/index.jsx",
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: ({ name }) => {
          if (/\.css$/.test(name ?? "")) {
            return `styles/[name].[ext]`;
          }

          return `assets/[name].[ext]`;
        },
      },
    },
  },
  publicDir: "./.chrome",
});
