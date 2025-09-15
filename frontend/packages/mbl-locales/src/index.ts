import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zhCN from "./langs/zh-CN/ui.json";
import enUS from "./langs/en-US/ui.json";

// 支持的语言类型
export type SupportedLocale = "zh-CN" | "en-US";

// 语言资源
export const resources = {
  "zh-CN": {
    ui: zhCN,
  },
  "en-US": {
    ui: enUS,
  },
} as const;

// 默认语言
export const defaultLocale: SupportedLocale = "zh-CN";

// 获取当前语言
export const getCurrentLocale = (): SupportedLocale => {
  return (i18n.language as SupportedLocale) || defaultLocale;
};

// 设置语言
export const setLocale = (locale: SupportedLocale): void => {
  i18n.changeLanguage(locale);
};

// 获取翻译文本
export const t = (key: string, options?: any): string => {
  return i18n.t(key, options) as string;
};

// 初始化状态标记
let isInitialized = false;

// 初始化i18n配置
export const initI18n = (locale: SupportedLocale = defaultLocale) => {
  if (!isInitialized) {
    i18n.use(initReactI18next).init({
      lng: locale,
      fallbackLng: defaultLocale,
      resources,
      defaultNS: "ui",
      ns: ["ui"],
      interpolation: {
        escapeValue: false,
      },
    });
    isInitialized = true;
  } else {
    // 如果已经初始化，只改变语言
    i18n.changeLanguage(locale);
  }
};

// 导出i18n实例
export { i18n };

// 导出语言资源类型
export type UIResource = typeof zhCN;
