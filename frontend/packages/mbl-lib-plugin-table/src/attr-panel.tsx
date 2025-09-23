import React from "react";
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
      bindings: any[];
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

  // 获取表格的列数据
  const columnsMap = React.useMemo(
    () => new Map(props.attrs.columns),
    [props.attrs.columns],
  );

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
      {/* 表格属性标题 */}
      <Title order={4} style={{ marginBottom: 0 }}>
        {t("table.title", { ns: "attributePanel" })}
      </Title>

      {/* 分隔线 */}
      <Divider my="xs" />

      {/* 内边距设置 */}
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

      {/* 分隔线 */}
      <Divider my="xs" />

      {/* 列分布编辑 */}
      <Title order={4} style={{ marginBottom: 0 }}>
        {t("table.columnDistribution", { ns: "attributePanel" })}
      </Title>

      {/* 分隔线 */}
      <Divider my="xs" />

      {/* 渲染每一列的编辑控件 */}
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

      {/* 分隔线 */}
      <Divider my="xs" />

      {/* 表格绑定信息 */}
      <Title order={4} style={{ marginBottom: 0 }}>
        表格绑定信息
      </Title>

      {/* 分隔线 */}
      <Divider my="xs" />

      <Stack gap="0" mt={2} mb={2}>
        {(props.attrs.bindings || []).map((binding: any) => {
          const editorConfig = getEditorConfig(binding.request);
          return (
            <Paper key={binding.id} p="xs" withBorder>
              <Stack gap="0">
                <Group gap="xs">
                  <Text size="xs" fw={500}>
                    {binding.name || binding.id}
                  </Text>
                  <Badge
                    size="xs"
                    color={binding.shape === "list" ? "blue" : "green"}
                    variant="light"
                  >
                    {binding.shape}
                  </Badge>
                  <Badge
                    size="xs"
                    color={binding.request === "url" ? "orange" : "purple"}
                    variant="light"
                  >
                    {binding.request}
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed">
                  {binding.description}
                </Text>
                <Group justify="space-between" align="center" mt="xs">
                  <Text size="xs" fw={500}>
                    {binding.request === "url" ? "URL Address" : "JSON Data"}
                  </Text>
                  <Tooltip label="View in large window">
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="blue"
                      onClick={() => handleOpenModal(binding)}
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
                    mode={binding.request === "data" ? "json" : "text"}
                    theme={"github"}
                    value={binding.value}
                    readOnly={true}
                    width="100%"
                    height={binding.request === "data" ? "100px" : "60px"}
                    setOptions={{ ...editorConfig, readOnly: true }}
                    editorProps={getEditorProps()}
                    style={getEditorStyle()}
                  />
                </Box>
              </Stack>
            </Paper>
          );
        })}
      </Stack>

      {currentSubSelectedId && currentSubSelectedId !== "" && (
        <>
          {/* 分隔线 */}
          <Divider my="xs" />

          {/* 列分布编辑 */}
          <Title order={4} style={{ marginBottom: 0 }}>
            {currentSubSelectedId}
          </Title>

          {/* 分隔线 */}
          <Divider my="xs" />
        </>
      )}

      <Modal
        opened={modalOpen}
        onClose={handleCloseModal}
        title={viewingBinding?.name || "View Content"}
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
          <div style={{ flex: 1, minHeight: 0, border: "1px solid #ccc" }}>
            <AceEditor
              mode={viewingBinding?.request === "data" ? "json" : "text"}
              theme="github"
              value={viewingBinding?.value || ""}
              readOnly={true}
              width="100%"
              height="100%"
              setOptions={{
                ...getEditorConfig(viewingBinding?.request || "data"),
                readOnly: true,
              }}
              editorProps={getEditorProps()}
              style={getEditorStyle()}
            />
          </div>
          <Group justify="flex-end">
            <Button onClick={handleCloseModal}>Close</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};
