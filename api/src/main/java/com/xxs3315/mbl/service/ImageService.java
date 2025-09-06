package com.xxs3315.mbl.service;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

/**
 * 图片服务类
 */
@Service
public class ImageService {

    @Value("${mbl.image.dir:./data/images}")
    private String imageDir;

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
     * 获取图片文件资源
     * @param filename 文件名
     * @return 图片文件资源，如果文件不存在或格式不支持则返回null
     */
    public Resource getImageResource(String filename) {
        try {
            // 验证文件名安全性
            if (filename == null || filename.trim().isEmpty()) {
                return null;
            }

            // 防止路径遍历攻击
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                return null;
            }

            // 构建文件路径
            Path filePath = Paths.get(imageDir, filename);
            File file = filePath.toFile();

            // 检查文件是否存在
            if (!file.exists() || !file.isFile()) {
                return null;
            }

            // 检查文件扩展名
            String extension = FilenameUtils.getExtension(filename).toLowerCase();
            if (!allowedExtensions.contains(extension)) {
                return null;
            }

            // 创建资源
            return new FileSystemResource(file);

        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 获取图片文件的媒体类型
     * @param filename 文件名
     * @return 媒体类型，如果无法确定则返回null
     */
    public MediaType getImageMediaType(String filename) {
        if (filename == null || filename.trim().isEmpty()) {
            return null;
        }

        String extension = FilenameUtils.getExtension(filename).toLowerCase();
        return getMediaType(extension);
    }

    /**
     * 检查图片文件是否存在
     * @param filename 文件名
     * @return 文件是否存在且格式支持
     */
    public boolean isImageExists(String filename) {
        try {
            // 验证文件名安全性
            if (filename == null || filename.trim().isEmpty()) {
                return false;
            }

            // 防止路径遍历攻击
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                return false;
            }

            // 构建文件路径
            Path filePath = Paths.get(imageDir, filename);
            File file = filePath.toFile();

            // 检查文件是否存在
            if (!file.exists() || !file.isFile()) {
                return false;
            }

            // 检查文件扩展名
            String extension = FilenameUtils.getExtension(filename).toLowerCase();
            return allowedExtensions.contains(extension);

        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 获取图片文件信息
     * @param filename 文件名
     * @return 文件信息，包含文件大小、媒体类型等
     */
    public ImageFileInfo getImageFileInfo(String filename) {
        try {
            // 验证文件名安全性
            if (filename == null || filename.trim().isEmpty()) {
                return null;
            }

            // 防止路径遍历攻击
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                return null;
            }

            // 构建文件路径
            Path filePath = Paths.get(imageDir, filename);
            File file = filePath.toFile();

            // 检查文件是否存在
            if (!file.exists() || !file.isFile()) {
                return null;
            }

            // 检查文件扩展名
            String extension = FilenameUtils.getExtension(filename).toLowerCase();
            if (!allowedExtensions.contains(extension)) {
                return null;
            }

            // 创建文件信息
            ImageFileInfo fileInfo = new ImageFileInfo();
            fileInfo.setFilename(filename);
            fileInfo.setSize(file.length());
            fileInfo.setMediaType(getMediaType(extension));
            fileInfo.setExtension(extension);
            fileInfo.setPath(filePath.toString());

            return fileInfo;

        } catch (Exception e) {
            return null;
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

    /**
     * 图片文件信息类
     */
    public static class ImageFileInfo {
        private String filename;
        private long size;
        private MediaType mediaType;
        private String extension;
        private String path;

        // Getters and Setters
        public String getFilename() {
            return filename;
        }

        public void setFilename(String filename) {
            this.filename = filename;
        }

        public long getSize() {
            return size;
        }

        public void setSize(long size) {
            this.size = size;
        }

        public MediaType getMediaType() {
            return mediaType;
        }

        public void setMediaType(MediaType mediaType) {
            this.mediaType = mediaType;
        }

        public String getExtension() {
            return extension;
        }

        public void setExtension(String extension) {
            this.extension = extension;
        }

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }

        @Override
        public String toString() {
            return "ImageFileInfo{" +
                    "filename='" + filename + '\'' +
                    ", size=" + size +
                    ", mediaType=" + mediaType +
                    ", extension='" + extension + '\'' +
                    ", path='" + path + '\'' +
                    '}';
        }
    }
}
