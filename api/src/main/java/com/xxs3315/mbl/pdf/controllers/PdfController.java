package com.xxs3315.mbl.pdf.controllers;

import com.google.gson.Gson;
import com.xxs3315.mbl.entity.QueueItem;
import com.xxs3315.mbl.pdf.dtos.GenPdfProps;
import com.xxs3315.mbl.pdf.dtos.PdfQueueResponse;
import com.xxs3315.mbl.service.QueueService;
import java.util.Map;
import net.arnx.jsonic.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {
  @Autowired private QueueService queueService;

  @PostMapping("/generate")
  public ResponseEntity<?> submitTask(@RequestBody GenPdfProps props) {
    try {
      String requestData = new Gson().toJson(props);
      String strictRequestData = JSON.encode(JSON.decode(requestData));
      QueueItem item = queueService.addToQueue(props.getType(), strictRequestData);
      PdfQueueResponse response = new PdfQueueResponse();
      response.setTaskId(item.getTaskId());
      response.setStatus(item.getStatus().toString());
      return ResponseEntity.ok(Map.of(
              "success",
              true,
              "message",
              "任务已添加到队列",
              "data",
              response));
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.badRequest()
          .body(Map.of("success", false, "message", "添加任务失败: " + e.getMessage()));
    }
  }
}
