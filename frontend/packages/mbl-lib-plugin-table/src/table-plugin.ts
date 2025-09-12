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
} from "@mantine/core";
import { pt2px } from "@xxs3315/mbl-utils";
// import { Asterisk } from "lucide-react";

// SVG 图标定义 - 优化为常量，避免重复创建
const SVG_PROPS = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const addSVG = React.createElement(
  "svg",
  SVG_PROPS,
  React.createElement("path", { d: "M12 3v14" }),
  React.createElement("path", { d: "M5 10h14" }),
  React.createElement("path", { d: "M5 21h14" }),
);

// 向左移动图标（逆时针旋转90°）
const insertLeftSVG = React.createElement(
  "svg",
  {
    ...SVG_PROPS,
    style: { transform: "rotate(-90deg)" },
  },
  React.createElement("path", { d: "M12 3v14" }),
  React.createElement("path", { d: "M5 10h14" }),
  React.createElement("path", { d: "M5 21h14" }),
);

// 向右移动图标（顺时针旋转90°）
const insertRightSVG = React.createElement(
  "svg",
  {
    ...SVG_PROPS,
    style: { transform: "rotate(90deg)" },
  },
  React.createElement("path", { d: "M12 3v14" }),
  React.createElement("path", { d: "M5 10h14" }),
  React.createElement("path", { d: "M5 21h14" }),
);

const copySVG = React.createElement(
  "svg",
  SVG_PROPS,
  React.createElement("rect", {
    width: "14",
    height: "14",
    x: "8",
    y: "8",
    rx: "2",
    ry: "2",
  }),
  React.createElement("path", {
    d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
  }),
);

const deleteSVG = React.createElement(
  "svg",
  SVG_PROPS,
  React.createElement("path", { d: "M3 6h18" }),
  React.createElement("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
  React.createElement("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }),
  React.createElement("line", { x1: "10", x2: "10", y1: "11", y2: "17" }),
  React.createElement("line", { x1: "14", x2: "14", y1: "11", y2: "17" }),
);

const moveLeftSVG = React.createElement(
  "svg",
  SVG_PROPS,
  React.createElement("path", { d: "m9 6-6 6 6 6" }),
  React.createElement("path", { d: "M3 12h14" }),
  React.createElement("path", { d: "M21 19V5" }),
);

const moveRightSVG = React.createElement(
  "svg",
  SVG_PROPS,
  React.createElement("path", { d: "M3 5v14" }),
  React.createElement("path", { d: "M21 12H7" }),
  React.createElement("path", { d: "m15 18 6-6-6-6" }),
);

/**
 * 表格插件元数据
 */
export const TABLE_PLUGIN_METADATA = {
  id: "table-plugin",
  name: "TablePlugin",
  version: "1.0.0",
  description: "表格插件 - 支持拖拽创建表格",
  type: "element" as const,
  category: "plugin-table",
  icon: "table",
  toolbarConfig: {
    label: "表格",
    icon: "table",
    tooltip: "拖拽创建表格",
  },
  defaultConfig: {
    // 属性
    value: "",
    background: "#f2f3f5",
    horizontal: "left" as const,
    vertical: "top" as const,
    wildStar: false,
    canShrink: false,
    canGrow: true,
    flexValue: 100,
    flexUnit: "px" as const,
    pTop: 0,
    pRight: 0,
    pBottom: 0,
    pLeft: 0,
    bindings: [],
    columns: [
      [
        "table-root",
        {
          id: "table-root",
          title: "",
          children: ["hlG3wLEQNtxW"],
          cat: "container",
          direction: "vertical",
        },
      ],

      [
        "hlG3wLEQNtxW",
        {
          id: "hlG3wLEQNtxW",
          title: "container-hlG3wLEQNtxW",
          children: ["97p5pTRWYJL9", "e6ccaf5fd46t", "cEaNlFkj8gwV"],
          cat: "container",
          direction: "horizontal",
          canShrink: false,
          canGrow: false,
          flexValue: 100,
          flexUnit: "px",
          horizontal: "center",
          vertical: "middle",
        },
      ],
      [
        "97p5pTRWYJL9",
        {
          id: "97p5pTRWYJL9",
          title: "text-97p5pTRWYJL9",
          cat: "text",
          value: "序号",
          horizontal: "center",
          vertical: "middle",
          font: "simsun",
          fontSize: 10,
          fontColor: "#000000",
          wildStar: false,
          canShrink: false,
          canGrow: false,
          flexValue: 16,
          flexUnit: "%",
        },
      ],
      [
        "e6ccaf5fd46t",
        {
          id: "e6ccaf5fd46t",
          title: "text-e6ccaf5fd46t",
          cat: "text",
          value: "姓名",
          horizontal: "center",
          vertical: "middle",
          font: "simsun",
          fontSize: 10,
          fontColor: "#000000",
          wildStar: false,
          canShrink: false,
          canGrow: false,
          flexValue: 50,
          flexUnit: "%",
        },
      ],
      [
        "cEaNlFkj8gwV",
        {
          id: "cEaNlFkj8gwV",
          title: "text-cEaNlFkj8gwV",
          cat: "text",
          value: "Email",
          horizontal: "center",
          vertical: "middle",
          font: "simsun",
          fontSize: 10,
          fontColor: "#000000",
          wildStar: false,
          canShrink: false,
          canGrow: false,
          flexValue: 34,
          flexUnit: "%",
        },
      ],
    ],
  },
};

/**
 * 表格插件属性接口
 */
export interface TablePluginProps {
  id: string;
  dpi?: number; // DPI 参数
  onPropsChange?: (newProps: any) => void; // 属性变化回调
  colors?: any; // 主题颜色
  currentSelectedId?: string;
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
}

// 工具函数：将 columns 数组转换为 Map
const columnsToMap = (columns: any[]) => {
  return new Map(columns);
};

// 获取 flex 样式
const getFlexStyle = (item: any) => {
  const flexValue = item.wildStar
    ? "1"
    : `${item.canGrow ? "1" : "0"} ${item.canShrink ? "1" : "0"} ${item.flexUnit === "%" ? item.flexValue : item.flexValue}${item.flexUnit}`;
  return { flex: flexValue };
};

// 获取垂直对齐样式
const getVerticalStyle = (vertical?: string) => {
  if (vertical === "top")
    return {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginTop: 0,
    };
  if (vertical === "bottom")
    return {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-end",
      marginTop: 0,
    };
  return {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 0,
  };
};

// 带防抖和输入法支持的文本组件
const TextareaWithComposition = React.memo<{
  props: any;
  dpi: number;
  onValueChange?: (itemId: string, newValue: string) => void;
  onColumnAction?: (action: string, columnId: string) => void;
  onColumnSelect?: (columnId: string) => void;
  currentSelectedColumnId?: string;
  currentSelectedId?: string;
  tableId?: string;
  colors?: any; // 主题颜色
}>(
  ({
    props,
    dpi,
    onValueChange,
    onColumnAction,
    onColumnSelect,
    currentSelectedColumnId,
    currentSelectedId,
    tableId,
    colors,
  }) => {
    const [localValue, setLocalValue] = React.useState(props.value ?? "");
    const [isComposing, setIsComposing] = React.useState(false);
    const debounceTimeoutRef = React.useRef<number | null>(null);

    // 同步外部值变化到本地状态
    React.useEffect(() => {
      setLocalValue(props.value ?? "");
    }, [props.value]);

    // 防抖更新函数
    const debouncedUpdate = React.useCallback(
      (value: string) => {
        if (debounceTimeoutRef.current) {
          window.clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = window.setTimeout(() => {
          if (onValueChange && value !== props.value) {
            onValueChange(props.id, value);
          }
        }, 300); // 300ms 防抖延迟
      },
      [onValueChange, props.id, props.value],
    );

    // 清理定时器
    React.useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          window.clearTimeout(debounceTimeoutRef.current);
        }
      };
    }, []);

    const handleCompositionStart = React.useCallback(() => {
      setIsComposing(true);
    }, []);

    const handleCompositionEnd = React.useCallback(
      (event: React.CompositionEvent<HTMLTextAreaElement>) => {
        setIsComposing(false);
        const value = event.currentTarget.value;
        setLocalValue(value);
        // 输入法结束时立即更新
        if (onValueChange && value !== props.value) {
          onValueChange(props.id, value);
        }
      },
      [props.id, props.value, onValueChange],
    );

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.currentTarget.value;
        setLocalValue(value);

        // 只有在非输入法状态下才进行防抖更新
        if (!isComposing) {
          debouncedUpdate(value);
        }
      },
      [isComposing, debouncedUpdate],
    );

    const handleClick = React.useCallback(() => {
      onColumnSelect?.(props.id);
    }, [onColumnSelect, props.id]);

    const handleFocus = React.useCallback(() => {
      onColumnSelect?.(props.id);
    }, [onColumnSelect, props.id]);

    // 按钮样式常量
    const BUTTON_STYLE = {
      height: "16px",
      width: "16px",
      cursor: "pointer",
      borderRadius: "2px",
      color: colors?.primary ? `${colors.primary}E6` : "#374151", // 使用主题色的90%透明度，更深一些
      backgroundColor: "transparent",
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      opacity: 1,
    } as const;

    const BUTTONS_CONTAINER_STYLE = {
      position: "absolute",
      top: "-12px",
      right: "0",
      display: "flex",
      gap: "3px",
      zIndex: 10,
      backgroundColor: "#fafafa",
      borderRadius: "2px",
      padding: "2px",
      boxShadow: colors?.primary
        ? `0 2px 8px ${colors.primary}20, 0 1px 3px rgba(0, 0, 0, 0.1)`
        : "0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)",
      border: colors?.primary
        ? `1px solid ${colors.primary}20`
        : "1px solid #e5e7eb", // 降低边框透明度
      backdropFilter: "blur(8px)",
    } as const;

    // 创建带hover效果的按钮
    const createButton = (action: string, icon: React.ReactElement) => {
      return React.createElement(
        "div",
        {
          style: BUTTON_STYLE,
          onClick: (event: any) => {
            onColumnAction?.(action, props.id);
            event.stopPropagation();
          },
          onMouseEnter: (e: any) => {
            // 确保获取正确的按钮容器元素
            const buttonElement = e.currentTarget;
            buttonElement.style.backgroundColor = colors?.primary
              ? `${colors.primary}30`
              : "#d1d5db"; // 使用主题色的30%透明度，更明显
            buttonElement.style.opacity = "1";
            buttonElement.style.transform = "scale(1.05)"; // 按钮容器也稍微放大

            // 对SVG元素应用缩放效果
            const svgElement = buttonElement.querySelector("svg");
            if (svgElement) {
              const currentTransform = svgElement.style.transform || "";
              // 避免重复添加scale效果
              if (!currentTransform.includes("scale(1.15)")) {
                svgElement.style.transform = currentTransform + " scale(1.15)"; // SVG放大更多
              }
            }
          },
          onMouseLeave: (e: any) => {
            // 确保获取正确的按钮容器元素
            const buttonElement = e.currentTarget;
            buttonElement.style.backgroundColor = "transparent";
            buttonElement.style.opacity = "0.9";
            buttonElement.style.transform = "scale(1)"; // 重置按钮容器缩放

            // 移除SVG元素的缩放效果
            const svgElement = buttonElement.querySelector("svg");
            if (svgElement) {
              const currentTransform = svgElement.style.transform || "";
              // 更精确地移除scale效果
              svgElement.style.transform = currentTransform.replace(
                /\s*scale\(1\.15\)/g,
                "",
              );
            }
          },
        },
        icon,
      );
    };

    // 按钮渲染函数 - 使用 useMemo 缓存
    const renderFloatingButtons = React.useMemo(() => {
      const isSelected =
        currentSelectedColumnId === props.id && currentSelectedId === tableId;
      if (!isSelected || !onColumnAction) return null;

      return React.createElement(
        "div",
        { style: BUTTONS_CONTAINER_STYLE },
        createButton("moveLeft", moveLeftSVG),
        createButton("moveRight", moveRightSVG),
        createButton("copy", copySVG),
        createButton("delete", deleteSVG),
        createButton("insertLeft", insertLeftSVG),
        createButton("insertRight", insertRightSVG),
      );
    }, [
      currentSelectedColumnId,
      props.id,
      onColumnAction,
      currentSelectedId,
      tableId,
    ]);

    // 缓存样式对象以避免重复创建
    const textareaStyles = React.useMemo(
      () => ({
        root: {
          paddingTop: `${pt2px(props.pTop ?? 0, dpi)}px`,
          paddingRight: `${pt2px(props.pRight ?? 0, dpi)}px`,
          paddingBottom: `${pt2px(props.pBottom ?? 0, dpi)}px`,
          paddingLeft: `${pt2px(props.pLeft ?? 0, dpi)}px`,
          display: "flex",
          alignItems: "center", // 垂直居中
          height: "100%", // 确保容器占满高度
          width: "100%", // 确保容器占满宽度
        },
        wrapper: {
          width: "100%",
        },
        input: {
          textIndent: props.indent ? "2em" : 0,
          fontSize: `${pt2px(props.fontSize ?? 12, dpi)}px`,
          fontWeight: props.bold ? "bolder" : "normal",
          color: props.fontColor,
          background: props.background,
          textAlign: props.horizontal,
          border: "none",
          padding: 0,
          "--input-height": "16px",
          borderRadius: 0,
          outline: "none", // 移除默认的焦点轮廓
          boxShadow:
            currentSelectedColumnId === props.id &&
            currentSelectedId === tableId
              ? `0 0 0 1px ${colors?.primary || "#3b82f6"}`
              : "none", // 选中时显示主题色阴影
          width: "100%",
        },
      }),
      [
        props.pTop,
        props.pRight,
        props.pBottom,
        props.pLeft,
        props.indent,
        props.fontSize,
        props.bold,
        props.fontColor,
        props.background,
        props.horizontal,
        dpi,
        currentSelectedColumnId, // 添加 currentSelectedColumnId 到依赖数组
        currentSelectedId,
        tableId,
        props.id, // 添加 props.id 到依赖数组
        colors?.primary, // 添加主题颜色到依赖数组
      ],
    );

    return React.createElement(
      "div",
      {
        style: {
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
        },
      },
      React.createElement(Textarea as any, {
        autosize: true,
        size: "xs",
        radius: "xs",
        value: localValue,
        onChange: handleChange,
        onClick: handleClick,
        onFocus: handleFocus,
        onCompositionStart: handleCompositionStart,
        onCompositionEnd: handleCompositionEnd,
        styles: textareaStyles,
      }),
      renderFloatingButtons,
    );
  },
);

// 渲染文本组件
const renderTextComponent = (
  props: any,
  dpi: number = 96,
  onValueChange?: (itemId: string, newValue: string) => void,
  onColumnAction?: (action: string, columnId: string) => void,
  onColumnSelect?: (columnId: string) => void,
  currentSelectedColumnId?: string,
  currentSelectedId?: string,
  tableId?: string,
  colors?: any,
): React.ReactElement => {
  return React.createElement(TextareaWithComposition, {
    props,
    dpi,
    onValueChange,
    onColumnAction,
    onColumnSelect,
    currentSelectedColumnId,
    currentSelectedId,
    tableId,
    colors,
  });
};

// 样式常量 - 避免重复创建对象
const HORIZONTAL_CONTAINER_STYLE = {
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch", // 让各个列在竖直方向上撑满容器
  justifyContent: "flex-start",
  border: "1px solid #e5e7eb",
  padding: "0",
} as const;

const VERTICAL_CONTAINER_STYLE = {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch", // 让各个行在水平方向上撑满容器
  justifyContent: "flex-start",
  border: "1px solid #e5e7eb",
  padding: "0",
} as const;

const INNER_HORIZONTAL_STYLE = {
  display: "flex",
  width: "100%",
  flexDirection: "row",
  alignItems: "stretch", // 让 flex items 在竖直方向撑满容器
  justifyContent: "flex-start",
  border: "1px solid #e5e7eb",
  padding: "0",
  backgroundColor: "#f3f4f620",
  color: "#3b82f6",
  gap: "1px",
} as const;

const INNER_VERTICAL_STYLE = {
  borderRadius: "none",
  border: "1px solid #e5e7eb",
  padding: "0",
  backgroundColor: "#f3f4f620",
  display: "flex",
  flexDirection: "column",
  gap: "1px",
} as const;

const LEAF_NODE_STYLE = {
  display: "flex",
  height: "100%",
  width: "100%",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "space-between",
  borderRadius: "none",
  border: "none",
  backgroundColor: "white",
  padding: "0",
} as const;

const LEAF_INNER_STYLE = {
  height: "100%",
  minHeight: "16px",
  width: "100%",
  padding: "0px",
} as const;

// 创建表格项元素（递归函数）
const createTableItemElement = (
  item: any,
  index: number,
  contentMap: Map<string, any>,
  dpi: number = 96,
  onValueChange?: (itemId: string, newValue: string) => void,
  onColumnAction?: (action: string, columnId: string) => void,
  onColumnSelect?: (columnId: string) => void,
  currentSelectedColumnId?: string,
  currentSelectedId?: string,
  tableId?: string,
  colors?: any,
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
          dpi,
          onValueChange,
          onColumnAction,
          onColumnSelect,
          currentSelectedColumnId,
          currentSelectedId,
          tableId,
          colors,
        ),
    );

    if (item.direction === "horizontal") {
      return React.createElement(
        "div",
        {
          key: `table-item-h-${item.id}`,
          style: {
            ...HORIZONTAL_CONTAINER_STYLE,
            ...getFlexStyle(item),
          },
        },
        React.createElement(
          "div",
          { style: INNER_HORIZONTAL_STYLE },
          ...childItemElements,
        ),
      );
    }

    if (item.direction === "vertical") {
      return React.createElement(
        "div",
        {
          key: `table-item-v-${item.id}`,
          style: {
            ...VERTICAL_CONTAINER_STYLE,
            ...getFlexStyle(item),
          },
        },
        React.createElement(
          "div",
          { style: INNER_VERTICAL_STYLE },
          ...childItemElements,
        ),
      );
    }
  }

  // 渲染叶子节点（文本元素）
  return React.createElement(
    "div",
    {
      key: `table-item-${item.id}`,
      style: {
        ...LEAF_NODE_STYLE,
        ...getFlexStyle(item),
      },
    },
    React.createElement(
      "div",
      { style: LEAF_INNER_STYLE },
      item.cat === "text"
        ? renderTextComponent(
            item,
            dpi,
            onValueChange,
            onColumnAction,
            onColumnSelect,
            currentSelectedColumnId,
            currentSelectedId,
            tableId,
            colors,
          )
        : React.createElement("span"),
    ),
  );
};

/**
 * 表格组件
 */
export const TableComponent: React.FC<TablePluginProps> = ({
  id: tableId,
  attrs,
  dpi = 96,
  currentSelectedId,
  onPropsChange,
  colors,
}) => {
  console.log("currentSelectedId", currentSelectedId);

  const { background, columns, pTop, pRight, pBottom, pLeft } = attrs;

  // 内部状态管理 columns 数据
  const [internalColumns, setInternalColumns] = React.useState(columns);

  // 内部状态管理当前选中的列 ID
  const [currentSelectedColumnId, setCurrentSelectedColumnId] =
    React.useState<string>("");

  // 当外部 columns 变化时，同步内部状态
  React.useEffect(() => {
    setInternalColumns(columns);
  }, [columns]);

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

      // 使用 setTimeout 来异步通知外部，避免在渲染过程中调用 setState
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
      // 只有点击其他列时才变化，如果点击的是当前已选中的列则不变化
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

      // 生成新的 ID
      const generateId = () => {
        return Math.random().toString(36).substr(2, 9);
      };

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

          // 优化：直接构建新数组，避免多次遍历
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
          // 优化：一次遍历完成过滤和更新
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

        case "insertLeft": {
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
          newChildren.splice(currentIndex, 0, newColumnId);

          // 优化：直接构建新数组，避免多次遍历
          newColumns = internalColumns.map(([id, data]) => {
            if (id === tableContainer.id) {
              return [id, { ...data, children: newChildren }];
            }
            return [id, data];
          });
          newColumns.push([newColumnId, newColumnData]);
          break;
        }

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
          newChildren.splice(currentIndex + 1, 0, newColumnId);

          // 优化：直接构建新数组，避免多次遍历
          newColumns = internalColumns.map(([id, data]) => {
            if (id === tableContainer.id) {
              return [id, { ...data, children: newChildren }];
            }
            return [id, data];
          });
          newColumns.push([newColumnId, newColumnData]);
          break;
        }

        case "moveLeft": {
          const currentIndex = tableContainer.children.indexOf(columnId);
          // 检查边界：不能移动到第一个位置之前
          if (currentIndex > 0) {
            const newChildren = [...tableContainer.children];
            // 移除当前列
            newChildren.splice(currentIndex, 1);
            // 插入到前一个位置
            newChildren.splice(currentIndex - 1, 0, columnId);

            newColumns = internalColumns.map(([id, data]) => {
              if (id === tableContainer.id) {
                return [id, { ...data, children: newChildren }];
              }
              return [id, data];
            });
          } else {
            // 已经在最左边，不进行任何操作
            newColumns = internalColumns;
          }
          break;
        }

        case "moveRight": {
          const currentIndex = tableContainer.children.indexOf(columnId);
          // 检查边界：不能移动到最后一个位置之后
          if (currentIndex < tableContainer.children.length - 1) {
            const newChildren = [...tableContainer.children];
            // 移除当前列
            newChildren.splice(currentIndex, 1);
            // 插入到后一个位置
            newChildren.splice(currentIndex + 1, 0, columnId);

            newColumns = internalColumns.map(([id, data]) => {
              if (id === tableContainer.id) {
                return [id, { ...data, children: newChildren }];
              }
              return [id, data];
            });
          } else {
            // 已经在最右边，不进行任何操作
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

  // 将内部 columns 数组转换为 Map - 使用 useMemo 缓存
  const contentMap = React.useMemo(
    () => columnsToMap(internalColumns),
    [internalColumns],
  );

  // 找到根元素 - 使用 useMemo 缓存
  const rootItem = React.useMemo(
    () => contentMap.get("table-root") as any,
    [contentMap],
  );

  if (!rootItem || !rootItem.children) {
    return React.createElement(
      "div",
      {
        style: {
          background: background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e5e7eb",
        },
      },
      "表格",
    );
  }

  // 获取顶级子元素 - 使用 useMemo 缓存
  const topLevelItems = React.useMemo(
    () =>
      (rootItem.children as string[])
        .map((itemId: string) => contentMap.get(itemId))
        .filter(Boolean),
    [rootItem.children, contentMap],
  );

  // 渲染所有顶级元素 - 使用 useMemo 缓存
  const topLevelElements = React.useMemo(
    () =>
      topLevelItems.map((item: any, index: number) =>
        createTableItemElement(
          item,
          index,
          contentMap as any,
          dpi,
          handleValueChange,
          handleColumnAction,
          handleColumnSelect,
          currentSelectedColumnId,
          currentSelectedId,
          tableId,
          colors,
        ),
      ),
    [
      topLevelItems,
      contentMap,
      dpi,
      handleValueChange,
      handleColumnAction,
      handleColumnSelect,
      currentSelectedColumnId,
      currentSelectedId,
      tableId,
      colors,
    ],
  );

  return React.createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        background: background,
        border: "1px solid #e5e7eb",
        paddingTop: `${pt2px(pTop ?? 8, dpi)}px`,
        paddingRight: `${pt2px(pRight ?? 8, dpi)}px`,
        paddingBottom: `${pt2px(pBottom ?? 8, dpi)}px`,
        paddingLeft: `${pt2px(pLeft ?? 8, dpi)}px`,
        display: "flex",
        flexDirection: "column",
      },
    },
    ...topLevelElements,
  );
};

/**
 * 表格插件对象
 */
export const tablePlugin = {
  metadata: TABLE_PLUGIN_METADATA,

  /**
   * 渲染表格组件
   */
  render: (props: TablePluginProps) => {
    return React.createElement(TableComponent, props);
  },

  /**
   * 渲染表格组件的属性面板
   */
  renderAttrPanel: (
    props: TablePluginProps,
    onPropsChange?: (newProps: TablePluginProps) => void,
  ) => {
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

    const handleColumnChange = (
      columnId: string,
      field: string,
      value: any,
    ) => {
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

    // 获取表格的列数据 - 使用 useMemo 缓存
    const columnsMap = React.useMemo(
      () => new Map(props.attrs.columns),
      [props.attrs.columns],
    );

    const tableRoot = React.useMemo(
      () => columnsMap.get("table-root") as any,
      [columnsMap],
    );

    // table-root 只有一个子元素，这个子元素的 children 才是真正的列
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

    return React.createElement(
      Stack as any,
      {
        gap: 0,
        style: { padding: 0 },
      },
      // 表格属性标题
      React.createElement(
        Title as any,
        {
          order: 4,
          style: { marginBottom: 0 },
        },
        "表格属性",
      ),
      // 分隔线
      React.createElement(Divider as any, { my: "xs" }),

      // 内边距设置 - 使用 Grid 布局更紧凑
      React.createElement(
        Grid as any,
        { gutter: "xs" },
        React.createElement(
          Grid.Col as any,
          { span: 6 },
          React.createElement(NumberInput as any, {
            label: "上内边距",
            placeholder: "0",
            value: props.attrs.pTop,
            onChange: (value: any) =>
              handlePaddingChange("pTop", Number(value) || 0),
            size: "xs",
            min: 0,
            max: 100,
          }),
        ),
        React.createElement(
          Grid.Col as any,
          { span: 6 },
          React.createElement(NumberInput as any, {
            label: "右内边距",
            placeholder: "0",
            value: props.attrs.pRight,
            onChange: (value: any) =>
              handlePaddingChange("pRight", Number(value) || 0),
            size: "xs",
            min: 0,
            max: 100,
          }),
        ),
        React.createElement(
          Grid.Col as any,
          { span: 6 },
          React.createElement(NumberInput as any, {
            label: "下内边距",
            placeholder: "0",
            value: props.attrs.pBottom,
            onChange: (value: any) =>
              handlePaddingChange("pBottom", Number(value) || 0),
            size: "xs",
            min: 0,
            max: 100,
          }),
        ),
        React.createElement(
          Grid.Col as any,
          { span: 6 },
          React.createElement(NumberInput as any, {
            label: "左内边距",
            placeholder: "0",
            value: props.attrs.pLeft,
            onChange: (value: any) =>
              handlePaddingChange("pLeft", Number(value) || 0),
            size: "xs",
            min: 0,
            max: 100,
          }),
        ),
      ),

      // 分隔线
      React.createElement(Divider as any, { my: "xs" }),

      // 列分布编辑
      React.createElement(
        Title as any,
        {
          order: 4,
          style: { marginBottom: 0 },
        },
        "列分布设置",
      ),
      // 分隔线
      React.createElement(Divider as any, { my: "xs" }),

      // 渲染每一列的编辑控件
      ...tableColumns.map((column: any, index: number) =>
        React.createElement(
          React.Fragment as any,
          { key: column.id },
          React.createElement(
            Grid as any,
            { gutter: "xs" },
            React.createElement(
              Grid.Col as any,
              { span: 12 },
              React.createElement(
                Grid as any,
                {
                  gutter: "xs",
                  styles: {
                    root: { marginTop: "8px" },
                  },
                },
                React.createElement(
                  Grid.Col as any,
                  { span: 8 },
                  React.createElement(
                    Text as any,
                    {
                      size: "sm",
                      fw: 500,
                      mb: 2,
                      mt: 2,
                    },
                    column.value && column.value.trim() !== ""
                      ? `列: ${column.value}`
                      : `列: ${index + 1}`,
                  ),
                ),
                React.createElement(
                  Grid.Col as any,
                  { span: 4 },
                  React.createElement(Checkbox as any, {
                    checked: column.wildStar || false,
                    onChange: (event: any) => {
                      handleColumnChange(
                        column.id,
                        "wildStar",
                        event.currentTarget.checked,
                      );
                    },
                    label: "*",
                    variant: "outline",
                    radius: "xs",
                    size: "xs",
                    styles: {
                      root: { marginTop: "4px" },
                      label: {
                        paddingInlineStart: "4px",
                      },
                    },
                  }),
                ),
              ),
            ),
            React.createElement(
              Grid.Col as any,
              { span: 8 },
              React.createElement(NumberInput as any, {
                disabled: column.wildStar,
                label: "大小",
                size: "xs",
                value: column.flexValue || 100,
                onChange: (value: any) => {
                  handleColumnChange(column.id, "flexValue", Number(value));
                },
                min: 6,
                max: 288,
              }),
            ),
            React.createElement(
              Grid.Col as any,
              { span: 4 },
              React.createElement(Select as any, {
                disabled: column.wildStar,
                allowDeselect: false,
                size: "xs",
                label: "单位",
                placeholder: "选择值",
                data: [
                  { value: "%", label: "%" },
                  { value: "px", label: "pt" },
                ],
                value: column.flexUnit || "%",
                onChange: (value: any) => {
                  handleColumnChange(column.id, "flexUnit", value);
                },
              }),
            ),
          ),
          React.createElement(Divider as any, { my: "xs" }),
        ),
      ),
    );
  },

  /**
   * 获取工具栏配置
   */
  getToolbarConfig: () => {
    return {
      type: "element",
      cat: "plugin-table",
      attrs: {
        pluginId: TABLE_PLUGIN_METADATA.id,
        ...TABLE_PLUGIN_METADATA.defaultConfig,
      },
    };
  },

  /**
   * 处理拖拽数据
   */
  processDragData: (data: any) => {
    console.log("[Table Plugin] Processing drag data:", data);
    return {
      type: "element",
      cat: "plugin-table",
      attrs: {
        pluginId: TABLE_PLUGIN_METADATA.id,
        ...TABLE_PLUGIN_METADATA.defaultConfig,
      },
    };
  },
};

export default tablePlugin;
