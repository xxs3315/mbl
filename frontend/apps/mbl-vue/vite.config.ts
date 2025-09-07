import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    react(), // 添加React插件支持
    tsconfigPaths(),
  ],
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@xxs3315/mbl-lib",
      "@xxs3315/mbl-lib-example-data",
    ],
  },
  resolve: {
    alias: {
      // 确保React和Vue使用相同的版本
      react: "react",
      "react-dom": "react-dom",
    },
  },
});
