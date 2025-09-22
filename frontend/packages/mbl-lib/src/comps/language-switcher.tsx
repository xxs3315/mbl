import React from "react";
import { SegmentedControl } from "@mantine/core";
import { useI18n } from "@xxs3315/mbl-providers";
import type { SupportedLocale } from "@xxs3315/mbl-locales";

interface LanguageSwitcherProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  size = "xs",
  className,
}) => {
  const { locale, setLocale, t } = useI18n();

  const handleLanguageChange = (value: string) => {
    setLocale(value as SupportedLocale);
  };

  return (
    <SegmentedControl
      value={locale}
      onChange={handleLanguageChange}
      data={[
        {
          label: t("languageSwitcher.chinese", { ns: "layout" }),
          value: "zh-CN",
        },
        {
          label: t("languageSwitcher.english", { ns: "layout" }),
          value: "en-US",
        },
      ]}
      size={size}
      className={className}
    />
  );
};
