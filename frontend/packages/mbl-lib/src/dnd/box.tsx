import { Text, Tooltip } from "@mantine/core";
import type { CSSProperties, FC, ReactNode } from "react";
import { memo } from "react";
import { useDrag } from "react-dnd";
import { useThemeColors } from "../utils/theme-utils";
import React from "react";

const getBoxStyle = (colors: any): CSSProperties => ({
  border: `1px dashed ${colors.primaryLight}`,
  backgroundColor: colors.background,
  padding: "2px",
  marginRight: "4px",
  marginBottom: "4px",
  cursor: "grab",
  borderRadius: "6px",
  transition: "all 0.2s ease",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  minHeight: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

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
}) {
  const colors = useThemeColors();
  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item: { id, name, type, cat, attrs, request, value, shape, bind },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [id, name, type, cat, attrs, request, value, shape, bind],
  );

  const boxStyle = getBoxStyle(colors);

  return (
    <div
      ref={drag as any}
      style={{ ...boxStyle, opacity }}
      data-testid="box"
      className={`${!children ? "aspect-square" : ""} hover:-translate-y-0.5 hover:border-primary hover:shadow-lg`}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.primary;
        e.currentTarget.style.boxShadow = `0 2px 6px ${colors.primaryLight}40`;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.primaryLight;
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {!children &&
        (bind ? (
          <Tooltip label={bind}>
            <Text
              size="xs"
              color={isDropped ? "dimmed" : colors.text}
              style={isDropped ? { textDecoration: "line-through" } : undefined}
            >
              {name}
            </Text>
          </Tooltip>
        ) : (
          <Text
            size="xs"
            color={isDropped ? "dimmed" : colors.text}
            style={isDropped ? { textDecoration: "line-through" } : undefined}
          >
            {name}
          </Text>
        ))}
      {children}
    </div>
  );
});
