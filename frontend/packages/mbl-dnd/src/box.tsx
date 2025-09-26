import { Tooltip, ActionIcon } from "@mantine/core";
import type { FC, ReactNode } from "react";
import { memo } from "react";
import { useDrag } from "react-dnd";
import React from "react";
import "@mantine/core/styles.css";
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
  Blocks,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

// 根据 cat 属性获取对应的图标
const getIconByCat = (cat?: string, direction?: string, icon?: string) => {
  if (icon) {
    // 将字符串转换为首字母大写的驼峰命名
    const formattedName = icon.charAt(0).toUpperCase() + icon.slice(1);

    // 查找图标组件，使用 keyof typeof 约束类型
    const IconComponent =
      LucideIcons[formattedName as keyof typeof LucideIcons];

    // 检查是否为有效的 React 组件
    if (IconComponent !== null) {
      // 类型断言为有效的 React 组件
      const ValidIconComponent = IconComponent as React.ComponentType<{
        size?: number;
      }>;

      return <ValidIconComponent size={16} />;
    } else {
      console.warn(`Icon "${icon}" not found or is not a valid component`);
      return <Blocks size={16} />;
    }
  }
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
  shape?: "list" | "object";
  bind?: string;
  direction?: string;
  icon?: string;
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
  icon,
}) {
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

  const getIcon = getIconByCat(cat, direction || attrs?.direction, icon);

  if (children) {
    // 如果有 children，保持原有的 div 形式（用于 ToolPanel 中的标签显示）
    return (
      <div ref={drag as any} style={{ opacity }}>
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
        style={{
          opacity,
          cursor: "move",
        }}
      >
        {getIcon}
      </ActionIcon>
    </Tooltip>
  );
});
