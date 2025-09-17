import React from "react";

export interface SelectedItemInfo {
  item: any;
  position: "header" | "body" | "footer" | null;
  exists: boolean;
}

export function useSelectedItemInfo(
  currentSelectedId?: string,
  currentPageHeaderContent?: Map<string, any>,
  currentPageBodyContent?: Map<string, any>,
  currentPageFooterContent?: Map<string, any>,
): SelectedItemInfo {
  // 缓存选中项信息，避免重复查找
  const selectedItemInfo = React.useMemo(() => {
    if (
      !currentSelectedId ||
      !currentPageHeaderContent ||
      !currentPageBodyContent ||
      !currentPageFooterContent
    ) {
      return { item: null, position: null, exists: false };
    }

    // 按优先级查找：header -> body -> footer
    let item = currentPageHeaderContent.get(currentSelectedId);
    let position: "header" | "body" | "footer" | null = "header";

    if (!item) {
      item = currentPageBodyContent.get(currentSelectedId);
      position = "body";
    }

    if (!item) {
      item = currentPageFooterContent.get(currentSelectedId);
      position = "footer";
    }

    if (!item) {
      position = null;
    }

    return {
      item,
      position,
      exists: !!item,
    };
  }, [
    currentSelectedId,
    currentPageHeaderContent,
    currentPageBodyContent,
    currentPageFooterContent,
  ]);

  return selectedItemInfo;
}
