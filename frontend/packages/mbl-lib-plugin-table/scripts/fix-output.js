const fs = require("fs");
const path = require("path");

/**
 * 修复构建输出目录结构
 * 将 dist/mbl-lib-plugin-table/src/* 移动到 dist/*
 * 将 dist-esm/mbl-lib-plugin-table/src/* 移动到 dist-esm/*
 */

function moveFiles(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    console.log(`Source directory ${sourceDir} does not exist, skipping...`);
    return;
  }

  // 确保目标目录存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 读取源目录中的所有文件
  const files = fs.readdirSync(sourceDir);

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      // 递归处理子目录
      moveFiles(sourcePath, targetPath);
    } else {
      // 移动文件
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Moved: ${sourcePath} -> ${targetPath}`);
    }
  }
}

function removeDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Removed directory: ${dir}`);
  }
}

console.log("Fixing build output structure...");

// 处理 dist 目录
const distSourceDir = path.join(
  __dirname,
  "..",
  "dist",
  "mbl-lib-plugin-table",
  "src",
);
const distTargetDir = path.join(__dirname, "..", "dist");

if (fs.existsSync(distSourceDir)) {
  moveFiles(distSourceDir, distTargetDir);
  // 删除原始目录结构
  removeDirectory(path.join(__dirname, "..", "dist", "mbl-lib-plugin-table"));
}

// 处理 dist-esm 目录
const distEsmSourceDir = path.join(
  __dirname,
  "..",
  "dist-esm",
  "mbl-lib-plugin-table",
  "src",
);
const distEsmTargetDir = path.join(__dirname, "..", "dist-esm");

if (fs.existsSync(distEsmSourceDir)) {
  moveFiles(distEsmSourceDir, distEsmTargetDir);
  // 删除原始目录结构
  removeDirectory(
    path.join(__dirname, "..", "dist-esm", "mbl-lib-plugin-table"),
  );
}

// 删除 mbl-utils 目录（这些不应该在插件包中）
removeDirectory(path.join(__dirname, "..", "dist", "mbl-locales"));
removeDirectory(path.join(__dirname, "..", "dist", "mbl-providers"));
removeDirectory(path.join(__dirname, "..", "dist", "mbl-themes"));
removeDirectory(path.join(__dirname, "..", "dist", "mbl-utils"));
removeDirectory(path.join(__dirname, "..", "dist", "mbl-dnd"));
removeDirectory(path.join(__dirname, "..", "dist-esm", "mbl-locales"));
removeDirectory(path.join(__dirname, "..", "dist-esm", "mbl-providers"));
removeDirectory(path.join(__dirname, "..", "dist-esm", "mbl-themes"));
removeDirectory(path.join(__dirname, "..", "dist-esm", "mbl-utils"));
removeDirectory(path.join(__dirname, "..", "dist-esm", "mbl-dnd"));

console.log("Build output structure fixed!");
