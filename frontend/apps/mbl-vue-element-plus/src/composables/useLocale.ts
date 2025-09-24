import { inject } from "vue";
import type { SupportedLocale } from "../utils/locale-detector";

/**
 * 语言相关的 composable
 * 提供语言状态和切换方法
 */
export function useLocale() {
  const localeContext = inject<{
    currentLocale: { value: SupportedLocale };
    setLocale: (locale: SupportedLocale) => void;
  }>("locale");

  if (!localeContext) {
    throw new Error("useLocale must be used within LocaleProvider");
  }

  const { currentLocale, setLocale } = localeContext;

  return {
    currentLocale,
    setLocale,
    // 便捷方法
    isChinese: () => currentLocale.value === "zh-CN",
    isEnglish: () => currentLocale.value === "en-US",
    // 切换语言
    switchToChinese: () => setLocale("zh-CN"),
    switchToEnglish: () => setLocale("en-US"),
  };
}
