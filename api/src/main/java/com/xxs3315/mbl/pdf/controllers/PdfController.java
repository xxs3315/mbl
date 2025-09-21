package com.xxs3315.mbl.pdf.controllers;

import com.google.gson.Gson;
import com.xxs3315.mbl.entity.QueueItem;
import com.xxs3315.mbl.pdf.dtos.GenPdfProps;
import com.xxs3315.mbl.pdf.dtos.PdfQueueResponse;
import com.xxs3315.mbl.pdf.properties.PdfMakerProperties;
import com.xxs3315.mbl.service.QueueService;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Optional;
import net.arnx.jsonic.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {
  private static final Logger logger = LoggerFactory.getLogger(PdfController.class);

  @Autowired private QueueService queueService;
  @Autowired private PdfMakerProperties pdfMakerProperties;

  @PostMapping("/generate")
  public ResponseEntity<?> submitTask(@RequestBody GenPdfProps props) {
    try {
      String requestData = new Gson().toJson(props);
      String strictRequestData = JSON.encode(JSON.decode(requestData));
      QueueItem item = queueService.addToQueue(props.getType(), strictRequestData);
      PdfQueueResponse response = new PdfQueueResponse();
      response.setTaskId(item.getTaskId());
      response.setStatus(item.getStatus().toString());
      return ResponseEntity.ok(Map.of("success", true, "message", "任务已添加到队列", "data", response));
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "添加任务失败: " + e.getMessage()));
    }
  }

  /**
   * 通过任务ID下载PDF文件 只有COMPLETED状态的任务才允许下载
   *
   * @param taskId 任务ID
   * @return PDF文件资源或错误响应
   */
  @GetMapping("/download/{taskId}")
  public ResponseEntity<Resource> downloadPdf(@PathVariable String taskId) {
    logger.info("收到PDF下载请求，任务ID: {}", taskId);

    try {
      // 验证任务ID格式
      if (taskId == null || taskId.trim().isEmpty()) {
        logger.warn("任务ID为空");
        return ResponseEntity.badRequest().header(HttpHeaders.WARNING, "任务ID不能为空").build();
      }

      // 获取任务信息
      Optional<QueueItem> taskOpt = queueService.getTaskStatus(taskId);
      if (taskOpt.isEmpty()) {
        logger.warn("任务不存在: {}", taskId);
        return ResponseEntity.notFound().header(HttpHeaders.WARNING, "任务不存在: " + taskId).build();
      }

      QueueItem task = taskOpt.get();
      logger.info("找到任务: {}, 状态: {}", taskId, task.getStatus());

      // 检查任务状态
      if (task.getStatus() != QueueItem.TaskStatus.COMPLETED) {
        String message = "PDF任务尚未完成，当前状态: " + task.getStatus() + "，请稍后重试";
        logger.warn("任务状态不正确: {}, 期望: COMPLETED", task.getStatus());
        return ResponseEntity.status(HttpStatus.ACCEPTED)
            .header(HttpHeaders.WARNING, message)
            .build();
      }

      // 构建文件路径
      String filename = taskId + ".pdf";
      Path filePath = Paths.get(pdfMakerProperties.getOutputDir(), filename);
      logger.info("查找PDF文件: {}", filePath);

      // 检查文件是否存在
      if (!filePath.toFile().exists()) {
        logger.warn("PDF文件不存在: {}", filePath);
        return ResponseEntity.notFound()
            .header(HttpHeaders.WARNING, "PDF文件不存在: " + filename)
            .build();
      }

      // 创建资源对象
      Resource resource = new UrlResource(filePath.toUri());

      if (resource.exists() && resource.isReadable()) {
        // 获取文件大小
        long contentLength = resource.contentLength();
        logger.info("成功找到PDF文件: {}, 大小: {} bytes", filename, contentLength);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
            .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(contentLength))
            .contentType(MediaType.APPLICATION_PDF)
            .body(resource);
      } else {
        logger.error("PDF文件无法读取: {}", filePath);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .header(HttpHeaders.WARNING, "PDF文件无法读取")
            .build();
      }

    } catch (Exception e) {
      logger.error("下载PDF时发生错误，任务ID: {}", taskId, e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .header(HttpHeaders.WARNING, "下载PDF时发生错误: " + e.getMessage())
          .build();
    }
  }
}
