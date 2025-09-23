import React, { useState } from "react";
import { postAxios } from "../utils/axios";
import { ContentsStoreContext } from "../store/store";
import { ContentData } from "@xxs3315/mbl-typings";
import { TaskResponse, TaskType } from "../types/task";
import { useTaskStorage } from "./use-task-storage";

interface UsePreviewProps {
  baseUrl?: string;
  pdfGeneratePath?: string;
}

export function usePreview({ baseUrl, pdfGeneratePath }: UsePreviewProps = {}) {
  // 获取 store 实例
  const store = React.useContext(ContentsStoreContext);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // 使用任务存储 hook
  const { saveTask } = useTaskStorage();

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
      const response = (await postAxios({
        url,
        data: {
          data: JSON.stringify(targetContents),
          type: "single",
        },
      })) as TaskResponse;

      // 处理响应并保存任务
      if (response.success) {
        // 适配不同的响应格式
        const taskData = response.data || response.task;
        if (taskData) {
          saveTask({
            taskId: taskData.taskId,
            status: taskData.status,
            type: TaskType.SINGLE,
            createdAt: Date.now(),
            queuePosition:
              "queuePosition" in taskData ? taskData.queuePosition : null,
            message: response.message || "任务已创建",
          });
          // console.log("预览任务已创建:", taskData.taskId);
        }
      }
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
      const response = (await postAxios({
        url,
        data: {
          data: JSON.stringify(targetContents),
          type: "batch",
        },
      })) as TaskResponse;

      // 处理响应并保存任务
      if (response.success) {
        // 适配不同的响应格式
        const taskData = response.data || response.task;
        if (taskData) {
          saveTask({
            taskId: taskData.taskId,
            status: taskData.status,
            type: TaskType.BATCH,
            createdAt: Date.now(),
            queuePosition:
              "queuePosition" in taskData ? taskData.queuePosition : null,
            message: response.message || "任务已创建",
          });
          // console.log("批量预览任务已创建:", taskData.taskId);
        }
      }
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
