package com.xxs3315.mbl.exception;

import com.xxs3315.mbl.util.FileSizeUtil;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @Value("${mbl.image.max-file-size:10485760}")
    private long maxFileSize;

    /**
     * 处理文件上传大小超限异常
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException e) {
        // 从异常信息中提取最大允许大小
        String message = e.getMessage();
        long maxSize = maxFileSize; // 从配置文件读取
        
        // 尝试从异常信息中解析实际的最大大小
        if (message != null && message.contains("Maximum upload size")) {
            // 解析异常信息中的大小限制
            try {
                // 异常信息格式通常是: "Maximum upload size exceeded; nested exception is java.lang.IllegalStateException: org.apache.tomcat.util.http.fileupload.impl.FileUploadBase$SizeLimitExceededException: the request was rejected because its size (15728640) exceeds the configured maximum (10485760)"
                if (message.contains("exceeds the configured maximum")) {
                    String[] parts = message.split("exceeds the configured maximum \\(");
                    if (parts.length > 1) {
                        String sizePart = parts[1].split("\\)")[0];
                        maxSize = Long.parseLong(sizePart);
                    }
                }
            } catch (Exception parseException) {
                // 解析失败时使用配置文件中的值
                maxSize = maxFileSize;
            }
        }
        
        String sizeMessage = FileSizeUtil.formatFileSize(maxSize);
        
        Map<String, Object> errorResponse = Map.of(
            "success", false,
            "message", "文件大小不能超过" + sizeMessage + "，请选择较小的文件"
        );
        
        return ResponseEntity.badRequest()
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .body(errorResponse);
    }
    
    /**
     * 处理文件上传相关异常
     */
    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<Map<String, Object>> handleMultipartException(MultipartException e) {
        String message = "文件上传失败";
        
        // 检查是否是连接重置相关的异常
        if (e.getMessage() != null && 
            (e.getMessage().contains("Connection reset") || 
             e.getMessage().contains("connection was aborted") ||
             e.getMessage().contains("Broken pipe"))) {
            message = "文件上传超时或连接中断，请尝试上传较小的文件或检查网络连接";
        } else if (e.getMessage() != null && e.getMessage().contains("SizeLimitExceededException")) {
            message = "文件大小超过限制，请选择较小的文件";
        }
        
        Map<String, Object> errorResponse = Map.of(
            "success", false,
            "message", message
        );
        
        return ResponseEntity.badRequest()
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .body(errorResponse);
    }
    
    /**
     * 处理其他未捕获的异常
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception e) {
        Map<String, Object> errorResponse = Map.of(
            "success", false,
            "message", "服务器内部错误: " + e.getMessage()
        );
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .body(errorResponse);
    }
}
