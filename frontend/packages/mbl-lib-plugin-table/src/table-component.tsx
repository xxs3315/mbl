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
  const { currentSelectedId } = useCurrentSelectedId();
  const { dpi } = useDpi();
  const colors = useThemeColorsContext();

  const { background, columns, pTop, pRight, pBottom, pLeft } = attrs;

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
    if (currentSelectedId === tableId) {
      console.log("Table selected:", tableId);
    } else {
      setCurrentSelectedColumnId("");
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

      let newColumns = [...internalColumns];

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
          break;
        }

        case "delete": {
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
          } else {
            newColumns = internalColumns;
          }
          break;
        }
      }

      onPropsChange({
        ...attrs,
        columns: newColumns,
      });
    },
    [attrs, onPropsChange, internalColumns],
  );

  // 将内部 columns 数组转换为 Map
  const contentMap = React.useMemo(
    () => columnsToMap(internalColumns),
    [internalColumns],
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

    // 如果第一行存在，添加一行与第一行列分布完全一致的textarea行，作为绑定占位
    if (topLevelItems.length > 0) {
      const firstRow: any = topLevelItems[0];
      if (firstRow && firstRow.children && firstRow.children.length > 0) {
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
            {firstRow.children.map((columnId: string, columnIndex: number) => {
              const columnData: PageItem = contentMap.get(columnId) as any;
              if (!columnData) return null;

              return (
                <div
                  key={`textarea-column-${columnId}`}
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
                    onDrop={() => {}}
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
                        id: `textarea-column-binding-${columnId}`,
                        value: "",
                        readOnly: true,
                      }}
                      onValueChange={() => {}}
                      onColumnAction={undefined}
                      onColumnSelect={undefined}
                      currentSelectedColumnId=""
                      currentSelectedId=""
                      tableId={tableId}
                    />
                  </DndTarget>
                </div>
              );
            })}
          </div>
        );
        elements.push(textareaRow);
      }
    }

    return elements;
  }, [
    topLevelItems,
    contentMap,
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
