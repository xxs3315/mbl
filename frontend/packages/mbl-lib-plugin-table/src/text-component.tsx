import React from "react";
import { Textarea, Badge, Group } from "@mantine/core";
import { pt2px } from "@xxs3315/mbl-utils";
import {
  useCurrentSelectedId,
  useDpi,
  useThemeColorsContext,
} from "@xxs3315/mbl-providers";
import {
  MoveLeftIcon,
  MoveRightIcon,
  CopyIcon,
  DeleteIcon,
  InsertLeftIcon,
  InsertRightIcon,
} from "./icons";
// 链接图标组件
const LinkIcon = ({
  size = 12,
  color = "#0ea5e9",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
import { BUTTON_STYLE, BUTTONS_CONTAINER_STYLE } from "./styles";

interface TextComponentProps {
  props: any;
  onValueChange?: (itemId: string, newValue: string) => void;
  onColumnAction?: (action: string, columnId: string) => void;
  onColumnSelect?: (columnId: string) => void;
  currentSelectedColumnId?: string;
  currentSelectedId?: string;
  tableId?: string;
}

// 带防抖和输入法支持的文本组件
export const TextComponent: React.FC<TextComponentProps> = ({
  props,
  onValueChange,
  onColumnAction,
  onColumnSelect,
  currentSelectedColumnId,
  currentSelectedId,
  tableId,
}) => {
  const { dpi } = useDpi();
  const colors = useThemeColorsContext();
  const { setCurrentSelectedId } = useCurrentSelectedId();

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
      }, 300);
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

      if (!isComposing) {
        debouncedUpdate(value);
      }
    },
    [isComposing, debouncedUpdate],
  );

  const handleClick = React.useCallback(() => {
    setCurrentSelectedId(tableId || "");
    onColumnSelect?.(props.id);
  }, [setCurrentSelectedId, onColumnSelect, props.id, tableId]);

  const handleFocus = React.useCallback(() => {
    setTimeout(() => {
      setCurrentSelectedId(tableId || "");
      onColumnSelect?.(props.id);
    }, 0);
  }, [setCurrentSelectedId, onColumnSelect, props.id, tableId]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Tab") {
        setCurrentSelectedId(tableId || "");
        onColumnSelect?.(props.id);
      }
    },
    [setCurrentSelectedId, onColumnSelect, props.id, tableId],
  );

  // 创建带hover效果的按钮
  const createButton = (action: string, icon: React.ReactElement) => {
    return (
      <div
        style={{
          ...BUTTON_STYLE,
          color: colors?.primary ? `${colors.primary}E6` : "#374151",
        }}
        onClick={(event) => {
          onColumnAction?.(action, props.id);
          event.stopPropagation();
        }}
        onMouseEnter={(e) => {
          const buttonElement = e.currentTarget;
          buttonElement.style.backgroundColor = colors?.primary
            ? `${colors.primary}30`
            : "#d1d5db";
          buttonElement.style.opacity = "1";
          buttonElement.style.transform = "scale(1.05)";

          const svgElement = buttonElement.querySelector("svg");
          if (svgElement) {
            const currentTransform = svgElement.style.transform || "";
            if (!currentTransform.includes("scale(1.15)")) {
              svgElement.style.transform = currentTransform + " scale(1.15)";
            }
          }
        }}
        onMouseLeave={(e) => {
          const buttonElement = e.currentTarget;
          buttonElement.style.backgroundColor = "transparent";
          buttonElement.style.opacity = "0.9";
          buttonElement.style.transform = "scale(1)";

          const svgElement = buttonElement.querySelector("svg");
          if (svgElement) {
            const currentTransform = svgElement.style.transform || "";
            svgElement.style.transform = currentTransform.replace(
              /\s*scale\(1\.15\)/g,
              "",
            );
          }
        }}
      >
        {icon}
      </div>
    );
  };

  // 按钮渲染
  const renderFloatingButtons = React.useMemo(() => {
    const isSelected =
      currentSelectedColumnId === props.id && currentSelectedId === tableId;
    if (!isSelected || !onColumnAction || props.readOnly) return null;

    return (
      <div
        style={{
          ...BUTTONS_CONTAINER_STYLE,
          boxShadow: colors?.primary
            ? `0 2px 8px ${colors.primary}20, 0 1px 3px rgba(0, 0, 0, 0.1)`
            : "0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)",
          border: colors?.primary
            ? `1px solid ${colors.primary}20`
            : "1px solid #e5e7eb",
        }}
      >
        {createButton("moveLeft", <MoveLeftIcon />)}
        {createButton("moveRight", <MoveRightIcon />)}
        {createButton("copy", <CopyIcon />)}
        {createButton("delete", <DeleteIcon />)}
        {createButton("insertLeft", <InsertLeftIcon />)}
        {createButton("insertRight", <InsertRightIcon />)}
      </div>
    );
  }, [
    currentSelectedColumnId,
    props.id,
    onColumnAction,
    currentSelectedId,
    tableId,
    colors?.primary,
  ]);

  // 缓存样式对象
  const textareaStyles = React.useMemo(
    () => ({
      root: {
        paddingTop: `${pt2px(props.pTop ?? 0, dpi)}px`,
        paddingRight: `${pt2px(props.pRight ?? 0, dpi)}px`,
        paddingBottom: `${pt2px(props.pBottom ?? 0, dpi)}px`,
        paddingLeft: `${pt2px(props.pLeft ?? 0, dpi)}px`,
        display: "flex",
        alignItems: "center",
        height: "100%",
        width: "100%",
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
        outline: "none",
        boxShadow:
          currentSelectedColumnId === props.id && currentSelectedId === tableId
            ? `0 0 0 1px ${colors?.primary || "#3b82f6"}`
            : "none",
        width: "100%",
        cursor: props.readOnly ? "pointer" : "text",
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
      currentSelectedColumnId,
      currentSelectedId,
      tableId,
      props.id,
      colors?.primary,
    ],
  );

  // 判断是否是绑定字段
  const isBindingField =
    props.readOnly && localValue && localValue.trim() !== "";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
      }}
    >
      {/* 绑定字段图标 */}
      {isBindingField && (
        <div
          style={{
            position: "absolute",
            left: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <LinkIcon size={12} color="#6b7280" />
        </div>
      )}

      {/* 文本输入框 */}
      <Textarea
        autosize
        size="xs"
        radius="xs"
        value={localValue}
        placeholder={props.placeholder}
        readOnly={props.readOnly || false}
        onChange={props.readOnly ? undefined : handleChange}
        onClick={handleClick}
        onFocus={props.readOnly ? undefined : handleFocus}
        onKeyDown={props.readOnly ? undefined : handleKeyDown}
        tabIndex={props.readOnly ? -1 : undefined}
        onCompositionStart={props.readOnly ? undefined : handleCompositionStart}
        onCompositionEnd={props.readOnly ? undefined : handleCompositionEnd}
        styles={{
          ...textareaStyles,
          input: {
            ...textareaStyles.input,
            // 为绑定字段添加特殊样式
            ...(isBindingField && {
              // backgroundColor: "#f9fafb",
              // border: "1px solid #d1d5db",
              // color: "#374151",
              paddingLeft: "24px", // 为图标留出空间
            }),
          },
        }}
      />
      {renderFloatingButtons}
    </div>
  );
};
