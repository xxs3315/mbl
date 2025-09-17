import React, { createContext, useContext, useState } from "react";

type SupportedLocale = "zh-CN" | "en-US";

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
    // 从 localStorage 读取保存的语言环境，默认为 zh-CN
    const savedLocale = localStorage.getItem("app-locale") as SupportedLocale;
    const validLocales: SupportedLocale[] = ["zh-CN", "en-US"];
    return savedLocale && validLocales.includes(savedLocale)
      ? savedLocale
      : "zh-CN";
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
