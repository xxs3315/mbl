import React from "react";
import { ContentData } from "@xxs3315/mbl-typings";
import { ContentsStoreContext } from "../store/store";

export function useContentChange(
  onContentChange?: (updatedContents: ContentData) => void,
) {
  // 获取 store 实例
  const store = React.useContext(ContentsStoreContext);

  // 监听 store 变化并调用 onContentChange
  React.useEffect(() => {
    if (!onContentChange || !store) return;

    const unsubscribe = store.subscribe(() => {
      const currentState = store.getState();

      // 将 Map 格式的数据转换回数组格式
      const updatedContents: ContentData = {
        config: currentState.config,
        pages: currentState.pages.map((page: any) => ({
          ...page,
          pageHeaderContent: Array.from(page.pageHeaderContent.entries()),
          pageBodyContent: Array.from(page.pageBodyContent.entries()),
          pageFooterContent: Array.from(page.pageFooterContent.entries()),
        })),
        currentPageIndex: currentState.currentPageIndex,
      };

      onContentChange(updatedContents);
    });

    return unsubscribe;
  }, [onContentChange, store]);
}
