package com.xxs3315.mbl.pdf.service;

import java.util.Map;

/** 通用队列处理器接口 定义队列处理器的基本方法，支持多种数据库实现 */
public interface QueueProcessor {

  /** 启动处理器 */
  void start();

  /** 停止处理器 */
  void stop();

  /**
   * 设置最大并发任务数
   *
   * @param maxTasks 最大并发任务数
   */
  void setMaxConcurrentTasks(int maxTasks);

  /**
   * 获取处理器统计信息
   *
   * @return 统计信息
   */
  Map<String, Object> getProcessorStats();

  /** 增加已处理任务计数 */
  void incrementProcessedTasks();
}
