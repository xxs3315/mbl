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
        <Menu shadow="md" width={120} withinPortal={false}>
          <Menu.Target>
            <ActionIcon size="xs" variant="light" color="gray">
              <Palette size={12} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>编辑器主题</Menu.Label>
            <Menu.Item
              onClick={() => onThemeChange("github")}
              style={{
                backgroundColor:
                  editorTheme === "github" ? "#e3f2fd" : "transparent",
              }}
            >
              GitHub
            </Menu.Item>
            <Menu.Item
              onClick={() => onThemeChange("monokai")}
              style={{
                backgroundColor:
                  editorTheme === "monokai" ? "#e3f2fd" : "transparent",
              }}
            >
              Monokai
            </Menu.Item>
            <Menu.Item
              onClick={() => onThemeChange("tomorrow")}
              style={{
                backgroundColor:
                  editorTheme === "tomorrow" ? "#e3f2fd" : "transparent",
              }}
            >
              Tomorrow
            </Menu.Item>
            <Menu.Item
              onClick={() => onThemeChange("kuroir")}
              style={{
                backgroundColor:
                  editorTheme === "kuroir" ? "#e3f2fd" : "transparent",
              }}
            >
              Kuroir
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Menu shadow="md" width={180} withinPortal={false}>
          <Menu.Target>
            <Button
              size="xs"
              leftSection={<Plus size={12} />}
              rightSection={<ChevronDown size={12} />}
              variant="filled"
            >
              新增配置
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
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
