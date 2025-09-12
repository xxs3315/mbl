import React, { createContext, useContext, ReactNode } from "react";
import { useThemeColors, type ThemeColors } from "../utils/theme-utils";

// Theme Context 类型定义
interface ThemeContextType {
  colors: ThemeColors;
}

// 创建 Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider Props 类型
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme Provider 组件
export function ThemeProvider({ children }: ThemeProviderProps) {
  const colors = useThemeColors();

  const value: ThemeContextType = {
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// useTheme Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// 便捷的 useThemeColors Hook，直接返回 colors
export const useThemeColorsContext = () => {
  const { colors } = useTheme();
  return colors;
};
