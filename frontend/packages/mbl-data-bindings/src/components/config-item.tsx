import React, { useState, useRef, useEffect } from "react";
import {
  Paper,
  Stack,
  Group,
  Box,
  Text,
  Badge,
  ActionIcon,
  Tooltip,
  Modal,
  Button,
} from "@mantine/core";
import { Trash, Code, GripVertical, Edit3, Send } from "lucide-react";
import AceEditor from "react-ace";
import { DataBindingConfig } from "../types";
import { parseJsonStructure } from "../field-parser";
import {
  getInputValidation,
  getEditorConfig,
  getEditorStyle,
  getEditorProps,
} from "../editor-utils";
import { formatJson } from "../json-utils";
import { notifications } from "@mantine/notifications";
import { Box as DndBox } from "@xxs3315/mbl-dnd";
import { ItemTypes } from "@xxs3315/mbl-dnd";
import { useI18n } from "@xxs3315/mbl-providers";

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
  const { t } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalValue, setModalValue] = useState(config.value);
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [fetchedFields, setFetchedFields] = useState<
    ReturnType<typeof parseJsonStructure>
  >([]);
  const [isFetching, setIsFetching] = useState(false);
  const [modalFetchedFields, setModalFetchedFields] = useState<
    ReturnType<typeof parseJsonStructure>
  >([]);
  const [isFetchingModal, setIsFetchingModal] = useState(false);

  const validationError = getInputValidation(config.value, config.request);
  const staticFields =
    config.request === "data" ? parseJsonStructure(config.value) : [];
  const displayFields =
    config.request === "data" ? staticFields : fetchedFields;
  const editorConfig = getEditorConfig(config.request);

  const handleFetchUrl = async (
    url: string,
    setFields: (fields: ReturnType<typeof parseJsonStructure>) => void,
    setIsFetchingState: (isFetching: boolean) => void,
  ) => {
    if (!url) {
      notifications.show({
        title: "Error",
        message: "URL cannot be empty.",
        color: "red",
      });
      return;
    }
    setIsFetchingState(true);
    setFields([]);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      const data = await response.json();
      const fields = parseJsonStructure(JSON.stringify(data));
      setFields(fields);
      notifications.show({
        title: "Success",
        message: "Data fetched and fields extracted successfully.",
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message:
          error.message ||
          "Failed to fetch or parse data. Please check the URL and data format.",
        color: "red",
      });
    } finally {
      setIsFetchingState(false);
    }
  };

  const handleOpenModal = () => {
    setModalValue(config.value);
    setModalFetchedFields([]);
    setModalOpen(true);
  };

  const handleSaveModal = () => {
    onUpdateValue(config.id, modalValue);
    setModalOpen(false);
    setModalFetchedFields([]);
  };

  const handleCancelModal = () => {
    setModalValue(config.value);
    setModalOpen(false);
    setModalFetchedFields([]);
  };

  // Modal中的格式化JSON功能
  const handleFormatModalJson = () => {
    if (config.request !== "data") return;

    try {
      const formatted = formatJson(modalValue);
      if (formatted === modalValue) {
        notifications.show({
          title: t("notifications.tip", { ns: "dataBinding" }),
          message: t("notifications.jsonAlreadyFormatted", {
            ns: "dataBinding",
          }),
          color: "blue",
        });
      } else {
        setModalValue(formatted);
        notifications.show({
          title: t("notifications.success", { ns: "dataBinding" }),
          message: t("notifications.jsonFormatComplete", { ns: "dataBinding" }),
          color: "green",
        });
      }
    } catch (error) {
      notifications.show({
        title: t("notifications.error", { ns: "dataBinding" }),
        message: t("notifications.jsonFormatError", { ns: "dataBinding" }),
        color: "red",
      });
    }
  };

  // 监听容器尺寸变化，对Ace Editor进行resize
  useEffect(() => {
    if (!modalOpen || !containerRef.current || !editorRef.current) {
      return;
    }

    const resizeEditor = () => {
      if (editorRef.current) {
        editorRef.current.resize();
      }
    };

    const observer = new ResizeObserver(() => {
      // 延迟执行resize，确保DOM更新完成
      setTimeout(resizeEditor, 50);
    });

    observer.observe(containerRef.current);

    // 初始resize
    setTimeout(resizeEditor, 100);

    return () => {
      observer.disconnect();
    };
  }, [modalOpen]);

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
                {config.shape === "list"
                  ? t("configItem.array", { ns: "dataBinding" })
                  : t("configItem.object", { ns: "dataBinding" })}
              </Badge>
              <Badge
                size="xs"
                color={config.request === "url" ? "orange" : "purple"}
                variant="light"
              >
                {config.request === "url"
                  ? t("configItem.remote", { ns: "dataBinding" })
                  : t("configItem.static", { ns: "dataBinding" })}
              </Badge>
            </Group>
            <Text size="xs" c="dimmed" mb="xs">
              {config.description}
            </Text>
          </Box>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            onClick={() => onDelete(config.id)}
          >
            <Trash size={12} />
          </ActionIcon>
        </Group>

        <Group justify="space-between" align="center" mb="0">
          <Text size="xs" fw={500}>
            {config.request === "url"
              ? t("configItem.urlAddress", { ns: "dataBinding" })
              : t("configItem.jsonData", { ns: "dataBinding" })}
          </Text>
          <Group gap="xs">
            <Tooltip
              label={t("configItem.largeWindowEdit", { ns: "dataBinding" })}
            >
              <ActionIcon
                size="sm"
                variant="subtle"
                color="blue"
                onClick={handleOpenModal}
              >
                <Edit3 size={12} />
              </ActionIcon>
            </Tooltip>
            {config.request === "data" && (
              <Tooltip
                label={t("configItem.formatJson", { ns: "dataBinding" })}
              >
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="green"
                  onClick={() => onFormat(config.id)}
                >
                  <Code size={12} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Group>

        <Box style={{ position: "relative" }}>
          <Box
            mb="0"
            style={{
              border: validationError
                ? "1px solid #fa5252"
                : "1px solid #e9ecef",
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
                  ? t("configItem.urlPlaceholder", { ns: "dataBinding" })
                  : t("configItem.jsonPlaceholder", { ns: "dataBinding" })
              }
              width="100%"
              height={config.request === "data" ? "100px" : "60px"}
              setOptions={editorConfig}
              editorProps={getEditorProps()}
              style={getEditorStyle()}
            />
          </Box>
          {config.request === "url" && (
            <Tooltip
              label={t("configItem.fetchData", {
                ns: "dataBinding",
                defaultValue: "Fetch Data",
              })}
            >
              <ActionIcon
                variant="light"
                color="cyan"
                onClick={() =>
                  handleFetchUrl(config.value, setFetchedFields, setIsFetching)
                }
                loading={isFetching}
                style={{ position: "absolute", top: 5, right: 5, zIndex: 1 }}
              >
                <Send size={12} />
              </ActionIcon>
            </Tooltip>
          )}
        </Box>

        {validationError && (
          <Text size="xs" c="red" mb="xs">
            {validationError}
          </Text>
        )}

        {/* 显示可供绑定的字段 */}
        {displayFields.length > 0 && (
          <Box>
            <Text size="xs" fw={500} mb="0" mt="xs">
              {t("configItem.availableFields", { ns: "dataBinding" })}
            </Text>
            <Group gap="xs" mt={4}>
              {displayFields.map((field) => (
                <Tooltip
                  key={field.name}
                  label={`${field.name} (${field.type})`}
                  position="top"
                >
                  <DndBox
                    id={config.id}
                    name={field.name}
                    type={
                      config.shape === "list"
                        ? ItemTypes.BINDING_LIST_ITEM
                        : ItemTypes.BINDING_OBJECT_ITEM
                    }
                    cat="data-binding-item"
                    isDropped={false}
                    bind={field.name}
                    shape={config.shape}
                    request={config.request}
                    value={config.value}
                    attrs={null}
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
                  </DndBox>
                </Tooltip>
              ))}
            </Group>
          </Box>
        )}
      </Stack>

      {/* 大窗口编辑Modal */}
      <Modal
        opened={modalOpen}
        onClose={handleCancelModal}
        title={`${t("configItem.edit", { ns: "dataBinding" })} ${config.name}`}
        size="xl"
        centered
        styles={{
          content: {
            height: "80vh",
          },
          body: {
            height: "calc(80vh - 60px)",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Stack gap="md" style={{ height: "100%" }}>
          <Text size="sm" c="dimmed">
            {config.description}
          </Text>

          {/* Modal中的错误提示 */}
          {config.request === "data" &&
            getInputValidation(modalValue, config.request) && (
              <Text size="xs" c="red">
                {getInputValidation(modalValue, config.request)}
              </Text>
            )}

          {/* 编辑器容器 - 使用视窗高度百分比 */}
          <div
            ref={containerRef}
            style={{
              position: "relative",
              flex: 1,
              minHeight: "0",
              border: "1px solid #ccc",
            }}
            id="modal-container-editor"
          >
            {config.request === "url" && (
              <Tooltip
                label={t("configItem.fetchData", {
                  ns: "dataBinding",
                  defaultValue: "Fetch Data",
                })}
              >
                <ActionIcon
                  variant="light"
                  color="cyan"
                  onClick={() =>
                    handleFetchUrl(
                      modalValue,
                      setModalFetchedFields,
                      setIsFetchingModal,
                    )
                  }
                  loading={isFetchingModal}
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 40,
                    zIndex: 10,
                  }}
                >
                  <Send size={16} />
                </ActionIcon>
              </Tooltip>
            )}
            <AceEditor
              mode={config.request === "data" ? "json" : "text"}
              theme={editorTheme}
              value={modalValue}
              onChange={setModalValue}
              placeholder={
                config.request === "url"
                  ? t("configItem.urlPlaceholder", { ns: "dataBinding" })
                  : t("configItem.jsonPlaceholder", { ns: "dataBinding" })
              }
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
                useWorker: false,
              }}
              style={{ width: "100%", height: "100%" }}
              onLoad={(editor) => {
                // 保存editor引用
                editorRef.current = editor;
                // 初始resize
                setTimeout(() => {
                  editor.resize();
                }, 100);
              }}
            />
          </div>

          {/* Modal中的可用字段预览 */}
          {modalFetchedFields.length > 0 && (
            <Box mt="sm" style={{ flexShrink: 0 }}>
              <Text size="xs" fw={500}>
                {t("configItem.availableFields", { ns: "dataBinding" })}
              </Text>
              <Group gap="xs" mt={4}>
                {modalFetchedFields.map((field) => (
                  <Badge key={field.name} color={field.color} variant="light">
                    {field.name}
                  </Badge>
                ))}
              </Group>
            </Box>
          )}

          {/* 按钮组 */}
          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={handleCancelModal} size="sm">
              {t("configItem.cancel", { ns: "dataBinding" })}
            </Button>
            {config.request === "data" && (
              <Button
                variant="subtle"
                color="green"
                onClick={handleFormatModalJson}
                size="sm"
                leftSection={<Code size={14} />}
              >
                {t("configItem.formatJson", { ns: "dataBinding" })}
              </Button>
            )}
            <Button onClick={handleSaveModal} size="sm">
              {t("configItem.confirm", { ns: "dataBinding" })}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Paper>
  );
};
