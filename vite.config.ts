import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import DefineOptions from "unplugin-vue-define-options/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), DefineOptions()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./packages', import.meta.url))
    },
    extensions: [] 
  },

  build: {
    outDir: "dist",
    lib: {
      entry: "./packages/index.ts",
      name: "vueWrapper",
      fileName: "vueWrapper",
    },
    rollupOptions: { external: ["vue"], output: { globals: { vue: "Vue" } } },
  },
});
