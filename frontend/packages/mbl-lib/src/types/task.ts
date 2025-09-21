// 任务状态枚举
export enum TaskStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

// 任务类型枚举
export enum TaskType {
  SINGLE = "single",
  BATCH = "batch",
}

// 任务数据接口
export interface TaskData {
  taskId: string;
  status: TaskStatus;
  queuePosition?: number | null;
}

// 任务响应接口 - 支持两种格式
export interface TaskResponse {
  success: boolean;
  message?: string;
  // 创建任务时的响应格式
  data?: TaskData;
  // 查询任务状态时的响应格式
  task?: {
    id: number;
    taskId: string;
    taskType: string;
    data: string;
    status: TaskStatus;
    createTime: string;
    startTime?: string;
    endTime?: string;
    result?: string;
    errorMessage?: string | null;
    version: number;
  };
}

// 本地存储的任务接口
export interface StoredTask {
  taskId: string;
  status: TaskStatus | string; // 支持枚举和字符串两种格式
  type: TaskType | string; // 支持枚举和字符串两种格式
  createdAt: number; // 时间戳
  queuePosition?: number | null;
  message?: string;
}

// 任务中心状态接口
export interface TaskCenterState {
  tasks: StoredTask[];
  activeTaskId: string | null;
}
