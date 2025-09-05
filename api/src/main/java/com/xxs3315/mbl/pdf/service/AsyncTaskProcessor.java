package com.xxs3315.mbl.pdf.service;

import com.xxs3315.mbl.pdf.entity.QueueItem;
import java.util.concurrent.atomic.AtomicInteger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class AsyncTaskProcessor {

  private static final Logger logger = LoggerFactory.getLogger(AsyncTaskProcessor.class);
  private final AtomicInteger processedTasks = new AtomicInteger(0);
  private final AtomicInteger failedTasks = new AtomicInteger(0);
  @Autowired private QueueService queueService;

  @Async("taskExecutor")
  public void processTaskAsync(
      QueueItem task, AtomicInteger currentProcessingTasks, AtomicInteger maxConcurrentTasks) {
    String threadName = Thread.currentThread().getName();
    try {
      logger.info(
          "开始处理队列任务: {} - {}, 线程: {}, 预计处理时间: {}ms",
          task.getTaskId(),
          task.getTaskType(),
          threadName,
          getProcessingTime(task.getTaskType()));

      // 模拟不同任务类型的处理时间
      long processingTime = getProcessingTime(task.getTaskType());
      Thread.sleep(processingTime);

      // 模拟任务处理结果
      String result = simulateTaskProcessing(task);

      // 完成任务
      boolean success = queueService.completeTask(task.getTaskId(), result);
      if (success) {
        processedTasks.incrementAndGet();
        logger.info(
            "队列任务完成: {} - 结果: {}, 线程: {}, 当前并发数: {}/{}",
            task.getTaskId(),
            result,
            threadName,
            currentProcessingTasks.get(),
            maxConcurrentTasks.get());
      } else {
        failedTasks.incrementAndGet();
        logger.error("队列任务完成失败: {}, 线程: {}", task.getTaskId(), threadName);
      }

    } catch (Exception e) {
      logger.error("处理队列任务时发生错误: {}, 线程: {}", task.getTaskId(), threadName, e);
      queueService.failTask(task.getTaskId(), e.getMessage());
      failedTasks.incrementAndGet();
    } finally {
      int currentCount = currentProcessingTasks.decrementAndGet();
      logger.debug(
          "任务 {} 处理结束，线程: {}, 当前并发数: {}/{}",
          task.getTaskId(),
          threadName,
          currentCount,
          maxConcurrentTasks.get());
    }
  }

  private long getProcessingTime(String taskType) {
    // 添加一些随机性，模拟真实环境中的处理时间变化
    long baseTime;
    switch (taskType) {
      case "PDF_GENERATE":
        baseTime = 30000; // 30秒
        break;
      case "PDF_CONVERT":
        baseTime = 20000; // 20秒
        break;
      case "EMAIL_SEND":
        baseTime = 10000; // 10秒
        break;
      case "DATA_PROCESS":
        baseTime = 40000; // 40秒
        break;
      default:
        baseTime = 15000; // 默认15秒
        break;
    }

    // 添加±20%的随机变化，模拟真实环境
    double variation = 0.8 + (Math.random() * 0.4); // 0.8 到 1.2 之间
    return (long) (baseTime * variation);
  }

  private String simulateTaskProcessing(QueueItem task) {
    switch (task.getTaskType()) {
      case "PDF_GENERATE":
        return "PDF文件生成成功: " + task.getData() + ".pdf";
      case "PDF_CONVERT":
        return "PDF转换完成: " + task.getData() + " -> 转换后文件";
      case "EMAIL_SEND":
        return "邮件发送成功: " + task.getData();
      case "DATA_PROCESS":
        return "数据处理完成: " + task.getData() + " -> 处理结果";
      default:
        return "任务处理完成: " + task.getData();
    }
  }

  public int getProcessedTasks() {
    return processedTasks.get();
  }

  public int getFailedTasks() {
    return failedTasks.get();
  }
}
