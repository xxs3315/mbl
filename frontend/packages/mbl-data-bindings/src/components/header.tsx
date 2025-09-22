import React from "react";
import {
  Flex,
  Title,
  Group,
  ActionIcon,
  Button,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { Plus, ChevronDown, Palette } from "lucide-react";
import { EditorTheme, NewConfigType } from "../types";
import { useI18n } from "@xxs3315/mbl-providers";

interface HeaderProps {
  editorTheme: EditorTheme;
  availableConfigTypes: NewConfigType[];
  onThemeChange: (theme: EditorTheme) => void;
  onAddConfig: (configType: NewConfigType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  editorTheme,
  availableConfigTypes,
  onThemeChange,
  onAddConfig,
}) => {
  const { t } = useI18n();
  return (
    <Flex justify="space-between" align="center" mb="xs">
      <Title order={4} size="sm">
        {t("title", { ns: "dataBinding" })}
      </Title>
      <Group gap="xs">
        <Menu shadow="md" width={160} withinPortal={false}>
          <Menu.Target>
            <ActionIcon
              size="sm"
              variant="subtle"
              title={t("header.editorTheme", { ns: "dataBinding" })}
            >
              <Palette size={12} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>
              {t("header.editorTheme", { ns: "dataBinding" })}
            </Menu.Label>
            <Menu.Item
              onClick={() => onThemeChange("github")}
              style={{
                backgroundColor:
                  editorTheme === "github"
                    ? "var(--mantine-color-blue-light)"
                    : "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  editorTheme === "github"
                    ? "var(--mantine-color-blue-2)"
                    : "var(--mantine-color-gray-1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  editorTheme === "github"
                    ? "var(--mantine-color-blue-light)"
                    : "transparent";
              }}
            >
              <Stack gap={2}>
                <Text size="xs" fw={500}>
                  GitHub
                </Text>
                <Text size="xs" c="dimmed">
                  {t("header.lightTheme", { ns: "dataBinding" })}
                </Text>
              </Stack>
            </Menu.Item>
            <Menu.Item
              onClick={() => onThemeChange("monokai")}
              style={{
                backgroundColor:
                  editorTheme === "monokai"
                    ? "var(--mantine-color-blue-light)"
                    : "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  editorTheme === "monokai"
                    ? "var(--mantine-color-blue-2)"
                    : "var(--mantine-color-gray-1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  editorTheme === "monokai"
                    ? "var(--mantine-color-blue-light)"
                    : "transparent";
              }}
            >
              <Stack gap={2}>
                <Text size="xs" fw={500}>
                  Monokai
                </Text>
                <Text size="xs" c="dimmed">
                  {t("header.darkTheme", { ns: "dataBinding" })}
                </Text>
              </Stack>
            </Menu.Item>
            <Menu.Item
              onClick={() => onThemeChange("tomorrow")}
              style={{
                backgroundColor:
                  editorTheme === "tomorrow"
                    ? "var(--mantine-color-blue-light)"
                    : "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  editorTheme === "tomorrow"
                    ? "var(--mantine-color-blue-2)"
                    : "var(--mantine-color-gray-1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  editorTheme === "tomorrow"
                    ? "var(--mantine-color-blue-light)"
                    : "transparent";
              }}
            >
              <Stack gap={2}>
                <Text size="xs" fw={500}>
                  Tomorrow
                </Text>
                <Text size="xs" c="dimmed">
                  {t("header.classicTheme", { ns: "dataBinding" })}
                </Text>
              </Stack>
            </Menu.Item>
            <Menu.Item
              onClick={() => onThemeChange("kuroir")}
              style={{
                backgroundColor:
                  editorTheme === "kuroir"
                    ? "var(--mantine-color-blue-light)"
                    : "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  editorTheme === "kuroir"
                    ? "var(--mantine-color-blue-2)"
                    : "var(--mantine-color-gray-1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  editorTheme === "kuroir"
                    ? "var(--mantine-color-blue-light)"
                    : "transparent";
              }}
            >
              <Stack gap={2}>
                <Text size="xs" fw={500}>
                  Kuroir
                </Text>
                <Text size="xs" c="dimmed">
                  {t("header.simpleTheme", { ns: "dataBinding" })}
                </Text>
              </Stack>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Menu shadow="md" width={200} withinPortal={false}>
          <Menu.Target>
            <ActionIcon
              size="sm"
              variant="subtle"
              title={t("header.addConfig", { ns: "dataBinding" })}
            >
              <Plus size={12} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>
              {t("header.addConfig", { ns: "dataBinding" })}
            </Menu.Label>
            {availableConfigTypes.map((configType) => (
              <Menu.Item
                key={configType.id}
                onClick={() => onAddConfig(configType)}
              >
                <Stack gap={2}>
                  <Text size="xs" fw={500}>
                    {configType.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {configType.description}
                  </Text>
                </Stack>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Flex>
  );
};
