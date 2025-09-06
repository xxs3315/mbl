package com.xxs3315.mbl.controller;

import com.xxs3315.mbl.entity.QueueItem;
import com.xxs3315.mbl.service.QueueProcessor;
import com.xxs3315.mbl.service.QueueService;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/queue")
public class QueueController {

  @Autowired private QueueService queueService;

  @Autowired private QueueProcessor queueProcessor;

  @PostMapping("/add")
  public ResponseEntity<?> addTask(@RequestParam String taskType, @RequestParam String data) {
    try {
      QueueItem item = queueService.addToQueue(taskType, data);
      return ResponseEntity.ok(
          Map.of(
              "success",
              true,
              "message",
              "任务已添加到队列",
              "taskId",
              item.getTaskId(),
              "taskType",
              item.getTaskType()));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "添加任务失败: " + e.getMessage()));
    }
  }

  @GetMapping("/status/{taskId}")
  public ResponseEntity<?> getTaskStatus(@PathVariable String taskId) {
    try {
      var itemOpt = queueService.getTaskStatus(taskId);
      if (itemOpt.isPresent()) {
        return ResponseEntity.ok(Map.of("success", true, "task", itemOpt.get()));
      } else {
        return ResponseEntity.notFound().build();
      }
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "获取任务状态失败: " + e.getMessage()));
    }
  }

  @GetMapping("/stats")
  public ResponseEntity<?> getQueueStats() {
    try {
      Map<String, Object> stats = queueService.getQueueStats();
      Map<String, Object> processorStats = queueProcessor.getProcessorStats();

      stats.putAll(processorStats);
      stats.put("databasePath", queueService.getDatabasePath());

      return ResponseEntity.ok(Map.of("success", true, "stats", stats));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "获取队列统计失败: " + e.getMessage()));
    }
  }

  @GetMapping("/pending")
  public ResponseEntity<?> getPendingTasks() {
    try {
      return ResponseEntity.ok(Map.of("success", true, "tasks", queueService.getPendingTasks()));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "获取待处理任务失败: " + e.getMessage()));
    }
  }

  @GetMapping("/processing")
  public ResponseEntity<?> getProcessingTasks() {
    try {
      return ResponseEntity.ok(Map.of("success", true, "tasks", queueService.getProcessingTasks()));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "获取处理中任务失败: " + e.getMessage()));
    }
  }

  @GetMapping("/completed")
  public ResponseEntity<?> getCompletedTasks() {
    try {
      return ResponseEntity.ok(Map.of("success", true, "tasks", queueService.getCompletedTasks()));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "获取已完成任务失败: " + e.getMessage()));
    }
  }

  @PostMapping("/cancel/{taskId}")
  public ResponseEntity<?> cancelTask(@PathVariable String taskId) {
    try {
      boolean success = queueService.cancelTask(taskId);
      if (success) {
        return ResponseEntity.ok(Map.of("success", true, "message", "任务已取消"));
      } else {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "任务不存在或无法取消"));
      }
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "取消任务失败: " + e.getMessage()));
    }
  }

  @PostMapping("/clear")
  public ResponseEntity<?> clearQueue() {
    try {
      queueService.clearQueue();
      return ResponseEntity.ok(Map.of("success", true, "message", "队列已清空"));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "清空队列失败: " + e.getMessage()));
    }
  }

  @PostMapping("/processor/start")
  public ResponseEntity<?> startProcessor() {
    try {
      queueProcessor.start();
      return ResponseEntity.ok(Map.of("success", true, "message", "处理器已启动"));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "启动处理器失败: " + e.getMessage()));
    }
  }

  @PostMapping("/processor/stop")
  public ResponseEntity<?> stopProcessor() {
    try {
      queueProcessor.stop();
      return ResponseEntity.ok(Map.of("success", true, "message", "处理器已停止"));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "停止处理器失败: " + e.getMessage()));
    }
  }

  @GetMapping("/processor/status")
  public ResponseEntity<?> getProcessorStatus() {
    try {
      Map<String, Object> processorStats = queueProcessor.getProcessorStats();
      return ResponseEntity.ok(Map.of("success", true, "processorStats", processorStats));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "获取处理器状态失败: " + e.getMessage()));
    }
  }

  @PostMapping("/processor/config")
  public ResponseEntity<?> configureProcessor(@RequestParam int maxConcurrent) {
    try {
      queueProcessor.setMaxConcurrentTasks(maxConcurrent);
      return ResponseEntity.ok(
          Map.of("success", true, "message", "处理器配置已更新，最大并发数: " + maxConcurrent));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "配置处理器失败: " + e.getMessage()));
    }
  }

  @GetMapping("/next")
  public ResponseEntity<?> getNextTask() {
    try {
      var taskOpt = queueService.getNextTask();
      if (taskOpt.isPresent()) {
        return ResponseEntity.ok(Map.of("success", true, "task", taskOpt.get()));
      } else {
        return ResponseEntity.ok(Map.of("success", false, "message", "没有待处理的任务"));
      }
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "获取下一个任务失败: " + e.getMessage()));
    }
  }

  @PostMapping("/complete")
  public ResponseEntity<?> completeTask(@RequestParam String taskId, @RequestParam String result) {
    try {
      boolean success = queueService.completeTask(taskId, result);
      if (success) {
        return ResponseEntity.ok(Map.of("success", true, "message", "任务已完成"));
      } else {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "任务不存在或无法完成"));
      }
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "完成任务失败: " + e.getMessage()));
    }
  }
}
