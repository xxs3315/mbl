/**
 * 浏览器语言检测工具
 * 除了中文之外全部识别为英文
 */

export type SupportedLocale = "zh-CN" | "en-US";

/**
 * 检测浏览器语言环境
 * @returns 支持的语言代码
 */
export const detectBrowserLocale = (): SupportedLocale => {
  try {
    // 获取浏览器语言设置，兼容不同浏览器
    const browserLocale =
      navigator.language ||
      (navigator as any).userLanguage ||
      (navigator as any).browserLanguage ||
      "zh-CN"; // 默认值

    // 提取主要语言代码（去掉地区和国家代码）
    const primaryLang = browserLocale.toLowerCase().split("-")[0];

    // 中文相关语言代码映射
    const chineseLanguageCodes = [
      "zh", // 中文
      "zh-cn", // 简体中文
      "zh-tw", // 繁体中文
      "zh-hk", // 香港中文
      "zh-mo", // 澳门中文
      "zh-sg", // 新加坡中文
    ];

    // 如果是中文相关语言，返回 zh-CN
    if (chineseLanguageCodes.includes(primaryLang)) {
      return "zh-CN";
    }

    // 其他所有语言都返回 en-US
    return "en-US";
  } catch (error) {
    console.warn("语言检测失败，使用默认语言:", error);
    return "zh-CN";
  }
};

/**
 * 获取语言检测的详细信息（用于调试）
 */
export const getLocaleDetectionInfo = () => {
  return {
    navigatorLanguage: navigator.language,
    userLanguage: (navigator as any).userLanguage,
    browserLanguage: (navigator as any).browserLanguage,
    languages: navigator.languages,
    detectedLocale: detectBrowserLocale(),
  };
};
