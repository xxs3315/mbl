import { useCallback } from "react";
import { useTableId } from "@xxs3315/mbl-providers";
import {
  getStoredTasks as getStoredTasksBase,
  saveTask as saveTaskBase,
  updateTaskStatus as updateTaskStatusBase,
  removeTask as removeTaskBase,
  clearAllTasks as clearAllTasksBase,
  getActiveTasks as getActiveTasksBase,
  getCompletedTasks as getCompletedTasksBase,
} from "../utils/task-storage";
import { StoredTask, TaskStatus } from "../types/task";

/**
 * 使用 tableId 的任务存储 hook
 */
export function useTaskStorage() {
  const { tableId } = useTableId();

  const getStoredTasks = useCallback((): StoredTask[] => {
    return getStoredTasksBase(tableId);
  }, [tableId]);

  const saveTask = useCallback(
    (task: StoredTask): void => {
      return saveTaskBase(task, tableId);
    },
    [tableId],
  );

  const updateTaskStatus = useCallback(
    (
      taskId: string,
      status: TaskStatus,
      queuePosition?: number | null,
    ): void => {
      return updateTaskStatusBase(taskId, status, tableId, queuePosition);
    },
    [tableId],
  );

  const removeTask = useCallback(
    (taskId: string): void => {
      return removeTaskBase(taskId, tableId);
    },
    [tableId],
  );

  const clearAllTasks = useCallback((): void => {
    return clearAllTasksBase(tableId);
  }, [tableId]);

  const getActiveTasks = useCallback((): StoredTask[] => {
    return getActiveTasksBase(tableId);
  }, [tableId]);

  const getCompletedTasks = useCallback((): StoredTask[] => {
    return getCompletedTasksBase(tableId);
  }, [tableId]);

  return {
    getStoredTasks,
    saveTask,
    updateTaskStatus,
    removeTask,
    clearAllTasks,
    getActiveTasks,
    getCompletedTasks,
  };
}
