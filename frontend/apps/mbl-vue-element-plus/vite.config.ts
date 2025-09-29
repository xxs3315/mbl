import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// @ts-expect-error type safe
import veauryVitePlugins from "veaury/vite/esm/index.mjs";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
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
    base: env.VITE_CONFIG_BASE_URL,
  };
});
