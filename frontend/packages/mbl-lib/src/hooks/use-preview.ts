import React, { useState } from "react";
import { postAxios } from "../utils/axios";
import { ContentsStoreContext } from "../store/store";
import { ContentData } from "@xxs3315/mbl-typings";

interface UsePreviewProps {
  baseUrl?: string;
  pdfGeneratePath?: string;
}

export function usePreview({ baseUrl, pdfGeneratePath }: UsePreviewProps = {}) {
  // 获取 store 实例
  const store = React.useContext(ContentsStoreContext);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const updatedContents = () => {
    if (!store) {
      return null;
    }
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

    return updatedContents;
  };

  const preview = async () => {
    if (!baseUrl || !pdfGeneratePath) {
      console.error("baseUrl or pdfGeneratePath is not provided");
      return;
    }

    const targetContents = updatedContents();

    if (!targetContents) {
      console.error("No contents to preview");
      return;
    }

    setIsPreviewing(true);
    try {
      const url = `${baseUrl}${pdfGeneratePath}`;
      await postAxios({
        url,
        data: {
          data: JSON.stringify(targetContents),
          type: "single",
        },
      });
    } catch (error) {
      console.error("Preview error:", error);
    } finally {
      setIsPreviewing(false);
    }
  };

  const previewAll = async () => {
    if (!baseUrl || !pdfGeneratePath) {
      console.error("baseUrl or pdfGeneratePath is not provided");
      return;
    }

    const targetContents = updatedContents();

    if (!targetContents) {
      console.error("No contents to preview");
      return;
    }

    setIsPreviewing(true);
    try {
      const url = `${baseUrl}${pdfGeneratePath}`;
      await postAxios({
        url,
        data: {
          data: JSON.stringify(targetContents),
          type: "batch",
        },
      });
    } catch (error) {
      console.error("Preview all error:", error);
    } finally {
      setIsPreviewing(false);
    }
  };

  return {
    isPreviewing,
    preview,
    previewAll,
  };
}
