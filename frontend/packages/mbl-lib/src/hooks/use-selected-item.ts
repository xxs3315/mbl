import { useMemo } from "react";
import { useContentsStoreContext } from "../store/store";
import { useCurrentSelectedId } from "@xxs3315/mbl-providers";

export interface SelectedItemInfo {
  item: any;
  position: "header" | "body" | "footer" | null;
  exists: boolean;
}

/**
 * 优化的选中项查找hook，避免重复的Map查找操作
 */
export function useSelectedItem(): SelectedItemInfo {
  const { currentSelectedId } = useCurrentSelectedId();

  // 使用细粒度订阅，只订阅需要的 content maps
  const currentPageHeaderContent = useContentsStoreContext(
    (s) => s.currentPageHeaderContent,
  );
  const currentPageBodyContent = useContentsStoreContext(
    (s) => s.currentPageBodyContent,
  );
  const currentPageFooterContent = useContentsStoreContext(
    (s) => s.currentPageFooterContent,
  );

  return useMemo(() => {
    if (!currentSelectedId) {
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
}

/**
 * 获取选中项的类型
 */
export function useSelectedItemType(): string | null {
  const { item } = useSelectedItem();
  return item?.cat || null;
}
