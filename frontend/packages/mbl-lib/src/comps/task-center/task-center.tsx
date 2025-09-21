import React, { useState, useEffect } from "react";
import { css } from "../../styled-system/css";
import {
  Badge,
  Button,
  Group,
  Text,
  Stack,
  ActionIcon,
  Tooltip,
  Divider,
  Alert,
  Title,
} from "@mantine/core";
import { MacScrollbar } from "mac-scrollbar";
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  Trash,
  RefreshCw,
  FileText,
  Files,
  Download,
  AlertCircle,
} from "lucide-react";
import { StoredTask, TaskStatus, TaskType } from "../../types/task";
import { useTaskStorage } from "../../hooks/use-task-storage";
import { useTaskPolling } from "../../hooks/use-task-polling";

interface TaskCenterProps {
  baseUrl?: string;
  taskStatusPath?: string; // 任务状态查询接口路径
  pdfDownloadPath?: string; // PDF下载接口路径
}

export const TaskCenter: React.FC<TaskCenterProps> = ({
  baseUrl,
  taskStatusPath = "/api/queue/status",
  pdfDownloadPath = "/api/pdf/download",
}) => {
  const [tasks, setTasks] = useState<StoredTask[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [refreshing, setRefreshing] = useState(false);

  // 使用任务存储 hook
  const {
    getStoredTasks,
    removeTask,
    clearAllTasks,
    getActiveTasks,
    getCompletedTasks,
  } = useTaskStorage();

  // 使用任务轮询hook
  const { refreshTasks, isPolling, startPolling } = useTaskPolling({
    baseUrl,
    taskStatusPath,
    enabled: true,
    pollingInterval: 5000, // 5秒轮询一次
  });

  // 加载任务数据
  const loadTasks = () => {
    setTasks(getStoredTasks());
  };

  // 初始化加载任务
  useEffect(() => {
    loadTasks();
  }, []);

  // 监听任务数据变化，自动刷新显示
  useEffect(() => {
    const handleStorageChange = () => {
      loadTasks();
    };

    // 监听localStorage变化
    window.addEventListener("storage", handleStorageChange);

    // 定期刷新任务列表（用于轮询更新）
    const refreshInterval = setInterval(loadTasks, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(refreshInterval);
    };
  }, []);

  // 监听任务变化，当有进行中的任务时启动轮询
  useEffect(() => {
    const activeTasks = tasks.filter(
      (task) =>
        task.status === TaskStatus.PENDING ||
        task.status === "PENDING" ||
        task.status === TaskStatus.PROCESSING ||
        task.status === "PROCESSING",
    );

    if (activeTasks.length > 0 && !isPolling) {
      console.log("任务中心检测到进行中的任务，启动轮询", activeTasks.length);
      startPolling();
    }
  }, [tasks, isPolling, startPolling]);

  // 获取状态图标
  const getStatusIcon = (status: TaskStatus | undefined | string) => {
    if (!status || typeof status !== "string") return <Clock size={16} />;

    switch (status) {
      case TaskStatus.PENDING:
      case "PENDING":
        return <Clock size={14} color="#f59e0b" />;
      case TaskStatus.PROCESSING:
      case "PROCESSING":
        return (
          <Loader
            size={14}
            color="#3b82f6"
            className={css({ animation: "spin" })}
          />
        );
      case TaskStatus.COMPLETED:
      case "COMPLETED":
        return <CheckCircle size={14} color="#10b981" />;
      case TaskStatus.FAILED:
      case "FAILED":
        return <XCircle size={14} color="#ef4444" />;
      default:
        return <Clock size={14} />;
    }
  };

  // 获取状态文本
  const getStatusText = (status: TaskStatus | undefined | string) => {
    if (!status || typeof status !== "string") return "未知";

    switch (status) {
      case TaskStatus.PENDING:
      case "PENDING":
        return "等待中";
      case TaskStatus.PROCESSING:
      case "PROCESSING":
        return "处理中";
      case TaskStatus.COMPLETED:
      case "COMPLETED":
        return "已完成";
      case TaskStatus.FAILED:
      case "FAILED":
        return "失败";
      default:
        return "未知";
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: TaskStatus | undefined | string) => {
    // 确保返回有效的颜色字符串
    if (!status || typeof status !== "string") {
      console.warn("getStatusColor received invalid status:", status);
      return "gray";
    }

    switch (status) {
      case TaskStatus.PENDING:
      case "PENDING":
        return "yellow";
      case TaskStatus.PROCESSING:
      case "PROCESSING":
        return "blue";
      case TaskStatus.COMPLETED:
      case "COMPLETED":
        return "green";
      case TaskStatus.FAILED:
      case "FAILED":
        return "red";
      default:
        console.warn("getStatusColor received unknown status:", status);
        return "gray";
    }
  };

  // 获取任务类型图标
  const getTaskTypeIcon = (type: TaskType | undefined | string) => {
    if (!type || typeof type !== "string") return <FileText size={14} />;
    return type === TaskType.SINGLE || type === "single" ? (
      <FileText size={14} />
    ) : (
      <Files size={14} />
    );
  };

  // 获取任务类型文本
  const getTaskTypeText = (type: TaskType | undefined | string) => {
    if (!type || typeof type !== "string") return "未知类型";
    return type === TaskType.SINGLE || type === "single"
      ? "单页预览"
      : "批量预览";
  };

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) {
      // 1分钟内
      return "刚刚";
    } else if (diff < 3600000) {
      // 1小时内
      return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) {
      // 1天内
      return `${Math.floor(diff / 3600000)}小时前`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // 删除任务
  const handleDeleteTask = (taskId: string) => {
    removeTask(taskId);
    loadTasks();
  };

  // 清空已完成任务
  const handleClearCompleted = () => {
    const completedTasks = getCompletedTasks();
    completedTasks.forEach((task) => removeTask(task.taskId));
    loadTasks();
  };

  // 刷新任务状态
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshTasks();
      loadTasks(); // 刷新本地显示
    } catch (error) {
      console.error("刷新任务状态失败:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // 下载PDF
  const handleDownloadPDF = (taskId: string) => {
    if (!baseUrl || !pdfDownloadPath) {
      console.error("baseUrl或pdfDownloadPath未配置");
      return;
    }

    const downloadUrl = `${baseUrl}${pdfDownloadPath}/${taskId}`;

    // 创建下载链接
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${taskId}.pdf`;
    link.style.display = "none";

    // 添加到DOM并触发下载
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
  };

  // 过滤任务
  const activeTasks = tasks.filter(
    (task) =>
      task.status === TaskStatus.PENDING ||
      task.status === "PENDING" ||
      task.status === TaskStatus.PROCESSING ||
      task.status === "PROCESSING",
  );
  const completedTasks = tasks.filter(
    (task) =>
      task.status === TaskStatus.COMPLETED ||
      task.status === "COMPLETED" ||
      task.status === TaskStatus.FAILED ||
      task.status === "FAILED",
  );

  const currentTasks = activeTab === "active" ? activeTasks : completedTasks;

  return (
    <div
      className={css({
        height: "100%",
        display: "flex",
        flexDirection: "column",
      })}
    >
      {/* 头部操作区 */}
      <div
        className={css({
          paddingBottom: "8px",
        })}
      >
        <Group justify="space-between" align="center" mb="xs">
          <Title order={4} size="sm">
            任务列表
          </Title>
          <Group gap="xs">
            <Tooltip label={isPolling ? "正在自动刷新" : "手动刷新"}>
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={handleRefresh}
                loading={refreshing}
                color={isPolling ? "blue" : "gray"}
              >
                <RefreshCw size={12} />
              </ActionIcon>
            </Tooltip>
            {activeTab === "completed" && completedTasks.length > 0 && (
              <Tooltip label="清空已完成">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={handleClearCompleted}
                  color="red"
                >
                  <Trash size={12} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Group>

        {/* Tab切换 */}
        <Group gap="xs" align="center" justify={"center"}>
          <Button
            variant={activeTab === "active" ? "filled" : "subtle"}
            size="xs"
            onClick={() => setActiveTab("active")}
          >
            进行中 ({activeTasks.length})
          </Button>
          <Button
            variant={activeTab === "completed" ? "filled" : "subtle"}
            size="xs"
            onClick={() => setActiveTab("completed")}
          >
            已完成 ({completedTasks.length})
          </Button>
        </Group>
      </div>

      {/* 任务列表 */}
      <MacScrollbar
        className={css({
          flex: 1,
          padding: "0",
          height: "100%",
          overflow: "auto",
        })}
      >
        {currentTasks.length === 0 ? (
          <Alert
            icon={<AlertCircle size={12} />}
            title="暂无任务"
            variant="light"
            styles={{
              root: { padding: "8px" },
              title: { fontSize: "12px" },
              message: { fontSize: "12px" },
              icon: { alignItems: "flex-start" },
            }}
          >
            {activeTab === "active" ? "暂无进行中的任务" : "暂无已完成的任务"}
          </Alert>
        ) : (
          <Stack gap="xs">
            {currentTasks.map((task) => {
              // 安全检查，确保任务对象有效
              if (!task || !task.taskId) {
                return null;
              }

              return (
                <div
                  key={task.taskId}
                  className={css({
                    padding: "8px",
                    border: "1px solid",
                    borderColor: "gray.200",
                    borderRadius: "8px",
                    backgroundColor: "white",
                  })}
                >
                  <Group justify="space-between" mb="0">
                    <Group gap="xs">
                      {getTaskTypeIcon(task.type)}
                      <Text size="xs" fw={500}>
                        {getTaskTypeText(task.type)}
                      </Text>
                    </Group>
                    <Group gap="xs">
                      {getStatusIcon(task.status)}
                      <Badge
                        size="xs"
                        color={getStatusColor(task.status) || "gray"}
                        variant="light"
                      >
                        {getStatusText(task.status)}
                      </Badge>
                    </Group>
                  </Group>

                  <Text size="xs" mb="xs">
                    任务ID: {task.taskId}
                  </Text>

                  {task.queuePosition !== null &&
                    task.queuePosition !== undefined && (
                      <Text size="xs" mb="xs">
                        队列位置: {task.queuePosition}
                      </Text>
                    )}

                  <Group justify="space-between" align="center">
                    <Text size="xs">{formatTime(task.createdAt)}</Text>
                    <Group gap="xs">
                      {/* 只有已完成的任务才显示下载按钮 */}
                      {(task.status === TaskStatus.COMPLETED ||
                        task.status === "COMPLETED") && (
                        <Tooltip label="下载PDF">
                          <ActionIcon
                            variant="subtle"
                            size="sm"
                            color="blue"
                            onClick={() => handleDownloadPDF(task.taskId)}
                          >
                            <Download size={12} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                      <Tooltip label="删除任务">
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          color="red"
                          onClick={() => handleDeleteTask(task.taskId)}
                        >
                          <Trash size={12} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Group>
                </div>
              );
            })}
          </Stack>
        )}
      </MacScrollbar>
    </div>
  );
};
