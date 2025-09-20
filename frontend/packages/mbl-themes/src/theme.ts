import { type MantineColorsTuple, createTheme } from "@mantine/core";

// 定义自定义颜色主题
const blue: MantineColorsTuple = [
  "#e7f5ff",
  "#d0ebff",
  "#a5d8ff",
  "#74c0fc",
  "#4dabf7",
  "#339af0",
  "#228be6",
  "#1c7ed6",
  "#1971c2",
  "#1864ab",
];

const green: MantineColorsTuple = [
  "#ebfbee",
  "#d3f9d8",
  "#b2f2bb",
  "#8ce99a",
  "#69db7c",
  "#51cf66",
  "#40c057",
  "#37b24d",
  "#2f9e44",
  "#2b8a3e",
];

const purple: MantineColorsTuple = [
  "#f3e8ff",
  "#e9d5ff",
  "#dbbbfe",
  "#cc9bfc",
  "#be7af8",
  "#b065f1",
  "#a855e7",
  "#9c4ad4",
  "#8b3fbd",
  "#7c3aa6",
];

const orange: MantineColorsTuple = [
  "#fff4e6",
  "#ffe8cc",
  "#ffd8a8",
  "#ffc078",
  "#ffa94d",
  "#ff922b",
  "#fd7e14",
  "#f76707",
  "#e8590c",
  "#d63384",
];

const red: MantineColorsTuple = [
  "#fff5f5",
  "#ffe3e3",
  "#ffc9c9",
  "#ffa8a8",
  "#ff8787",
  "#ff6b6b",
  "#fa5252",
  "#f03e3e",
  "#e03131",
  "#c92a2a",
];

const teal: MantineColorsTuple = [
  "#e6fffa",
  "#b3f5d3",
  "#81e6d9",
  "#4fd1c7",
  "#38b2ac",
  "#319795",
  "#2c7a7b",
  "#285e61",
  "#234e52",
  "#1d4044",
];

// 创建主题配置
export const theme = createTheme({
  primaryColor: "blue",
  primaryShade: 7,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace: "Monaco, Courier, monospace",
  headings: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: "600",
  },
  colors: {
    blue,
    green,
    purple,
    orange,
    red,
    teal,
  },
  shadows: {
    xs: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
    sm: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
  spacing: {
    xs: "8px",
    sm: "12px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  breakpoints: {
    xs: "36em",
    sm: "48em",
    md: "62em",
    lg: "75em",
    xl: "88em",
  },
});

// 主题变体配置
export const themeVariants = {
  blue: { primaryColor: "blue" as const },
  green: { primaryColor: "green" as const },
  purple: { primaryColor: "purple" as const },
  orange: { primaryColor: "orange" as const },
  red: { primaryColor: "red" as const },
  teal: { primaryColor: "teal" as const },
};

export type ThemeVariant = keyof typeof themeVariants;
