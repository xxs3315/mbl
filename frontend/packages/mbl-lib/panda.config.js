import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{ts,tsx,js,jsx}"],
  exclude: [],
  outdir: "src/styled-system",
  // 生成CommonJS格式以匹配TypeScript构建
  format: "cjs",
  // 确保生成的文件能被TypeScript正确引用
  outExtension: "js",
});
