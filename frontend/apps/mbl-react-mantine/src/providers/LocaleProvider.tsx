import React, { createContext, useContext, useState } from "react";
import {
  detectBrowserLocale,
  type SupportedLocale,
} from "../utils/locale-detector";

interface LocaleContextType {
  currentLocale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};

interface LocaleProviderProps {
  children: React.ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>(() => {
    // 从 localStorage 读取保存的语言环境
    const savedLocale = localStorage.getItem("app-locale") as SupportedLocale;
    const validLocales: SupportedLocale[] = ["zh-CN", "en-US"];

    // 如果有保存的语言设置，使用保存的设置
    if (savedLocale && validLocales.includes(savedLocale)) {
      return savedLocale;
    }

    // 否则自动检测浏览器语言
    return detectBrowserLocale();
  });

  const setLocale = (locale: SupportedLocale) => {
    setCurrentLocale(locale);
    localStorage.setItem("app-locale", locale);
  };

  return (
    <LocaleContext.Provider value={{ currentLocale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};
