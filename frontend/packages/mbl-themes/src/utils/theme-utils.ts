import { useMantineTheme } from "@mantine/core";
import { theme } from "../theme";
import React from "react";

// 颜色接口定义
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  currentTheme: string;
  isDark: boolean;
}

// 样式接口定义
export interface ThemeStyles {
  card: React.CSSProperties;
  button: {
    primary: React.CSSProperties;
    secondary: React.CSSProperties;
  };
  input: React.CSSProperties;
}

/**
 * 从 Mantine theme 获取颜色值
 * @returns 当前主题的颜色对象
 */
export function useThemeColors(): ThemeColors {
  const mantineTheme = useMantineTheme();

  // 获取主色调（第6个索引，对应 primaryShade: 6）
  const primaryColor = mantineTheme.colors[mantineTheme.primaryColor][6];
  const primaryLight = mantineTheme.colors[mantineTheme.primaryColor][1];
  const primaryDark = mantineTheme.colors[mantineTheme.primaryColor][8];

  // 根据颜色方案确定背景和文本颜色
  const isDark = (mantineTheme as any).colorScheme === "dark";

  return {
    primary: primaryColor,
    primaryLight,
    primaryDark,
    background: isDark ? "#1a1b1e" : "#ffffff",
    surface: isDark ? "#25262b" : "#f8f9fa",
    text: isDark ? "#c1c2c5" : "#212529",
    textSecondary: isDark ? "#909296" : "#6c757d",
    border: isDark ? "#373a40" : "#dee2e6",
    currentTheme: mantineTheme.primaryColor,
    isDark,
  };
}

/**
 * 从 Mantine theme 获取预定义样式
 * @returns 当前主题的样式对象
 */
export function useThemeStyles(): ThemeStyles {
  const colors = useThemeColors();

  return {
    card: {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    button: {
      primary: {
        backgroundColor: colors.primary,
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        padding: "8px 16px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        transition: "background-color 0.2s ease",
      },
      secondary: {
        backgroundColor: "transparent",
        color: colors.primary,
        border: `1px solid ${colors.primary}`,
        borderRadius: "6px",
        padding: "8px 16px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        transition: "all 0.2s ease",
      },
    },
    input: {
      backgroundColor: colors.background,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      padding: "8px 12px",
      fontSize: "14px",
      color: colors.text,
      outline: "none",
      transition: "border-color 0.2s ease",
    },
  };
}

/**
 * 获取指定主题颜色的所有色阶
 * @param colorName 颜色名称（如 'blue', 'green' 等）
 * @returns 颜色数组，包含10个色阶
 */
export function getThemeColorShades(colorName: string): string[] {
  if (!theme.colors) {
    console.warn("Theme colors not found");
    return [];
  }

  const colorTuple = theme.colors[colorName as keyof typeof theme.colors];
  if (!colorTuple) {
    console.warn(`Color ${colorName} not found in theme`);
    return theme.colors.blue ? [...theme.colors.blue] : []; // 默认返回蓝色
  }
  return [...colorTuple]; // 转换为可变数组
}

/**
 * 获取指定主题颜色的特定色阶
 * @param colorName 颜色名称
 * @param shade 色阶索引（0-9）
 * @returns 颜色值
 */
export function getThemeColorShade(colorName: string, shade: number): string {
  const shades = getThemeColorShades(colorName);
  return shades[Math.max(0, Math.min(9, shade))];
}
