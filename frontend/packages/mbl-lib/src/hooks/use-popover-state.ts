import { useState, useCallback } from "react";

export function usePopoverState() {
  // 为每个popover创建独立的状态管理
  const [popoverStates, setPopoverStates] = useState<Record<string, boolean>>(
    {},
  );

  // 切换特定popover的状态
  const togglePopover = useCallback((itemId: string) => {
    setPopoverStates((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }, []);

  // 检查特定popover是否打开
  const isPopoverOpen = useCallback(
    (itemId: string) => {
      return popoverStates[itemId] || false;
    },
    [popoverStates],
  );

  // 关闭所有popover
  const closePopover = useCallback(() => {
    setPopoverStates({});
  }, []);

  return {
    togglePopover,
    isPopoverOpen,
    closePopover,
  };
}
