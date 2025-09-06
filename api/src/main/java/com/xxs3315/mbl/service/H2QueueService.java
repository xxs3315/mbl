package com.xxs3315.mbl.service;

import com.xxs3315.mbl.entity.QueueItem;
import com.xxs3315.mbl.repository.QueueItemRepository;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.dao.InvalidDataAccessResourceUsageException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Profile("h2")
public class H2QueueService implements QueueService {

  private static final Logger logger = LoggerFactory.getLogger(H2QueueService.class);

  @Autowired private QueueItemRepository queueItemRepository;

  @Transactional
  public QueueItem addToQueue(String taskType, String data) {
    QueueItem item = new QueueItem(taskType, data);
    QueueItem savedItem = queueItemRepository.save(item);
    logger.info("任务已添加到H2队列: {} - {}", savedItem.getTaskId(), taskType);
    return savedItem;
  }

  @Transactional
  public Optional<QueueItem> getNextTask() {
    try {
      // 使用FOR UPDATE锁定查询，防止并发问题
      Optional<QueueItem> taskOpt = queueItemRepository.findFirstPendingTaskForUpdate();
      if (taskOpt.isPresent()) {
        QueueItem task = taskOpt.get();
        // 再次检查状态，确保任务仍然是PENDING状态
        if (task.getStatus() == QueueItem.TaskStatus.PENDING) {
          task.setStatus(QueueItem.TaskStatus.PROCESSING);
          task.setStartTime(LocalDateTime.now());
          queueItemRepository.save(task);
          logger.info("获取到H2队列任务: {} - {}", task.getTaskId(), task.getTaskType());
          return Optional.of(task);
        } else {
          logger.warn("任务状态已改变，跳过处理: {} - {}", task.getTaskId(), task.getStatus());
        }
      }
      return Optional.empty();
    } catch (OptimisticLockingFailureException e) {
      logger.warn("获取任务时发生乐观锁冲突，重试中...");
      // 乐观锁冲突时返回空，让调用方重试
      return Optional.empty();
    } catch (InvalidDataAccessResourceUsageException e) {
      logger.warn("数据库表可能还未创建完成，跳过本次查询");
      // 表不存在时返回空，等待表创建完成
      return Optional.empty();
    }
  }

  @Transactional
  public boolean completeTask(String taskId, String result) {
    try {
      Optional<QueueItem> taskOpt = queueItemRepository.findByTaskId(taskId);
      if (taskOpt.isPresent()) {
        QueueItem task = taskOpt.get();
        if (task.getStatus() == QueueItem.TaskStatus.PROCESSING) {
          task.setStatus(QueueItem.TaskStatus.COMPLETED);
          task.setEndTime(LocalDateTime.now());
          task.setResult(result);
          queueItemRepository.save(task);
          logger.info("H2队列任务已完成: {} - {}", taskId, result);
          return true;
        }
      }
      return false;
    } catch (OptimisticLockingFailureException e) {
      logger.warn("完成任务时发生乐观锁冲突: {}", taskId);
      return false;
    }
  }

  @Transactional
  public boolean failTask(String taskId, String errorMessage) {
    try {
      Optional<QueueItem> taskOpt = queueItemRepository.findByTaskId(taskId);
      if (taskOpt.isPresent()) {
        QueueItem task = taskOpt.get();
        if (task.getStatus() == QueueItem.TaskStatus.PROCESSING) {
          task.setStatus(QueueItem.TaskStatus.FAILED);
          task.setEndTime(LocalDateTime.now());
          task.setErrorMessage(errorMessage);
          queueItemRepository.save(task);
          logger.info("H2队列任务执行失败: {} - {}", taskId, errorMessage);
          return true;
        }
      }
      return false;
    } catch (OptimisticLockingFailureException e) {
      logger.warn("失败任务时发生乐观锁冲突: {}", taskId);
      return false;
    }
  }

  public Optional<QueueItem> getTaskStatus(String taskId) {
    return queueItemRepository.findByTaskId(taskId);
  }

  @Transactional(readOnly = true)
  public Map<String, Object> getQueueStats() {
    Map<String, Object> stats = new HashMap<>();
    // 使用只读事务确保数据一致性
    stats.put("pending", queueItemRepository.countByStatus(QueueItem.TaskStatus.PENDING));
    stats.put("processing", queueItemRepository.countByStatus(QueueItem.TaskStatus.PROCESSING));
    stats.put("completed", queueItemRepository.countByStatus(QueueItem.TaskStatus.COMPLETED));
    stats.put("failed", queueItemRepository.countByStatus(QueueItem.TaskStatus.FAILED));
    stats.put("cancelled", queueItemRepository.countByStatus(QueueItem.TaskStatus.CANCELLED));
    stats.put("total", queueItemRepository.count());
    stats.put("timestamp", LocalDateTime.now().toString());
    return stats;
  }

  public List<QueueItem> getPendingTasks() {
    return queueItemRepository.findByStatusOrderByCreateTimeAsc(QueueItem.TaskStatus.PENDING);
  }

  public List<QueueItem> getProcessingTasks() {
    return queueItemRepository.findByStatusOrderByCreateTimeAsc(QueueItem.TaskStatus.PROCESSING);
  }

  public List<QueueItem> getCompletedTasks() {
    return queueItemRepository.findByStatusOrderByCreateTimeAsc(QueueItem.TaskStatus.COMPLETED);
  }

  @Transactional
  public void clearQueue() {
    queueItemRepository.deleteAll();
    logger.info("H2队列已清空");
  }

  @Transactional
  public boolean cancelTask(String taskId) {
    try {
      Optional<QueueItem> taskOpt = queueItemRepository.findByTaskId(taskId);
      if (taskOpt.isPresent()) {
        QueueItem task = taskOpt.get();
        if (task.getStatus() == QueueItem.TaskStatus.PENDING) {
          task.setStatus(QueueItem.TaskStatus.CANCELLED);
          task.setEndTime(LocalDateTime.now());
          queueItemRepository.save(task);
          logger.info("H2队列任务已取消: {}", taskId);
          return true;
        }
      }
      return false;
    } catch (OptimisticLockingFailureException e) {
      logger.warn("取消任务时发生乐观锁冲突: {}", taskId);
      return false;
    }
  }

  public String getDatabasePath() {
    return "H2文件数据库 (./data/h2db.mv.db)";
  }

  @Transactional
  public boolean resetProcessingTaskToPending(String taskId) {
    try {
      Optional<QueueItem> taskOpt = queueItemRepository.findByTaskId(taskId);
      if (taskOpt.isPresent()) {
        QueueItem task = taskOpt.get();
        if (task.getStatus() == QueueItem.TaskStatus.PROCESSING) {
          task.setStatus(QueueItem.TaskStatus.PENDING);
          task.setStartTime(null); // 清除开始时间
          task.setEndTime(null); // 清除结束时间
          task.setResult(null); // 清除结果
          task.setErrorMessage(null); // 清除错误信息
          queueItemRepository.save(task);
          logger.info("H2队列任务已重置为PENDING状态: {}", taskId);
          return true;
        }
      }
      return false;
    } catch (OptimisticLockingFailureException e) {
      logger.warn("重置任务时发生乐观锁冲突: {}", taskId);
      return false;
    }
  }
}
