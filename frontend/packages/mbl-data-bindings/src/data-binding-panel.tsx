import React, { useState, useEffect } from "react";
import { Box, Paper, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Check } from "lucide-react";
import { useI18n } from "@xxs3315/mbl-providers";

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
import { getAvailableConfigTypes } from "./config-manager";
import { Header, ConfigItem, EmptyState, DeleteModal } from "./components";
import { useDataBindingStorage } from "./use-data-binding-storage";
import { formatJson } from "./json-utils";

const DataBindingPanel: React.FC = () => {
  const { t } = useI18n();

  // 状态管理
  const [configs, setConfigs] = useState<DataBindingConfig[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<string | null>(null);
  const [editorTheme, setEditorTheme] = useState<EditorTheme>("github");

  // 使用数据绑定存储 hook
  const { loadConfigs, saveConfigs, getEditorTheme, saveEditorTheme } =
    useDataBindingStorage();

  // 从localStorage加载配置
  useEffect(() => {
    setConfigs(loadConfigs());
    setEditorTheme(getEditorTheme());
  }, [loadConfigs, getEditorTheme]);

  // 添加配置
  const handleAddConfig = (configType: any) => {
    const newConfig = {
      id: `${configType.id}-${Date.now()}`,
      name: configType.name,
      description: configType.description,
      shape: configType.shape,
      request: configType.request,
      value: "",
      bindings: [],
    };
    const updatedConfigs = [...configs, newConfig];
    setConfigs(updatedConfigs);
    saveConfigs(updatedConfigs);
  };

  // 更新配置
  const handleUpdateConfig = (
    id: string,
    updates: Partial<DataBindingConfig>,
  ) => {
    const updatedConfigs = configs.map((config) =>
      config.id === id ? { ...config, ...updates } : config,
    );
    setConfigs(updatedConfigs);
    saveConfigs(updatedConfigs);
  };

  // 删除配置
  const handleDeleteConfig = (id: string) => {
    const updatedConfigs = configs.filter((config) => config.id !== id);
    setConfigs(updatedConfigs);
    saveConfigs(updatedConfigs);
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
    const config = configs.find((c) => c.id === id);
    if (!config || config.request !== "data") return;

    const formatted = formatJson(config.value);
    if (formatted !== config.value) {
      const updatedConfigs = configs.map((c) =>
        c.id === id ? { ...c, value: formatted } : c,
      );
      setConfigs(updatedConfigs);
      saveConfigs(updatedConfigs);
    }

    notifications.show({
      title: t("notifications.jsonFormatted", { ns: "dataBinding" }),
      message: t("notifications.jsonFormattedMessage", { ns: "dataBinding" }),
      color: "green",
      icon: <Check size={16} />,
    });
  };

  // 切换编辑器主题
  const handleChangeEditorTheme = (theme: EditorTheme) => {
    setEditorTheme(theme);
    saveEditorTheme(theme);
    notifications.show({
      title: t("notifications.themeChanged", { ns: "dataBinding" }),
      message: `${t("notifications.themeChangedMessage", { ns: "dataBinding" })} ${theme}`,
      color: "blue",
      icon: <Check size={16} />,
    });
  };

  return (
    <Box p="0" bd="none">
      <Paper
        p="0"
        bd="none"
        styles={{
          root: {
            backgroundColor: "transparent",
          },
        }}
      >
        {/* 固定标题部分 */}
        <Box style={{ flexShrink: 0 }}>
          <Header
            editorTheme={editorTheme}
            availableConfigTypes={getAvailableConfigTypes(t)}
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
                onUpdateConfig={handleUpdateConfig}
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
