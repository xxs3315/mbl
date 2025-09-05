import React from "react";
import { ActionIcon, Menu, Text } from "@mantine/core";
import { IconPalette } from "@tabler/icons-react";
import { themeVariants, type ThemeVariant } from "../theme";

interface ThemeSwitcherProps {
  currentTheme: ThemeVariant;
  onThemeChange: (theme: ThemeVariant) => void;
}

const themeLabels: Record<ThemeVariant, string> = {
  blue: "蓝色",
  green: "绿色",
  purple: "紫色",
  orange: "橙色",
  red: "红色",
  teal: "青色",
};

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          size="lg"
          aria-label="切换主题"
          className="theme-switcher-button"
        >
          <IconPalette size={20} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>选择主题</Menu.Label>
        {Object.entries(themeVariants).map(([themeKey, themeConfig]) => (
          <Menu.Item
            key={themeKey}
            onClick={() => onThemeChange(themeKey as ThemeVariant)}
            leftSection={
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: `var(--mantine-color-${themeConfig.primaryColor}-6)`,
                  border:
                    currentTheme === themeKey
                      ? "2px solid var(--mantine-color-gray-3)"
                      : "none",
                }}
              />
            }
            style={{
              backgroundColor:
                currentTheme === themeKey
                  ? "var(--mantine-color-blue-0)"
                  : "transparent",
            }}
          >
            <Text size="sm">{themeLabels[themeKey as ThemeVariant]}</Text>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
