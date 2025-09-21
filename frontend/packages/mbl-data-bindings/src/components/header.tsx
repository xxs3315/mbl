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
  return (
    <Flex justify="space-between" align="center" mb="xs">
      <Title order={4} size="sm">
        数据绑定配置
      </Title>
      <Group gap="xs">
        <Menu shadow="md" width={160} withinPortal={false}>
          <Menu.Target>
            <ActionIcon size="sm" variant="subtle" title="编辑器主题">
              <Palette size={12} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>编辑器主题</Menu.Label>
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
                  明亮主题
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
                  暗色主题
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
                  经典主题
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
                  简洁主题
                </Text>
              </Stack>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Menu shadow="md" width={200} withinPortal={false}>
          <Menu.Target>
            <ActionIcon size="sm" variant="subtle" title="新增配置">
              <Plus size={12} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>新增配置</Menu.Label>
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
