import { StoredTask, TaskStatus, TaskType } from "../types/task";

const TASK_STORAGE_KEY_BASE = "mbl-tasks";

// 生成带tableId后缀的存储键
function getTaskStorageKey(tableId: string): string {
  return `${TASK_STORAGE_KEY_BASE}-${tableId}`;
}

/**
 * 验证任务数据是否有效
 */
function isValidTask(task: any): task is StoredTask {
  if (!task || typeof task !== "object") return false;

  // 检查必需字段
  if (typeof task.taskId !== "string" || task.taskId.length === 0) return false;
  if (typeof task.createdAt !== "number") return false;

  // 检查状态字段（可以是枚举值或字符串）
  if (typeof task.status !== "string") return false;
  const validStatuses = ["PENDING", "PROCESSING", "COMPLETED", "FAILED"];
  if (!validStatuses.includes(task.status)) return false;

  // 检查类型字段（可以是枚举值或字符串）
  if (typeof task.type !== "string") return false;
  const validTypes = ["single", "batch"];
  if (!validTypes.includes(task.type)) return false;

  return true;
}

/**
 * 获取所有存储的任务
 */
export function getStoredTasks(tableId: string): StoredTask[] {
  try {
    const storageKey = getTaskStorageKey(tableId);
    const stored = localStorage.getItem(storageKey);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    // 过滤掉无效的任务数据
    return parsed.filter(isValidTask);
  } catch (error) {
    console.error("获取任务数据失败:", error);
    return [];
  }
}

/**
 * 保存任务到localStorage
 */
export function saveTask(task: StoredTask, tableId: string): void {
  try {
    const tasks = getStoredTasks(tableId);
    const existingIndex = tasks.findIndex((t) => t.taskId === task.taskId);

    if (existingIndex >= 0) {
      // 更新现有任务
      tasks[existingIndex] = task;
    } else {
      // 添加新任务
      tasks.push(task);
    }

    // 按创建时间倒序排列（最新的在前）
    tasks.sort((a, b) => b.createdAt - a.createdAt);

    const storageKey = getTaskStorageKey(tableId);
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  } catch (error) {
    console.error("保存任务失败:", error);
  }
}

/**
 * 更新任务状态
 */
export function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  tableId: string,
  queuePosition?: number | null,
): void {
  try {
    const tasks = getStoredTasks(tableId);
    const taskIndex = tasks.findIndex((t) => t.taskId === taskId);

    if (taskIndex >= 0) {
      tasks[taskIndex].status = status;
      if (queuePosition !== undefined) {
        tasks[taskIndex].queuePosition = queuePosition;
      }
      const storageKey = getTaskStorageKey(tableId);
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    }
  } catch (error) {
    console.error("更新任务状态失败:", error);
  }
}

/**
 * 删除任务
 */
export function removeTask(taskId: string, tableId: string): void {
  try {
    const tasks = getStoredTasks(tableId);
    const filteredTasks = tasks.filter((t) => t.taskId !== taskId);
    const storageKey = getTaskStorageKey(tableId);
    localStorage.setItem(storageKey, JSON.stringify(filteredTasks));
  } catch (error) {
    console.error("删除任务失败:", error);
  }
}

/**
 * 清空所有任务
 */
export function clearAllTasks(tableId: string): void {
  try {
    const storageKey = getTaskStorageKey(tableId);
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error("清空任务失败:", error);
  }
}

/**
 * 获取进行中的任务（PENDING 或 PROCESSING）
 */
export function getActiveTasks(tableId: string): StoredTask[] {
  const tasks = getStoredTasks(tableId);
  return tasks.filter(
    (task) =>
      task.status === TaskStatus.PENDING ||
      task.status === TaskStatus.PROCESSING,
  );
}

/**
 * 获取已完成的任务（COMPLETED 或 FAILED）
 */
export function getCompletedTasks(tableId: string): StoredTask[] {
  const tasks = getStoredTasks(tableId);
  return tasks.filter(
    (task) =>
      task.status === TaskStatus.COMPLETED || task.status === TaskStatus.FAILED,
  );
}
