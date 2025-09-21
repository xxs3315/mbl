import { StoredTask, TaskStatus, TaskType } from "../types/task";

const TASK_STORAGE_KEY = "mbl-tasks";

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
export function getStoredTasks(): StoredTask[] {
  try {
    const stored = localStorage.getItem(TASK_STORAGE_KEY);
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
export function saveTask(task: StoredTask): void {
  try {
    const tasks = getStoredTasks();
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

    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
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
  queuePosition?: number | null,
): void {
  try {
    const tasks = getStoredTasks();
    const taskIndex = tasks.findIndex((t) => t.taskId === taskId);

    if (taskIndex >= 0) {
      tasks[taskIndex].status = status;
      if (queuePosition !== undefined) {
        tasks[taskIndex].queuePosition = queuePosition;
      }
      localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
    }
  } catch (error) {
    console.error("更新任务状态失败:", error);
  }
}

/**
 * 删除任务
 */
export function removeTask(taskId: string): void {
  try {
    const tasks = getStoredTasks();
    const filteredTasks = tasks.filter((t) => t.taskId !== taskId);
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(filteredTasks));
  } catch (error) {
    console.error("删除任务失败:", error);
  }
}

/**
 * 清空所有任务
 */
export function clearAllTasks(): void {
  try {
    localStorage.removeItem(TASK_STORAGE_KEY);
  } catch (error) {
    console.error("清空任务失败:", error);
  }
}

/**
 * 获取进行中的任务（PENDING 或 PROCESSING）
 */
export function getActiveTasks(): StoredTask[] {
  const tasks = getStoredTasks();
  return tasks.filter(
    (task) =>
      task.status === TaskStatus.PENDING ||
      task.status === TaskStatus.PROCESSING,
  );
}

/**
 * 获取已完成的任务（COMPLETED 或 FAILED）
 */
export function getCompletedTasks(): StoredTask[] {
  const tasks = getStoredTasks();
  return tasks.filter(
    (task) =>
      task.status === TaskStatus.COMPLETED || task.status === TaskStatus.FAILED,
  );
}
