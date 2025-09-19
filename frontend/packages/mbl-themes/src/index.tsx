// 导出主题配置
export { theme, themeVariants, type ThemeVariant } from "./theme";

// 导出主题工具
export {
  useThemeColors,
  useThemeStyles,
  getThemeColorShades,
  getThemeColorShade,
  type ThemeColors,
  type ThemeStyles,
} from "./utils/theme-utils";

// 默认导出
import { theme, themeVariants } from "./theme";
import {
  useThemeColors,
  useThemeStyles,
  getThemeColorShades,
  getThemeColorShade,
} from "./utils/theme-utils";

export default {
  theme,
  themeVariants,
  useThemeColors,
  useThemeStyles,
  getThemeColorShades,
  getThemeColorShade,
};
