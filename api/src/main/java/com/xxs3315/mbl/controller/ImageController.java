package com.xxs3315.mbl.controller;

import com.xxs3315.mbl.dto.ImageUploadResponse;
import com.xxs3315.mbl.util.FileSizeUtil;
import jakarta.annotation.PostConstruct;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.imageio.ImageIO;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class ImageController {

    @Value("${mbl.image.dir:./data/images}")
    private String imageDir;

    @Value("${mbl.image.max-file-size:10485760}")
    private long maxFileSize;

    @Value("${mbl.image.allowed-extensions:jpg,jpeg,png,gif,bmp,webp}")
    private String allowedExtensionsStr;

    // 支持的图片格式列表（从配置文件加载）
    private List<String> allowedExtensions;

    /**
     * 初始化配置
     */
    @PostConstruct
    public void init() {
        // 将配置的扩展名字符串转换为小写列表
        allowedExtensions = Arrays.asList(
                allowedExtensionsStr.toLowerCase().split(",")
        );
    }

    /**
     * 图片上传接口
     */
    @PostMapping("/upload")
    public ResponseEntity<?> imageUpload(@RequestParam("file") MultipartFile file) {
        try {
            // 验证文件
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of("success", false, "message", "文件不能为空"));
            }

            // 验证文件大小（业务层验证）
            if (file.getSize() > maxFileSize) {
                String sizeMessage = FileSizeUtil.formatFileSize(maxFileSize);
                return ResponseEntity.badRequest()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of("success", false, "message", 
                                "文件大小不能超过" + sizeMessage + "，请选择较小的文件"));
            }

            // 验证文件格式
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                return ResponseEntity.badRequest()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of("success", false, "message", "文件名不能为空"));
            }

            String extension = FilenameUtils.getExtension(originalFilename).toLowerCase();
            if (!allowedExtensions.contains(extension)) {
                return ResponseEntity.badRequest()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of("success", false, "message", 
                                "不支持的文件格式，支持的格式: " + String.join(", ", allowedExtensions)));
            }

            // 确保上传目录存在
            Path uploadPath = Paths.get(imageDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 生成唯一文件名
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
            String uuid = UUID.randomUUID().toString().substring(0, 8);
            String newFilename = String.format("img_%s_%s.%s", timestamp, uuid, extension);

            // 保存文件
            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath);

            // 获取图片尺寸
            BufferedImage image = ImageIO.read(filePath.toFile());
            int width = image.getWidth();
            int height = image.getHeight();

            // 构建访问URL
            String url = "/api/images/" + newFilename;

            // 构建响应
            ImageUploadResponse response = new ImageUploadResponse(
                    newFilename,
                    originalFilename,
                    file.getSize(),
                    width,
                    height,
                    url,
                    "图片上传成功"
            );

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("success", false, "message", "文件保存失败: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("success", false, "message", "上传失败: " + e.getMessage()));
        }
    }

    /**
     * 图片下载接口
     */
    @GetMapping("/{filename}")
    public ResponseEntity<Resource> imageDownload(@PathVariable String filename) {
        try {
            // 验证文件名安全性
            if (filename == null || filename.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            // 防止路径遍历攻击
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                return ResponseEntity.badRequest().build();
            }

            // 构建文件路径
            Path filePath = Paths.get(imageDir, filename);
            File file = filePath.toFile();

            // 检查文件是否存在
            if (!file.exists() || !file.isFile()) {
                return ResponseEntity.notFound().build();
            }

            // 检查文件扩展名
            String extension = FilenameUtils.getExtension(filename).toLowerCase();
            if (!allowedExtensions.contains(extension)) {
                return ResponseEntity.badRequest().build();
            }

            // 创建资源
            Resource resource = new FileSystemResource(file);

            // 确定媒体类型
            MediaType mediaType = getMediaType(extension);

            // 设置响应头
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"");
            headers.add(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000"); // 缓存1年

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(file.length())
                    .contentType(mediaType)
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 根据文件扩展名获取媒体类型
     */
    private MediaType getMediaType(String extension) {
        switch (extension.toLowerCase()) {
            case "jpg":
            case "jpeg":
                return MediaType.IMAGE_JPEG;
            case "png":
                return MediaType.IMAGE_PNG;
            case "gif":
                return MediaType.IMAGE_GIF;
            case "bmp":
                return MediaType.valueOf("image/bmp");
            case "webp":
                return MediaType.valueOf("image/webp");
            default:
                return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
}
