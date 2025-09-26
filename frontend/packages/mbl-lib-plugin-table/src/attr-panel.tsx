import React, { useRef, useEffect } from "react";
import {
  Textarea,
  NumberInput,
  Stack,
  Text,
  Title,
  Grid,
  Checkbox,
  Select,
  Divider,
  Group,
  Paper,
  Badge,
  Box,
  Modal,
  Tooltip,
  ActionIcon,
  Button,
} from "@mantine/core";
import { useCurrentSelectedId, useI18n } from "@xxs3315/mbl-providers";
import AceEditor from "react-ace";
import {
  getEditorConfig,
  getEditorStyle,
  getEditorProps,
} from "./editor-utils";
import { ViewIcon } from "./icons";
import { AttrColumn } from "./attr-column";

interface AttrPanelProps {
  props: {
    id: string;
    attrs: {
      pluginId: string;
      value: string;
      background: string;
      horizontal: "left" | "center" | "right";
      vertical: "top" | "middle" | "bottom";
      wildStar: boolean;
      canShrink: boolean;
      canGrow: boolean;
      flexValue: number;
      flexUnit: "px" | "%" | "pt";
      pTop: number;
      pRight: number;
      pBottom: number;
      pLeft: number;
      bindings: Record<string, any>;
      columns: any[];
      bindingColumns: any[];
    };
  };
  onPropsChange?: (newProps: any) => void;
}

export const AttrPanel: React.FC<AttrPanelProps> = ({
  props,
  onPropsChange,
}) => {
  const { t } = useI18n();

  const { currentSubSelectedId } = useCurrentSelectedId();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [viewingBinding, setViewingBinding] = React.useState<any>(null);

  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 添加 useEffect 来监听容器尺寸变化
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
      setTimeout(resizeEditor, 50);
    });

    observer.observe(containerRef.current);
    setTimeout(resizeEditor, 100);

    return () => {
      observer.disconnect();
    };
  }, [modalOpen]);

  // 添加调试信息：监听 currentSubSelectedId 变化
  React.useEffect(() => {
    console.log(
      `[Attr Panel] currentSubSelectedId 变化: ${currentSubSelectedId}`,
    );
    console.log(`[Attr Panel] 表格ID: ${props.id}`);
    console.log(`[Attr Panel] 列数量: ${props.attrs.columns?.length || 0}`);
    console.log(
      `[Attr Panel] 绑定列数量: ${props.attrs.bindingColumns?.length || 0}`,
    );

    // 检查当前选中的列是否属于这个表格
    if (currentSubSelectedId) {
      const isBindingColumn = currentSubSelectedId.endsWith("-column-binding");
      const columnsMap = new Map(props.attrs.columns || []);
      const bindingColumnsMap = new Map(props.attrs.bindingColumns || []);

      let belongsToThisTable = false;
      if (isBindingColumn) {
        belongsToThisTable = bindingColumnsMap.has(currentSubSelectedId);
      } else {
        belongsToThisTable = columnsMap.has(currentSubSelectedId);
      }

      console.log(
        `[Attr Panel] 列 ${currentSubSelectedId} 是否属于表格 ${props.id}: ${belongsToThisTable}`,
      );
    }
  }, [
    currentSubSelectedId,
    props.id,
    props.attrs.columns?.length,
    props.attrs.bindingColumns?.length,
  ]);

  const handleOpenModal = (binding: any) => {
    setViewingBinding(binding);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setViewingBinding(null);
  };

  const handlePaddingChange = (
    field: "pTop" | "pRight" | "pBottom" | "pLeft",
    value: number,
  ) => {
    if (onPropsChange) {
      const newProps = {
        ...props,
        attrs: {
          ...props.attrs,
          [field]: value,
        },
      };
      onPropsChange(newProps);
    }
  };

  const handleColumnChange = (columnId: string, field: string, value: any) => {
    if (onPropsChange) {
      const newColumns = props.attrs.columns.map(
        ([id, columnData]: [string, any]) => {
          if (id === columnId) {
            return [id, { ...columnData, [field]: value }];
          }
          return [id, columnData];
        },
      );

      const newProps = {
        ...props,
        attrs: {
          ...props.attrs,
          columns: newColumns,
        },
      };
      onPropsChange(newProps);
    }
  };

  const handleBindingColumnChange = (
    columnId: string,
    field: string,
    value: any,
  ) => {
    if (onPropsChange) {
      const newBindingColumns = props.attrs.bindingColumns.map(
        ([id, columnData]: [string, any]) => {
          if (id === columnId) {
            return [id, { ...columnData, [field]: value }];
          }
          return [id, columnData];
        },
      );

      console.log(newBindingColumns);

      const newProps = {
        ...props,
        attrs: {
          ...props.attrs,
          bindingColumns: newBindingColumns,
        },
      };
      onPropsChange(newProps);
    }
  };

  const columnsMap = React.useMemo(
    () => new Map(props.attrs.columns),
    [props.attrs.columns],
  );

  const bindingColumnsMap = React.useMemo(
    () => new Map(props.attrs.bindingColumns || []),
    [props.attrs.bindingColumns],
  );

  const selectedColumnData = React.useMemo(() => {
    const timestamp = Date.now();
    console.log(`[Attr Panel] selectedColumnData 计算开始 (${timestamp}):`);
    console.log(`[Attr Panel] currentSubSelectedId: ${currentSubSelectedId}`);
    console.log(`[Attr Panel] 当前表格ID: ${props.id}`);
    console.log(`[Attr Panel] columnsMap 大小: ${columnsMap.size}`);
    console.log(
      `[Attr Panel] bindingColumnsMap 大小: ${bindingColumnsMap.size}`,
    );

    if (!currentSubSelectedId) {
      console.log(
        `[Attr Panel] currentSubSelectedId 为空，返回 null (${timestamp})`,
      );
      return null;
    }

    // 检查选中的列是否属于当前表格
    const isBindingColumn = currentSubSelectedId.endsWith("-column-binding");
    const columnType = isBindingColumn ? "绑定列" : "普通列";
    console.log(`[Attr Panel] 列类型: ${columnType} (${timestamp})`);

    let columnData = null;
    if (isBindingColumn) {
      columnData = bindingColumnsMap.get(currentSubSelectedId);
      console.log(
        `[Attr Panel] 从 bindingColumnsMap 获取数据 (${timestamp}):`,
        columnData,
      );
    } else {
      columnData = columnsMap.get(currentSubSelectedId);
      console.log(
        `[Attr Panel] 从 columnsMap 获取数据 (${timestamp}):`,
        columnData,
      );
    }

    // 验证列是否属于当前表格
    if (!columnData) {
      console.log(
        `[Attr Panel] 列 ${currentSubSelectedId} 不属于当前表格 ${props.id}，返回 null (${timestamp})`,
      );
      return null;
    }

    console.log(`[Attr Panel] 成功获取列数据 (${timestamp}):`, columnData);
    return columnData;
  }, [currentSubSelectedId, columnsMap, bindingColumnsMap, props.id]);

  const tableRoot = React.useMemo(
    () => columnsMap.get("table-root") as any,
    [columnsMap],
  );

  const tableContainer = React.useMemo(
    () =>
      tableRoot?.children?.[0]
        ? (columnsMap.get(tableRoot.children[0]) as any)
        : null,
    [tableRoot, columnsMap],
  );

  const tableColumns = React.useMemo(
    () =>
      tableContainer?.children?.map((id: string) => {
        const columnData = columnsMap.get(id) as any;
        return { id, ...columnData };
      }) || [],
    [tableContainer, columnsMap],
  );

  return (
    <Stack gap={0} style={{ padding: 0 }}>
      <Title order={4} style={{ marginBottom: 0 }}>
        {t("table.title", { ns: "attributePanel" })}
      </Title>

      <Divider my="xs" />

      <Grid gutter="xs">
        <Grid.Col span={6}>
          <NumberInput
            label={t("table.topPadding", { ns: "attributePanel" })}
            placeholder="0"
            value={props.attrs.pTop}
            onChange={(value) =>
              handlePaddingChange("pTop", Number(value) || 0)
            }
            size="xs"
            min={0}
            max={100}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label={t("table.rightPadding", { ns: "attributePanel" })}
            placeholder="0"
            value={props.attrs.pRight}
            onChange={(value) =>
              handlePaddingChange("pRight", Number(value) || 0)
            }
            size="xs"
            min={0}
            max={100}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label={t("table.bottomPadding", { ns: "attributePanel" })}
            placeholder="0"
            value={props.attrs.pBottom}
            onChange={(value) =>
              handlePaddingChange("pBottom", Number(value) || 0)
            }
            size="xs"
            min={0}
            max={100}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label={t("table.leftPadding", { ns: "attributePanel" })}
            placeholder="0"
            value={props.attrs.pLeft}
            onChange={(value) =>
              handlePaddingChange("pLeft", Number(value) || 0)
            }
            size="xs"
            min={0}
            max={100}
          />
        </Grid.Col>
      </Grid>

      <Divider my="xs" />

      <Title order={4} style={{ marginBottom: 0 }}>
        {t("table.columnDistribution", { ns: "attributePanel" })}
      </Title>

      <Divider my="xs" />

      {tableColumns.map((column: any, index: number) => (
        <React.Fragment key={column.id}>
          <Grid gutter="xs">
            <Grid.Col span={12}>
              <Grid
                gutter="xs"
                styles={{
                  root: { marginTop: "8px" },
                }}
              >
                <Grid.Col span={8}>
                  <Text size="sm" fw={500} mb={2} mt={2}>
                    {column.value && column.value.trim() !== ""
                      ? `${t("table.columnLabel", { ns: "attributePanel" })}: ${
                          column.value
                        }`
                      : `${t("table.columnLabel", { ns: "attributePanel" })}: ${
                          index + 1
                        }`}
                  </Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Checkbox
                    checked={column.wildStar || false}
                    onChange={(event) => {
                      handleColumnChange(
                        column.id,
                        "wildStar",
                        event.currentTarget.checked,
                      );
                    }}
                    label="*"
                    variant="outline"
                    radius="xs"
                    size="xs"
                    styles={{
                      root: { marginTop: "4px" },
                      label: {
                        paddingInlineStart: "4px",
                      },
                    }}
                  />
                </Grid.Col>
              </Grid>
            </Grid.Col>
            <Grid.Col span={8}>
              <NumberInput
                disabled={column.wildStar}
                label={t("table.size", { ns: "attributePanel" })}
                size="xs"
                value={column.flexValue || 100}
                onChange={(value) => {
                  handleColumnChange(column.id, "flexValue", Number(value));
                }}
                min={6}
                max={288}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                disabled={column.wildStar}
                allowDeselect={false}
                size="xs"
                label={t("table.unit", { ns: "attributePanel" })}
                placeholder={t("table.selectValue", { ns: "attributePanel" })}
                data={[
                  { value: "%", label: "%" },
                  { value: "px", label: "pt" },
                ]}
                value={column.flexUnit || "%"}
                onChange={(value) => {
                  handleColumnChange(column.id, "flexUnit", value);
                }}
              />
            </Grid.Col>
          </Grid>
          <Divider my="xs" />
        </React.Fragment>
      ))}

      <Divider my="xs" />

      <Title order={4} style={{ marginBottom: 0 }}>
        {t("table.bindingInfo", { ns: "attributePanel" })}
      </Title>

      <Divider my="xs" />

      <Stack gap="0" mt={2} mb={2}>
        {(() => {
          const bindings = props.attrs.bindings || {};
          const tableRootBinding = bindings["table-root"];

          if (!tableRootBinding) {
            return (
              <Paper p="xs">
                <Text size="xs" c="dimmed">
                  {t("table.noBindingDataSource", { ns: "attributePanel" })}
                </Text>
              </Paper>
            );
          }

          const editorConfig = getEditorConfig(tableRootBinding.request);
          return (
            <Paper key={tableRootBinding.id} p="xs" withBorder>
              <Stack gap="0">
                <Group gap="xs">
                  <Text size="xs" fw={500}>
                    {tableRootBinding.name || tableRootBinding.id}
                  </Text>
                  <Badge
                    size="xs"
                    color={tableRootBinding.shape === "list" ? "blue" : "green"}
                    variant="light"
                  >
                    {tableRootBinding.shape}
                  </Badge>
                  <Badge
                    size="xs"
                    color={
                      tableRootBinding.request === "url" ? "orange" : "purple"
                    }
                    variant="light"
                  >
                    {tableRootBinding.request}
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed">
                  {tableRootBinding.description}
                </Text>
                <Group justify="space-between" align="center" mt="xs">
                  <Text size="xs" fw={500}>
                    {tableRootBinding.request === "url"
                      ? t("table.urlAddress", { ns: "attributePanel" })
                      : t("table.jsonData", { ns: "attributePanel" })}
                  </Text>
                  <Tooltip
                    label={t("table.viewInLargeWindow", {
                      ns: "attributePanel",
                    })}
                  >
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="blue"
                      onClick={() => handleOpenModal(tableRootBinding)}
                    >
                      <ViewIcon />
                    </ActionIcon>
                  </Tooltip>
                </Group>
                <Box
                  style={{
                    border: "1px solid #e9ecef",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <AceEditor
                    mode={tableRootBinding.request === "data" ? "json" : "text"}
                    theme={"github"}
                    value={tableRootBinding.value}
                    readOnly={true}
                    width="100%"
                    height={
                      tableRootBinding.request === "data" ? "100px" : "60px"
                    }
                    setOptions={{ ...editorConfig, readOnly: true }}
                    editorProps={getEditorProps()}
                    style={getEditorStyle()}
                  />
                </Box>
              </Stack>
            </Paper>
          );
        })()}
      </Stack>

      {selectedColumnData && (
        <>
          <Divider my="xs" />
          <AttrColumn
            selectedColumn={selectedColumnData}
            onColumnChange={
              currentSubSelectedId.endsWith("-column-binding")
                ? handleBindingColumnChange
                : handleColumnChange
            }
          />
        </>
      )}

      <Modal
        opened={modalOpen}
        onClose={handleCloseModal}
        title={
          viewingBinding?.name ||
          t("table.viewContent", { ns: "attributePanel" })
        }
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
          <div
            style={{ flex: 1, minHeight: 0, border: "1px solid #ccc" }}
            ref={containerRef}
          >
            <AceEditor
              mode={viewingBinding?.request === "data" ? "json" : "text"}
              theme="github"
              value={viewingBinding?.value || ""}
              readOnly={true}
              width="100%"
              height="100%"
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
                editorRef.current = editor;
                setTimeout(() => {
                  editor.resize();
                }, 100);
              }}
            />
          </div>
          <Group justify="flex-end">
            <Button onClick={handleCloseModal}>
              {t("table.close", { ns: "attributePanel" })}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};
