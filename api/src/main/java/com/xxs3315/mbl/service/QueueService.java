package com.xxs3315.mbl.service;

import com.xxs3315.mbl.entity.QueueItem;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/** 通用队列服务接口 定义队列操作的基本方法，支持多种数据库实现 */
public interface QueueService {

  /**
   * 添加任务到队列
   *
   * @param taskType 任务类型
   * @param data 任务数据
   * @return 创建的任务项
   */
  QueueItem addToQueue(String taskType, String data);

  /**
   * 获取下一个待处理任务
   *
   * @return 任务项，如果没有则返回空
   */
  Optional<QueueItem> getNextTask();

  /**
   * 完成任务
   *
   * @param taskId 任务ID
   * @param result 任务结果
   * @return 是否成功完成
   */
  boolean completeTask(String taskId, String result);

  /**
   * 任务失败
   *
   * @param taskId 任务ID
   * @param errorMessage 错误信息
   * @return 是否成功标记为失败
   */
  boolean failTask(String taskId, String errorMessage);

  /**
   * 获取任务状态
   *
   * @param taskId 任务ID
   * @return 任务项
   */
  Optional<QueueItem> getTaskStatus(String taskId);

  /**
   * 获取队列统计信息
   *
   * @return 统计信息
   */
  Map<String, Object> getQueueStats();

  /**
   * 获取待处理任务列表
   *
   * @return 待处理任务列表
   */
  List<QueueItem> getPendingTasks();

  /**
   * 获取处理中任务列表
   *
   * @return 处理中任务列表
   */
  List<QueueItem> getProcessingTasks();

  /**
   * 获取已完成任务列表
   *
   * @return 已完成任务列表
   */
  List<QueueItem> getCompletedTasks();

  /** 清空队列 */
  void clearQueue();

  /**
   * 取消任务
   *
   * @param taskId 任务ID
   * @return 是否成功取消
   */
  boolean cancelTask(String taskId);

  /**
   * 重置处理中任务为待处理状态
   *
   * @param taskId 任务ID
   * @return 是否成功重置
   */
  boolean resetProcessingTaskToPending(String taskId);

  /**
   * 获取数据库路径信息
   *
   * @return 数据库路径描述
   */
  String getDatabasePath();
}
