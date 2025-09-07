// 主题变体配置
export const themeVariants = {
  blue: {
    primaryColor: "#409EFF",
    name: "蓝色",
    cssVars: {
      "--el-color-primary": "#409EFF",
      "--el-color-primary-light-3": "#79bbff",
      "--el-color-primary-light-5": "#a0cfff",
      "--el-color-primary-light-7": "#c6e2ff",
      "--el-color-primary-light-8": "#d9ecff",
      "--el-color-primary-light-9": "#ecf5ff",
      "--el-color-primary-dark-2": "#337ecc",
    },
  },
  green: {
    primaryColor: "#67C23A",
    name: "绿色",
    cssVars: {
      "--el-color-primary": "#67C23A",
      "--el-color-primary-light-3": "#95d475",
      "--el-color-primary-light-5": "#b3e19d",
      "--el-color-primary-light-7": "#d1edc4",
      "--el-color-primary-light-8": "#e1f3d8",
      "--el-color-primary-light-9": "#f0f9ff",
      "--el-color-primary-dark-2": "#529b2e",
    },
  },
  purple: {
    primaryColor: "#8B5CF6",
    name: "紫色",
    cssVars: {
      "--el-color-primary": "#8B5CF6",
      "--el-color-primary-light-3": "#a78bfa",
      "--el-color-primary-light-5": "#c4b5fd",
      "--el-color-primary-light-7": "#ddd6fe",
      "--el-color-primary-light-8": "#ede9fe",
      "--el-color-primary-light-9": "#f5f3ff",
      "--el-color-primary-dark-2": "#7c3aed",
    },
  },
  orange: {
    primaryColor: "#E6A23C",
    name: "橙色",
    cssVars: {
      "--el-color-primary": "#E6A23C",
      "--el-color-primary-light-3": "#eebe77",
      "--el-color-primary-light-5": "#f3d19e",
      "--el-color-primary-light-7": "#f8e3c5",
      "--el-color-primary-light-8": "#faecd8",
      "--el-color-primary-light-9": "#fdf6ec",
      "--el-color-primary-dark-2": "#b88230",
    },
  },
  red: {
    primaryColor: "#F56C6C",
    name: "红色",
    cssVars: {
      "--el-color-primary": "#F56C6C",
      "--el-color-primary-light-3": "#f89898",
      "--el-color-primary-light-5": "#fab6b6",
      "--el-color-primary-light-7": "#fcd3d3",
      "--el-color-primary-light-8": "#fde2e2",
      "--el-color-primary-light-9": "#fef0f0",
      "--el-color-primary-dark-2": "#c45656",
    },
  },
  teal: {
    primaryColor: "#20B2AA",
    name: "青色",
    cssVars: {
      "--el-color-primary": "#20B2AA",
      "--el-color-primary-light-3": "#5bc0be",
      "--el-color-primary-light-5": "#8dd3d1",
      "--el-color-primary-light-7": "#bfe6e5",
      "--el-color-primary-light-8": "#d9f2f1",
      "--el-color-primary-light-9": "#f2f9f9",
      "--el-color-primary-dark-2": "#1a8e88",
    },
  },
} as const;

export type ThemeVariant = keyof typeof themeVariants;

// 应用主题 CSS 变量
export const applyTheme = (theme: ThemeVariant) => {
  const themeConfig = themeVariants[theme];
  if (!themeConfig) return;

  const root = document.documentElement;
  Object.entries(themeConfig.cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

// 获取当前主题
export const getCurrentTheme = (): ThemeVariant => {
  const savedTheme = localStorage.getItem(
    "vue-element-plus-theme",
  ) as ThemeVariant;
  return savedTheme && themeVariants[savedTheme] ? savedTheme : "blue";
};

// 保存主题
export const saveTheme = (theme: ThemeVariant) => {
  localStorage.setItem("vue-element-plus-theme", theme);
};
