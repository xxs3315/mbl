import type { CSSProperties, FC, ReactNode } from "react";
import { memo } from "react";
import { useDrop } from "react-dnd";
import React from "react";
import { css } from "../styled-system/css";
import { useThemeColors } from "../utils/theme-utils";

const style: CSSProperties = {
  padding: "0",
  width: "100%",
  height: "100%",
  minHeight: "16px",
};

export interface DustbinProps {
  identifier: string;
  accept: string[];
  lastDroppedItem?: any;
  onDrop: (item: any) => void;
  children?: ReactNode;
  greedy?: boolean;
  moreStyle?: any;
}

export const DndTarget: FC<DustbinProps> = memo(function Dustbin({
  identifier,
  accept,
  onDrop,
  children,
  greedy,
  moreStyle,
}) {
  const colors = useThemeColors();

  const [{ isOver, isOverCurrent }, drop] = useDrop({
    accept,
    drop(item: unknown, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop && !greedy) {
        return;
      }
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  let backgroundColor = `${colors.primaryLight}10`;
  let boxShadow = "none";

  if (isOverCurrent || (isOver && greedy)) {
    backgroundColor = `${colors.primary}80`;
    boxShadow = `0 0 5px 2px ${colors.primary}`;
  }

  return (
    <div
      ref={drop as any}
      style={{ ...style, backgroundColor, boxShadow, ...moreStyle }}
      data-id="dndTarget"
      className={css({
        flex: "1",
      })}
      id={`dnd-target-${identifier}`}
    >
      {children}
    </div>
  );
});
