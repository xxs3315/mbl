import globals from "globals";
import js from "@eslint/js";
import tsEslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tsEslint.config(
  {
    ignores: [
      "node_modules",
      "!.*",
      "**/dist",
      "**/dist-esm",
      "**/build",
      "apps/nextjs/.next",
      "**/styled-system",
    ],
  },

  {
    extends: [js.configs.recommended, ...tsEslint.configs.recommended],
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.node },
  },

  {
    files: [
      "apps/{nextjs,vite,storybook}/**/*.{jsx,tsx}",
      "packages/{components}/**/*.{jsx,tsx}",
    ],
    languageOptions: { globals: globals.browser },
    extends: [pluginReact.configs.flat.recommended],
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  eslintPluginPrettierRecommended,

  {
    rules: {
      "no-var": "warn",
      "prefer-rest-params": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "linebreak-style": ["off", "windows"],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
);
