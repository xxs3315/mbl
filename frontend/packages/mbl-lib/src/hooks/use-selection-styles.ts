import { useMemo } from "react";
import { useThemeColors } from "../utils/theme-utils";

/**
 * 优化的选中状态样式计算hook
 */
export function useSelectionStyles() {
  const colors = useThemeColors();

  return useMemo(
    () => ({
      getSelectedBoxShadow: (isSelected: boolean) =>
        isSelected ? `0 0 0 1px ${colors.primary}` : "none",
      getPageBoxShadow: (isSelected: boolean) =>
        isSelected
          ? `0 0 6px ${colors.primary}`
          : "0 0 12px rgba(0, 0, 0, 0.2)",
    }),
    [colors.primary],
  );
}
