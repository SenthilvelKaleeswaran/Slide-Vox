import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../extension",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "src/extension/Popup.tsx"),
        viewer: path.resolve(__dirname, "src/App.tsx")
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.match(/\.(png|jpe?g|gif|svg|webp|ico)$/i)) {
            return `images/[name].[ext]`;
          }
          if (assetInfo.name?.match(/\.css$/i)) {
            return `css/[name].[ext]`;
          }
          return `assets/[name].[ext]`;
        },
      },
    },
  },
});