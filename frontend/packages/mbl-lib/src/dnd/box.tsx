import { Text, Tooltip, ActionIcon } from "@mantine/core";
import type { CSSProperties, FC, ReactNode } from "react";
import { memo } from "react";
import { useDrag } from "react-dnd";
import { useThemeColors } from "../utils/theme-utils";
import React from "react";
import {
  Square,
  Type,
  Image,
  Table,
  FileText,
  Columns3,
  Rows3,
  SeparatorHorizontal,
  FileDigit,
} from "lucide-react";
import { css } from "../../styled-system/css";

// 根据 cat 属性获取对应的图标
const getIconByCat = (cat?: string, direction?: string) => {
  switch (cat) {
    case "container":
      return direction === "horizontal" ? (
        <Columns3 size={16} />
      ) : (
        <Rows3 size={16} />
      );
    case "placeholder":
      return <Square size={16} />;
    case "text":
      return <Type size={16} />;
    case "image":
      return <Image size={16} />;
    case "table":
      return <Table size={16} />;
    case "page-break":
      return <SeparatorHorizontal size={16} />;
    case "page-number":
      return <FileDigit size={16} />;
    default:
      return <FileText size={16} />;
  }
};

export interface BoxProps {
  id?: string;
  name: string;
  type: string;
  cat?: string;
  isDropped: boolean;
  attrs?: any;
  children?: ReactNode;
  request?: string;
  value?: any;
  shape?: "list" | "scatter";
  bind?: string;
  direction?: string;
}

export const Box: FC<BoxProps> = memo(function Box({
  id,
  name,
  type,
  isDropped,
  cat,
  attrs,
  children,
  request,
  value,
  shape,
  bind,
  direction,
}) {
  const colors = useThemeColors();
  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item: {
        id,
        name,
        type,
        cat,
        attrs,
        request,
        value,
        shape,
        bind,
        direction,
      },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [id, name, type, cat, attrs, request, value, shape, bind, direction],
  );

  const icon = getIconByCat(cat, direction || attrs?.direction);

  if (children) {
    // 如果有 children，保持原有的 div 形式（用于 ToolPanel 中的标签显示）
    return (
      <div
        ref={drag as any}
        style={{ opacity }}
        data-testid="box"
        className="hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
      >
        {children}
      </div>
    );
  }

  // 按钮形式
  return (
    <Tooltip label={name} position="bottom">
      <ActionIcon
        ref={drag as any}
        variant="subtle"
        size="lg"
        aria-label={name}
        style={{ opacity, cursor: "move" }}
        className={css({
          backgroundColor: "blue.500",
          color: "white",
          _hover: {
            backgroundColor: "blue.600",
          },
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:disabled, &[data-disabled]": {
            backgroundColor: "transparent !important",
          },
        })}
      >
        {icon}
      </ActionIcon>
    </Tooltip>
  );
});
