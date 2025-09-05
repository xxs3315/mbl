import type * as React from "react";

import type { Direction, ItemIdentifier, NodeMeta } from "../shared";

export const getPlaceholderElementStyle = <T extends ItemIdentifier>(
  draggingNodeMeta: NodeMeta<T> | undefined,
  itemSpacing: number,
  direction: Direction,
): React.CSSProperties => {
  if (draggingNodeMeta === undefined) return {};

  const { width, height } = draggingNodeMeta;

  return {
    width: direction === "horizontal" ? width - itemSpacing : width,
    height: direction === "vertical" ? height - itemSpacing : height,
  };
};

export const getStackedGroupElementStyle = getPlaceholderElementStyle;
