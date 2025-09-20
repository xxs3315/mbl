import React from "react";
import {
  Paper,
  Stack,
  Group,
  Box,
  Text,
  Badge,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { Trash, Code, GripVertical } from "lucide-react";
import AceEditor from "react-ace";
import { DataBindingConfig, JsonField } from "../types";
import { parseJsonStructure } from "../field-parser";
import {
  getInputValidation,
  getEditorConfig,
  getEditorStyle,
  getEditorProps,
} from "../editor-utils";

interface ConfigItemProps {
  config: DataBindingConfig;
  editorTheme: string;
  onUpdateValue: (id: string, value: string) => void;
  onDelete: (id: string) => void;
  onFormat: (id: string) => void;
}

export const ConfigItem: React.FC<ConfigItemProps> = ({
  config,
  editorTheme,
  onUpdateValue,
  onDelete,
  onFormat,
}) => {
  const validationError = getInputValidation(config.value, config.request);
  const fields =
    config.request === "data" ? parseJsonStructure(config.value) : [];
  const editorConfig = getEditorConfig(config.request);

  return (
    <Paper p="xs" withBorder>
      <Stack gap="0">
        <Group justify="space-between" align="flex-start">
          <Box flex={1}>
            <Group gap="xs" mb={2}>
              <Text size="xs" fw={500}>
                {config.name}
              </Text>
              <Badge
                size="xs"
                color={config.shape === "list" ? "blue" : "green"}
                variant="light"
              >
                {config.shape === "list" ? "数组" : "对象"}
              </Badge>
              <Badge
                size="xs"
                color={config.request === "url" ? "orange" : "purple"}
                variant="light"
              >
                {config.request === "url" ? "远程" : "静态"}
              </Badge>
            </Group>
            <Text size="xs" c="dimmed" mb="xs">
              {config.description}
            </Text>
          </Box>
          <ActionIcon
            size="xs"
            variant="light"
            color="red"
            onClick={() => onDelete(config.id)}
          >
            <Trash size={12} />
          </ActionIcon>
        </Group>

        <Group justify="space-between" align="center" mb="xs">
          <Text size="xs" fw={500}>
            {config.request === "url" ? "URL地址" : "JSON数据"}
          </Text>
          {config.request === "data" && (
            <Group gap="xs">
              <Tooltip label="格式化JSON">
                <ActionIcon
                  size="xs"
                  variant="light"
                  color="blue"
                  onClick={() => onFormat(config.id)}
                >
                  <Code size={12} />
                </ActionIcon>
              </Tooltip>
            </Group>
          )}
        </Group>

        <Box
          mb="xs"
          style={{
            border: validationError ? "1px solid #fa5252" : "1px solid #e9ecef",
            borderRadius: "4px",
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          <AceEditor
            mode={config.request === "data" ? "json" : "text"}
            theme={editorTheme}
            value={config.value}
            onChange={(value) => onUpdateValue(config.id, value)}
            placeholder={
              config.request === "url"
                ? "请输入API地址，如：https://api.example.com/data"
                : "请输入JSON数据"
            }
            width="100%"
            height={config.request === "data" ? "100px" : "60px"}
            setOptions={editorConfig}
            editorProps={getEditorProps()}
            style={getEditorStyle()}
            onLoad={(editor) => {
              // 修复等宽字体导致的光标错位
              const fixFontRendering = () => {
                setTimeout(() => {
                  editor.resize();
                  editor.renderer.updateFull();
                }, 0);
              };

              // 初始修复
              fixFontRendering();

              // 监听字体加载完成
              if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => {
                  fixFontRendering();
                });
              }

              // 监听窗口大小变化
              const handleResize = () => fixFontRendering();
              window.addEventListener("resize", handleResize);

              // 清理监听器
              editor.on("destroy", () => {
                window.removeEventListener("resize", handleResize);
              });
            }}
          />
        </Box>

        {validationError && (
          <Text size="xs" c="red" mb="xs">
            {validationError}
          </Text>
        )}

        {/* 显示可供绑定的字段 */}
        {config.request === "data" && fields.length > 0 && (
          <Box>
            <Text size="xs" fw={500} mb="xs">
              可供绑定的字段:
            </Text>
            <Group gap="xs">
              {fields.map((field) => (
                <Tooltip
                  key={field.name}
                  label={`${field.name} (${field.type})`}
                  position="top"
                >
                  <Group
                    gap="xs"
                    style={{
                      padding: "2px 6px",
                      backgroundColor: `var(--mantine-color-${field.color}-light)`,
                      borderRadius: "4px",
                      border: `1px solid var(--mantine-color-${field.color}-3)`,
                      cursor: "pointer",
                      fontSize: "10px",
                      fontWeight: 500,
                    }}
                  >
                    <GripVertical
                      size={10}
                      color={`var(--mantine-color-${field.color}-6)`}
                    />
                    <Text size="xs" c={`${field.color}.6`} fw={500}>
                      {field.name}
                    </Text>
                  </Group>
                </Tooltip>
              ))}
            </Group>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};
