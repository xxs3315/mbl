import React from "react";
import { DndTarget, ItemTypes } from "@xxs3315/mbl-dnd";
import {
  useCurrentSelectedId,
  useDpi,
  useThemeColorsContext,
} from "@xxs3315/mbl-providers";
import { PageItem } from "@xxs3315/mbl-typings";
import { TextComponent } from "./text-component";
import {
  columnsToMap,
  getFlexStyle,
  getVerticalStyle,
  generateId,
  getPaddingStyle,
} from "./utils";
import {
  HORIZONTAL_CONTAINER_STYLE,
  VERTICAL_CONTAINER_STYLE,
  INNER_HORIZONTAL_STYLE,
  INNER_VERTICAL_STYLE,
  LEAF_NODE_STYLE,
  LEAF_INNER_STYLE,
} from "./styles";

interface TableComponentProps {
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
  onPropsChange?: (newProps: any) => void;
}

// 创建表格项元素（递归函数）
const createTableItemElement = (
  item: any,
  index: number,
  contentMap: Map<string, any>,
  onValueChange?: (itemId: string, newValue: string) => void,
  onColumnAction?: (action: string, columnId: string) => void,
  onColumnSelect?: (columnId: string) => void,
  currentSelectedColumnId?: string,
  currentSelectedId?: string,
  tableId?: string,
): React.ReactElement => {
  // 如果有子元素，渲染为容器
  if (item.children && item.children.length > 0) {
    const childItems = item.children.map(
      (itemId: string) => contentMap.get(itemId)!,
    );
    const childItemElements = childItems.map(
      (childItem: any, childIndex: number) =>
        createTableItemElement(
          childItem,
          childIndex,
          contentMap,
          onValueChange,
          onColumnAction,
          onColumnSelect,
          currentSelectedColumnId,
          currentSelectedId,
          tableId,
        ),
    );

    if (item.direction === "horizontal") {
      return (
        <div
          key={`table-item-h-${item.id}`}
          style={{
            ...HORIZONTAL_CONTAINER_STYLE,
            ...getFlexStyle(item),
          }}
        >
          <div style={INNER_HORIZONTAL_STYLE}>{childItemElements}</div>
        </div>
      );
    }

    if (item.direction === "vertical") {
      return (
        <div
          key={`table-item-v-${item.id}`}
          style={{
            ...VERTICAL_CONTAINER_STYLE,
            ...getFlexStyle(item),
          }}
        >
          <div style={INNER_VERTICAL_STYLE}>{childItemElements}</div>
        </div>
      );
    }
  }

  // 渲染叶子节点（文本元素）
  return (
    <div
      key={`table-item-${item.id}`}
      style={{
        ...LEAF_NODE_STYLE,
        ...getFlexStyle(item),
      }}
    >
      <div style={LEAF_INNER_STYLE}>
        {item.cat === "text" ? (
          <TextComponent
            props={item}
            onValueChange={onValueChange}
            onColumnAction={onColumnAction}
            onColumnSelect={onColumnSelect}
            currentSelectedColumnId={currentSelectedColumnId}
            currentSelectedId={currentSelectedId}
            tableId={tableId}
          />
        ) : (
          <span />
        )}
      </div>
    </div>
  );
};

export const TableComponent: React.FC<TableComponentProps> = ({
  id: tableId,
  attrs,
  onPropsChange,
}) => {
  const { currentSelectedId, setCurrentSubSelectedId } = useCurrentSelectedId();
  const { dpi } = useDpi();
  const colors = useThemeColorsContext();

  const { background, columns, bindingColumns, pTop, pRight, pBottom, pLeft } =
    attrs;

  // 内部状态管理
  const [internalColumns, setInternalColumns] = React.useState(columns);
  const [currentSelectedColumnId, setCurrentSelectedColumnId] =
    React.useState<string>("");

  // 当外部 columns 变化时，同步内部状态
  React.useEffect(() => {
    setInternalColumns(columns);
  }, [columns]);

  // 监听全局 currentSelectedId 变化
  React.useEffect(() => {
    if (currentSelectedId !== tableId) {
      setCurrentSelectedColumnId("");
      setCurrentSubSelectedId("");
    }
  }, [currentSelectedId, tableId]);

  // 处理文本值变化
  const handleValueChange = React.useCallback(
    (itemId: string, newValue: string) => {
      const newColumns = internalColumns.map(([id, data]) => {
        if (id === itemId) {
          return [id, { ...data, value: newValue }];
        }
        return [id, data];
      });

      setInternalColumns(newColumns);

      setTimeout(() => {
        if (onPropsChange) {
          onPropsChange({
            ...attrs,
            columns: newColumns,
          });
        }
      }, 0);
    },
    [internalColumns, onPropsChange, attrs],
  );

  // 处理列选中
  const handleColumnSelect = React.useCallback(
    (columnId: string) => {
      if (columnId !== currentSelectedColumnId) {
        setCurrentSelectedColumnId(columnId);
        setCurrentSubSelectedId(columnId);
      }
    },
    [currentSelectedColumnId],
  );

  // 处理列操作
  const handleColumnAction = React.useCallback(
    (action: string, columnId: string) => {
      if (!onPropsChange) return;

      const columnsMap = new Map(internalColumns);
      const tableRoot = columnsMap.get("table-root") as any;
      const tableContainer = tableRoot?.children?.[0]
        ? (columnsMap.get(tableRoot.children[0]) as any)
        : null;

      if (!tableContainer) return;

      // 创建 bindingColumns 的 Map
      const bindingColumnsMap = new Map(bindingColumns || []);
      const bindingTableRoot = bindingColumnsMap.get(
        "table-root-column-binding",
      ) as any;
      const bindingTableContainer = bindingTableRoot?.children?.[0]
        ? (bindingColumnsMap.get(bindingTableRoot.children[0]) as any)
        : null;

      let newColumns = [...internalColumns];
      let newBindingColumns = [...(bindingColumns || [])];

      switch (action) {
        case "copy": {
          const columnData = columnsMap.get(columnId);
          if (!columnData) return;

          const newColumnId = generateId();
          const newColumnData = {
            ...columnData,
            id: newColumnId,
            title: `${(columnData as any).title}-copy`,
          };

          const currentIndex = tableContainer.children.indexOf(columnId);
          const newChildren = [...tableContainer.children];
          newChildren.splice(currentIndex + 1, 0, newColumnId);

          newColumns = internalColumns.map(([id, data]) => {
            if (id === tableContainer.id) {
              return [id, { ...data, children: newChildren }];
            }
            return [id, data];
          });
          newColumns.push([newColumnId, newColumnData]);

          // 同步处理 bindingColumns
          if (bindingTableContainer) {
            const bindingColumnId = `${columnId}-column-binding`;
            const bindingColumnData = bindingColumnsMap.get(bindingColumnId);
            if (bindingColumnData) {
              const newBindingColumnId = `${newColumnId}-column-binding`;
              const newBindingColumnData = {
                ...bindingColumnData,
                id: newBindingColumnId,
                title: `${(bindingColumnData as any).title}-copy`,
              };

              const bindingCurrentIndex =
                bindingTableContainer.children.indexOf(bindingColumnId);
              const newBindingChildren = [...bindingTableContainer.children];
              newBindingChildren.splice(
                bindingCurrentIndex + 1,
                0,
                newBindingColumnId,
              );

              newBindingColumns = newBindingColumns.map(([id, data]) => {
                if (id === bindingTableContainer.id) {
                  return [id, { ...data, children: newBindingChildren }];
                }
                return [id, data];
              });
              newBindingColumns.push([
                newBindingColumnId,
                newBindingColumnData,
              ]);
            }
          }
          break;
        }

        case "delete": {
          if (internalColumns.length <= 3) {
            // TODO 这里要给出用户警告(notification)
            console.warn("不能删除最后一列");
            return;
          }
          const newChildren = tableContainer.children.filter(
            (id: string) => id !== columnId,
          );
          newColumns = internalColumns
            .filter(([id]) => id !== columnId)
            .map(([id, data]) => {
              if (id === tableContainer.id) {
                return [id, { ...data, children: newChildren }];
              }
              return [id, data];
            });

          // 同步处理 bindingColumns
          if (bindingTableContainer) {
            const bindingColumnId = `${columnId}-column-binding`;
            const newBindingChildren = bindingTableContainer.children.filter(
              (id: string) => id !== bindingColumnId,
            );
            newBindingColumns = newBindingColumns
              .filter(([id]) => id !== bindingColumnId)
              .map(([id, data]) => {
                if (id === bindingTableContainer.id) {
                  return [id, { ...data, children: newBindingChildren }];
                }
                return [id, data];
              });
          }
          break;
        }

        case "insertLeft":
        case "insertRight": {
          const newColumnId = generateId();
          const newColumnData = {
            id: newColumnId,
            title: `text-${newColumnId}`,
            cat: "text",
            value: "新列",
            horizontal: "center",
            vertical: "middle",
            font: "simsun",
            fontSize: 10,
            fontColor: "#000000",
            wildStar: false,
            canShrink: false,
            canGrow: false,
            flexValue: 20,
            flexUnit: "%",
          };

          const currentIndex = tableContainer.children.indexOf(columnId);
          const newChildren = [...tableContainer.children];
          newChildren.splice(
            action === "insertLeft" ? currentIndex : currentIndex + 1,
            0,
            newColumnId,
          );

          newColumns = internalColumns.map(([id, data]) => {
            if (id === tableContainer.id) {
              return [id, { ...data, children: newChildren }];
            }
            return [id, data];
          });
          newColumns.push([newColumnId, newColumnData]);

          // 同步处理 bindingColumns
          if (bindingTableContainer) {
            const newBindingColumnId = `${newColumnId}-column-binding`;
            const newBindingColumnData = {
              id: newBindingColumnId,
              title: `text-${newBindingColumnId}`,
              cat: "text",
              value: "",
              horizontal: "center",
              vertical: "middle",
              font: "simsun",
              fontSize: 10,
              fontColor: "#000000",
            };

            const bindingColumnId = `${columnId}-column-binding`;
            const bindingCurrentIndex =
              bindingTableContainer.children.indexOf(bindingColumnId);
            const newBindingChildren = [...bindingTableContainer.children];
            newBindingChildren.splice(
              action === "insertLeft"
                ? bindingCurrentIndex
                : bindingCurrentIndex + 1,
              0,
              newBindingColumnId,
            );

            newBindingColumns = newBindingColumns.map(([id, data]) => {
              if (id === bindingTableContainer.id) {
                return [id, { ...data, children: newBindingChildren }];
              }
              return [id, data];
            });
            newBindingColumns.push([newBindingColumnId, newBindingColumnData]);
          }
          break;
        }

        case "moveLeft":
        case "moveRight": {
          const currentIndex = tableContainer.children.indexOf(columnId);
          const targetIndex =
            action === "moveLeft" ? currentIndex - 1 : currentIndex + 1;

          if (
            targetIndex >= 0 &&
            targetIndex < tableContainer.children.length
          ) {
            const newChildren = [...tableContainer.children];
            newChildren.splice(currentIndex, 1);
            newChildren.splice(targetIndex, 0, columnId);

            newColumns = internalColumns.map(([id, data]) => {
              if (id === tableContainer.id) {
                return [id, { ...data, children: newChildren }];
              }
              return [id, data];
            });

            // 同步处理 bindingColumns
            if (bindingTableContainer) {
              const bindingColumnId = `${columnId}-column-binding`;
              const bindingCurrentIndex =
                bindingTableContainer.children.indexOf(bindingColumnId);
              const bindingTargetIndex =
                action === "moveLeft"
                  ? bindingCurrentIndex - 1
                  : bindingCurrentIndex + 1;

              if (
                bindingTargetIndex >= 0 &&
                bindingTargetIndex < bindingTableContainer.children.length
              ) {
                const newBindingChildren = [...bindingTableContainer.children];
                newBindingChildren.splice(bindingCurrentIndex, 1);
                newBindingChildren.splice(
                  bindingTargetIndex,
                  0,
                  bindingColumnId,
                );

                newBindingColumns = newBindingColumns.map(([id, data]) => {
                  if (id === bindingTableContainer.id) {
                    return [id, { ...data, children: newBindingChildren }];
                  }
                  return [id, data];
                });
              } else {
                newBindingColumns = bindingColumns || [];
              }
            }
          } else {
            newColumns = internalColumns;
            newBindingColumns = bindingColumns || [];
          }
          break;
        }
      }

      onPropsChange({
        ...attrs,
        columns: newColumns,
        bindingColumns: newBindingColumns,
      });
    },
    [attrs, onPropsChange, internalColumns, bindingColumns],
  );

  // 将内部 columns 数组转换为 Map
  const contentMap = React.useMemo(
    () => columnsToMap(internalColumns),
    [internalColumns],
  );

  // 将 bindingColumns 数组转换为 Map
  const bindingColumnsMap = React.useMemo(
    () => columnsToMap(bindingColumns || []),
    [bindingColumns],
  );

  // 找到根元素
  const rootItem = React.useMemo(
    () => contentMap.get("table-root") as any,
    [contentMap],
  );

  if (!rootItem || !rootItem.children) {
    return (
      <div
        style={{
          background: background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e5e7eb",
        }}
      >
        表格
      </div>
    );
  }

  // 获取顶级子元素
  const topLevelItems = React.useMemo(
    () =>
      (rootItem.children as string[])
        .map((itemId: string) => contentMap.get(itemId))
        .filter(Boolean),
    [rootItem.children, contentMap],
  );

  const onBindingColumn = React.useCallback(
    (dropItem: any, targetColumnId?: string) => {
      if (!onPropsChange || !dropItem || !targetColumnId) return;

      console.log("dropItem", dropItem);

      // 从 dropItem 中获取字段信息
      const { bind, request, shape, value } = dropItem;
      const fieldName = bind || "";

      // 获取 config 的 id（这里需要从 dropItem 中获取，可能是 name 字段或其他标识）
      const configId = dropItem.id || "";

      // 创建新的 binding 对象
      const newBinding = {
        id: configId,
        request: request || "",
        shape: shape || "",
        value: value || "",
      };

      // 更新 bindings 数组
      const currentBindings = attrs.bindings || [];
      const newBindings = [...currentBindings];

      const existingIndex = newBindings.findIndex(
        (binding: any) => binding.id === dropItem.id,
      );

      console.log("existingIndex", existingIndex);
      if (existingIndex >= 0) {
        // 更新现有绑定
        newBindings[existingIndex] = newBinding;
      } else {
        // 添加新绑定
        newBindings.push(newBinding);
      }

      console.log("newBindings", newBindings);

      // 如果指定了目标列，则更新特定的绑定列
      const targetBindingColumnId = `${targetColumnId}-column-binding`;
      const newBindingColumns = (bindingColumns || []).map(([id, data]) => {
        if (id === targetBindingColumnId) {
          return [id, { ...data, value: fieldName }];
        }
        return [id, data];
      });

      // 更新组件属性
      onPropsChange({
        ...attrs,
        bindingColumns: newBindingColumns,
        bindings: newBindings,
      });
    },
    [onPropsChange, bindingColumns, attrs],
  );

  // 渲染所有顶级元素
  const topLevelElements = React.useMemo(() => {
    const elements = topLevelItems.map((item: any, index: number) =>
      createTableItemElement(
        item,
        index,
        contentMap as any,
        handleValueChange,
        handleColumnAction,
        handleColumnSelect,
        currentSelectedColumnId,
        currentSelectedId,
        tableId,
      ),
    );

    // 根据 bindingColumns 渲染绑定行
    const bindingRootItem = bindingColumnsMap.get(
      "table-root-column-binding",
    ) as any;
    if (
      bindingRootItem &&
      bindingRootItem.children &&
      bindingRootItem.children.length > 0
    ) {
      const bindingContainer = bindingColumnsMap.get(
        bindingRootItem.children[0],
      ) as any;
      if (
        bindingContainer &&
        bindingContainer.children &&
        bindingContainer.children.length > 0
      ) {
        const textareaRow = (
          <div
            key="textarea-row"
            style={{
              display: "flex",
              width: "100%",
              margin: "0",
              padding: "0",
              rowGap: "0",
              columnGap: "1px",
            }}
          >
            {bindingContainer.children.map(
              (bindingColumnId: string, columnIndex: number) => {
                // 从 bindingColumnId 中提取对应的 columnId（去掉 "-column-binding" 后缀）
                const columnId = bindingColumnId.replace("-column-binding", "");
                const columnData: PageItem = contentMap.get(columnId) as any;
                if (!columnData) return null;

                return (
                  <div
                    key={`textarea-column-binding-${columnId}`}
                    style={{
                      ...getFlexStyle(columnData),
                      ...getVerticalStyle(columnData.vertical),
                      position: "relative",
                      padding: "1px",
                      paddingRight: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    <DndTarget
                      identifier={`${tableId}-${columnId}`}
                      data-title={`${tableId}-${columnId}`}
                      accept={[ItemTypes.BINDING_LIST_ITEM]}
                      lastDroppedItem={null}
                      onDrop={(dropItem) => onBindingColumn(dropItem, columnId)}
                      key={9999}
                      greedy={false}
                      moreStyle={{
                        marginTop: 0,
                        padding: "0",
                        width: "100%",
                        height: "100%",
                        minHeight: "24px",
                      }}
                    >
                      <TextComponent
                        props={{
                          id: bindingColumnId,
                          value:
                            (bindingColumnsMap.get(bindingColumnId) as any)
                              ?.value || "",
                          placeholder: "拖拽列绑定到这里...",
                          readOnly: true,
                        }}
                        onValueChange={() => {}}
                        onColumnAction={undefined}
                        onColumnSelect={handleColumnSelect}
                        currentSelectedColumnId={currentSelectedColumnId}
                        currentSelectedId={currentSelectedId}
                        tableId={tableId}
                      />
                    </DndTarget>
                  </div>
                );
              },
            )}
          </div>
        );
        elements.push(textareaRow);
      }
    }

    return elements;
  }, [
    topLevelItems,
    contentMap,
    bindingColumnsMap,
    handleValueChange,
    handleColumnAction,
    handleColumnSelect,
    currentSelectedColumnId,
    currentSelectedId,
    tableId,
  ]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: background,
        border: "1px solid #e5e7eb",
        ...getPaddingStyle(pTop, pRight, pBottom, pLeft, dpi),
        display: "flex",
        flexDirection: "column",
      }}
    >
      {topLevelElements}
    </div>
  );
};
