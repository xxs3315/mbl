import { useEffect, useRef, useCallback } from "react";
import { getAxios } from "../utils/axios";
import { useTaskStorage } from "./use-task-storage";
import { TaskStatus, TaskResponse } from "../types/task";

interface UseTaskPollingProps {
  baseUrl?: string;
  taskStatusPath?: string;
  pollingInterval?: number; // 轮询间隔，默认5秒
  enabled?: boolean; // 是否启用轮询
}

export function useTaskPolling({
  baseUrl,
  taskStatusPath = "/api/queue/status",
  pollingInterval = 5000,
  enabled = true,
}: UseTaskPollingProps = {}) {
  const intervalRef = useRef<number | null>(null);
  const isPollingRef = useRef(false);

  // 使用任务存储 hook
  const { getActiveTasks, updateTaskStatus } = useTaskStorage();

  // 查询单个任务状态
  const checkTaskStatus = useCallback(
    async (taskId: string): Promise<boolean> => {
      if (!baseUrl) {
        console.warn("baseUrl未配置，无法查询任务状态");
        return false;
      }

      try {
        const url = `${baseUrl}${taskStatusPath}/${taskId}`;
        const response = (await getAxios({ url })) as TaskResponse;

        if (response.success && response.task) {
          updateTaskStatus(
            taskId,
            response.task.status,
            null, // 新API没有queuePosition字段
          );

          // 如果任务完成或失败，返回true表示可以停止轮询
          return (
            response.task.status === TaskStatus.COMPLETED ||
            response.task.status === TaskStatus.FAILED
          );
        }
      } catch (error) {
        console.error(`查询任务状态失败 (${taskId}):`, error);
      }

      return false;
    },
    [baseUrl, taskStatusPath],
  );

  // 轮询所有进行中的任务
  const pollActiveTasks = useCallback(async () => {
    if (isPollingRef.current) return;

    isPollingRef.current = true;

    try {
      const activeTasks = getActiveTasks();

      if (activeTasks.length === 0) {
        // 没有进行中的任务，停止轮询
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      // 并发查询所有任务状态
      const promises = activeTasks.map((task) => checkTaskStatus(task.taskId));
      const results = await Promise.allSettled(promises);

      // 检查是否还有需要轮询的任务
      const stillActiveTasks = getActiveTasks();
      if (stillActiveTasks.length === 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (error) {
      console.error("轮询任务状态时发生错误:", error);
    } finally {
      isPollingRef.current = false;
    }
  }, [checkTaskStatus]);

  // 开始轮询
  const startPolling = useCallback(() => {
    if (!enabled || !baseUrl) return;

    // 清除现有轮询
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 立即执行一次
    pollActiveTasks();

    // 设置定时轮询
    intervalRef.current = setInterval(pollActiveTasks, pollingInterval);
  }, [enabled, baseUrl, pollActiveTasks, pollingInterval]);

  // 停止轮询
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPollingRef.current = false;
  }, []);

  // 手动刷新任务状态
  const refreshTasks = useCallback(async () => {
    await pollActiveTasks();
  }, [pollActiveTasks]);

  // 组件挂载时开始轮询
  useEffect(() => {
    if (enabled && baseUrl) {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, baseUrl, startPolling, stopPolling]);

  // 当baseUrl或enabled变化时重新开始轮询
  useEffect(() => {
    if (enabled && baseUrl) {
      startPolling();
    } else {
      stopPolling();
    }
  }, [baseUrl, enabled, startPolling, stopPolling]);

  // 监听localStorage变化，当有新任务时自动开始轮询
  useEffect(() => {
    const handleStorageChange = () => {
      if (enabled && baseUrl) {
        const activeTasks = getActiveTasks();
        // 如果有进行中的任务且当前没有轮询，则开始轮询
        if (activeTasks.length > 0 && !intervalRef.current) {
          console.log("检测到新任务，开始轮询");
          startPolling();
        }
      }
    };

    // 监听localStorage变化
    window.addEventListener("storage", handleStorageChange);

    // 定期检查是否有新任务需要轮询
    const checkInterval = setInterval(() => {
      if (enabled && baseUrl) {
        const activeTasks = getActiveTasks();
        // 如果有进行中的任务且当前没有轮询，则开始轮询
        if (activeTasks.length > 0 && !intervalRef.current) {
          console.log("定期检查发现新任务，开始轮询");
          startPolling();
        }
      }
    }, 2000); // 每2秒检查一次

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(checkInterval);
    };
  }, [enabled, baseUrl, startPolling]);

  return {
    startPolling,
    stopPolling,
    refreshTasks,
    isPolling: intervalRef.current !== null,
  };
}
