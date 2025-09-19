// 导出所有Providers
export {
  CurrentSelectedIdProvider,
  useCurrentSelectedId,
  type CurrentSelectedIdProviderProps,
  type CurrentSelectedIdProviderState,
} from "./providers/current-selected-id-provider";

export {
  ThemeProvider,
  useTheme,
  useThemeColorsContext,
  type ThemeContextType,
  type ThemeProviderProps,
} from "./providers/theme-provider";

export {
  DpiProvider,
  useDpi,
  type DpiProviderProps,
  type DpiProviderState,
} from "./providers/dpi-provider";

export {
  I18nProvider,
  useI18n,
  type I18nContextType,
  type I18nProviderProps,
} from "./providers/i18n-provider";

// 默认导出
import { CurrentSelectedIdProvider } from "./providers/current-selected-id-provider";
import { ThemeProvider } from "./providers/theme-provider";
import { DpiProvider } from "./providers/dpi-provider";
import { I18nProvider } from "./providers/i18n-provider";

export default {
  CurrentSelectedIdProvider,
  ThemeProvider,
  DpiProvider,
  I18nProvider,
};
