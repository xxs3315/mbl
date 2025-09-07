import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// @ts-expect-error type safe
import veauryVitePlugins from "veaury/vite/esm/index.mjs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // vue(),
    // react(), // 添加React插件支持
    tsconfigPaths(),
    // Turn off vue and vuejsx plugins
    // vue(),
    // vueJsx(),
    // When the type of veauryVitePlugins is set to vue,
    // only jsx in files in the directory named 'react_app' will be parsed with react jsx,
    // and jsx in other files will be parsed with vue jsx
    veauryVitePlugins({
      type: "vue",
      // Configuration of @vitejs/plugin-vue
      // vueOptions: {...},
      // Configuration of @vitejs/plugin-react
      // reactOptions: {...},
      // Configuration of @vitejs/plugin-vue-jsx
      // vueJsxOptions: {...}
    }),
  ],
  // optimizeDeps: {
  //   include: [
  //     "react",
  //     "react-dom",
  //     "@xxs3315/mbl-lib",
  //     "@xxs3315/mbl-lib-example-data",
  //   ],
  // },
  // resolve: {
  //   alias: {
  //     // 确保React和Vue使用相同的版本
  //     react: "react",
  //     "react-dom": "react-dom",
  //   },
  // },
});
