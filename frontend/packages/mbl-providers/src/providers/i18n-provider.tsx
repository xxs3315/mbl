import React, { createContext, useContext, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { i18n, initI18n, type SupportedLocale } from "@xxs3315/mbl-locales";

export interface I18nContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, options?: any) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export interface I18nProviderProps {
  children: React.ReactNode;
  defaultLocale?: SupportedLocale;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  defaultLocale = "zh-CN",
}) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(defaultLocale);

  // 初始化i18n
  useEffect(() => {
    initI18n(defaultLocale);
    setLocaleState(defaultLocale);
  }, [defaultLocale]);

  const setLocale = (newLocale: SupportedLocale) => {
    i18n.changeLanguage(newLocale);
    setLocaleState(newLocale);
  };

  const t = (key: string, options?: any): string => {
    return i18n.t(key, options) as string;
  };

  const contextValue: I18nContextType = {
    locale,
    setLocale,
    t,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
