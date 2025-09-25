import React from "react";
import { ActionIcon, Menu, Text } from "@mantine/core";
import { IconLanguage } from "@tabler/icons-react";

export type SupportedLocale = "zh-CN" | "en-US";

interface LanguageSwitcherProps {
  currentLocale: SupportedLocale;
  onLocaleChange: (locale: SupportedLocale) => void;
}

const localeLabels: Record<SupportedLocale, string> = {
  "zh-CN": "中文",
  "en-US": "English",
};

const localeFlags: Record<SupportedLocale, string> = {
  "zh-CN": "🇨🇳",
  "en-US": "🇺🇸",
};

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
  onLocaleChange,
}) => {
  const handleLocaleChange = (locale: SupportedLocale) => {
    console.log(
      "LanguageSwitcher: Changing locale from",
      currentLocale,
      "to",
      locale,
    );
    onLocaleChange(locale);
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          size="lg"
          aria-label="切换语言"
          className="language-switcher-button"
        >
          <IconLanguage size={20} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Select language</Menu.Label>
        {Object.entries(localeLabels).map(([localeKey, localeLabel]) => (
          <Menu.Item
            key={localeKey}
            onClick={() => handleLocaleChange(localeKey as SupportedLocale)}
            leftSection={
              <span style={{ fontSize: "16px" }}>
                {localeFlags[localeKey as SupportedLocale]}
              </span>
            }
            style={{
              backgroundColor:
                currentLocale === localeKey
                  ? "var(--mantine-color-blue-0)"
                  : "transparent",
            }}
          >
            <Text size="sm">{localeLabel}</Text>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
