package com.xxs3315.mbl.pdf.service;

import com.xxs3315.mbl.pdf.entity.QueueItem;
import jakarta.annotation.PostConstruct;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Profile("postgresql")
public class PostgreSQLQueueProcessor implements QueueProcessor {

  private static final Logger logger = LoggerFactory.getLogger(PostgreSQLQueueProcessor.class);
  private final AtomicBoolean isRunning = new AtomicBoolean(false);
  private final AtomicInteger currentProcessingTasks = new AtomicInteger(0);
  private final AtomicInteger maxConcurrentTasks = new AtomicInteger(3);
  private final AtomicInteger processedTasks = new AtomicInteger(0);
  @Autowired private QueueService queueService;
  @Autowired private AsyncTaskProcessor asyncTaskProcessor;

  @PostConstruct
  public void init() {
    // 延迟启动，等待数据库表创建完成
    new Thread(
            () -> {
              try {
                // 等待数据库初始化完成
                Thread.sleep(2000);

                // 应用启动时检查并恢复任务状态
                recoverTasksOnStartup();

                // 应用启动时自动开启处理器
                start();
                logger.info("PostgreSQL队列处理器初始化完成，已自动启动");
              } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                logger.error("处理器初始化被中断", e);
              } catch (Exception e) {
                logger.error("处理器初始化失败", e);
              }
            })
        .start();
  }

  /** 应用启动时恢复任务状态 处理PROCESSING状态的任务，将其重置为PENDING状态以便重新处理 */
  private void recoverTasksOnStartup() {
    try {
      // 1. 处理PROCESSING状态的任务（应用重启时可能存在的未完成任务）
      var processingTasks = queueService.getProcessingTasks();
      if (!processingTasks.isEmpty()) {
        logger.warn("发现 {} 个PROCESSING状态的任务，应用重启时重置为PENDING状态", processingTasks.size());

        for (QueueItem task : processingTasks) {
          logger.info("重置PROCESSING任务为PENDING: {} - {}", task.getTaskId(), task.getTaskType());
          // 将PROCESSING状态的任务重置为PENDING状态
          boolean success = queueService.resetProcessingTaskToPending(task.getTaskId());
          if (!success) {
            logger.warn("重置任务失败，可能已被其他线程处理: {}", task.getTaskId());
          }
        }
      }

      // 2. 检查PENDING状态的任务
      var pendingTasks = queueService.getPendingTasks();
      if (!pendingTasks.isEmpty()) {
        logger.info("发现 {} 个PENDING状态的任务，准备重新处理", pendingTasks.size());

        for (QueueItem task : pendingTasks) {
          logger.info("恢复PENDING任务: {} - {}", task.getTaskId(), task.getTaskType());
        }

        // 注意：这里不需要手动处理，因为处理器启动后会自动处理PENDING任务
        // 我们只需要确保任务状态正确即可
      } else {
        logger.info("没有发现PENDING状态的任务");
      }
    } catch (Exception e) {
      logger.error("恢复任务状态时发生错误", e);
    }
  }

  @Scheduled(fixedRate = 1000) // 每秒检查一次
  public void processQueue() {
    if (!isRunning.get()) {
      return;
    }

    if (currentProcessingTasks.get() >= maxConcurrentTasks.get()) {
      return;
    }

    // 添加重试机制，处理并发冲突
    int maxRetries = 3;
    for (int retry = 0; retry < maxRetries; retry++) {
      var taskOpt = queueService.getNextTask();
      if (taskOpt.isPresent()) {
        QueueItem task = taskOpt.get();
        currentProcessingTasks.incrementAndGet();
        logger.info("开始处理PostgreSQL队列任务: {} - {}", task.getTaskId(), task.getTaskType());

        asyncTaskProcessor.processTaskAsync(task, currentProcessingTasks, maxConcurrentTasks);
        break; // 成功获取任务，退出重试循环
      } else if (retry < maxRetries - 1) {
        // 如果没有获取到任务且还有重试机会，使用指数退避策略
        try {
          long backoffTime = (long) (50 * Math.pow(2, retry)); // 50ms, 100ms, 200ms
          Thread.sleep(backoffTime);
        } catch (InterruptedException e) {
          Thread.currentThread().interrupt();
          break;
        }
      }
    }
  }

  public void start() {
    if (isRunning.compareAndSet(false, true)) {
      logger.info("PostgreSQL队列处理器已启动");
    }
  }

  public void stop() {
    if (isRunning.compareAndSet(true, false)) {
      logger.info("PostgreSQL队列处理器已停止");
    }
  }

  public void setMaxConcurrentTasks(int maxTasks) {
    maxConcurrentTasks.set(maxTasks);
    logger.info("PostgreSQL队列处理器最大并发任务数设置为: {}", maxTasks);
  }

  public Map<String, Object> getProcessorStats() {
    return Map.of(
        "isRunning", isRunning.get(),
        "currentProcessingTasks", currentProcessingTasks.get(),
        "maxConcurrentTasks", maxConcurrentTasks.get(),
        "processedTasks", processedTasks.get());
  }

  public void incrementProcessedTasks() {
    processedTasks.incrementAndGet();
  }
}
