import React, { useState, useEffect } from "react";
import { Box, Paper, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Check } from "lucide-react";

// 导入Ace Editor相关
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/ext-language_tools";

// 导入类型和工具
import { DataBindingConfig, EditorTheme } from "./types";
import {
  availableConfigTypes,
  loadConfigs,
  addConfig,
  updateConfigValue,
  deleteConfig,
  formatConfigJson,
} from "./config-manager";
import { getEditorTheme, saveEditorTheme } from "./editor-utils";
import { Header, ConfigItem, EmptyState, DeleteModal } from "./components";

const DataBindingPanel: React.FC = () => {
  // 状态管理
  const [configs, setConfigs] = useState<DataBindingConfig[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<string | null>(null);
  const [editorTheme, setEditorTheme] = useState<EditorTheme>("github");

  // 从localStorage加载配置
  useEffect(() => {
    setConfigs(loadConfigs());
    setEditorTheme(getEditorTheme());
  }, []);

  // 添加配置
  const handleAddConfig = (configType: any) => {
    setConfigs(addConfig(configs, configType));
  };

  // 更新配置值
  const handleUpdateConfigValue = (id: string, value: string) => {
    setConfigs(updateConfigValue(configs, id, value));
  };

  // 删除配置
  const handleDeleteConfig = (id: string) => {
    setConfigs(deleteConfig(configs, id));
    setDeleteModalOpen(false);
    setConfigToDelete(null);
  };

  // 打开删除确认对话框
  const handleOpenDeleteModal = (id: string) => {
    setConfigToDelete(id);
    setDeleteModalOpen(true);
  };

  // 格式化JSON
  const handleFormatConfigJson = (id: string) => {
    const updatedConfigs = formatConfigJson(configs, id);
    setConfigs(updatedConfigs);

    const config = configs.find((c) => c.id === id);
    if (config) {
      const formatted = config.value;
      notifications.show({
        title: "JSON已格式化",
        message: "JSON数据已成功格式化",
        color: "green",
        icon: <Check size={16} />,
      });
    }
  };

  // 切换编辑器主题
  const handleChangeEditorTheme = (theme: EditorTheme) => {
    setEditorTheme(theme);
    saveEditorTheme(theme);
    notifications.show({
      title: "主题已切换",
      message: `编辑器主题已切换为 ${theme}`,
      color: "blue",
      icon: <Check size={16} />,
    });
  };

  return (
    <Box p="0" bd="none">
      <Paper p="0" bd="none">
        {/* 固定标题部分 */}
        <Box style={{ flexShrink: 0 }}>
          <Header
            editorTheme={editorTheme}
            availableConfigTypes={availableConfigTypes}
            onThemeChange={handleChangeEditorTheme}
            onAddConfig={handleAddConfig}
          />
        </Box>

        {/* 内容部分 */}
        {configs.length === 0 ? (
          <EmptyState />
        ) : (
          <Stack gap="xs">
            {configs.map((config) => (
              <ConfigItem
                key={config.id}
                config={config}
                editorTheme={editorTheme}
                onUpdateValue={handleUpdateConfigValue}
                onDelete={handleOpenDeleteModal}
                onFormat={handleFormatConfigJson}
              />
            ))}
          </Stack>
        )}

        {/* 删除确认对话框 */}
        <DeleteModal
          opened={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => configToDelete && handleDeleteConfig(configToDelete)}
        />
      </Paper>
    </Box>
  );
};

export default DataBindingPanel;
