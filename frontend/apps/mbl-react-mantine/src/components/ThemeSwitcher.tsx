import React from "react";
import { ActionIcon, Menu } from "@mantine/core";
import { IconPalette } from "@tabler/icons-react";
import { themeVariants, type ThemeVariant } from "../theme";

interface ThemeSwitcherProps {
  currentTheme: ThemeVariant;
  onThemeChange: (theme: ThemeVariant) => void;
}

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
        <Menu.Label>Select color</Menu.Label>
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
                }}
              />
            }
            style={{
              backgroundColor:
                currentTheme === themeKey
                  ? "var(--mantine-color-blue-1)"
                  : "transparent",
            }}
          >
            <div
              style={{
                width: "100%",
                height: 8,
                borderRadius: 4,
                backgroundColor: `var(--mantine-color-${themeConfig.primaryColor}-6)`,
              }}
            />
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
