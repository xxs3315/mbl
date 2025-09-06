package com.xxs3315.mbl.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/** 图片上传响应DTO */
public class ImageUploadResponse {

  @JsonProperty("filename")
  private String filename;

  @JsonProperty("originalName")
  private String originalName;

  @JsonProperty("size")
  private long size;

  @JsonProperty("width")
  private int width;

  @JsonProperty("height")
  private int height;

  @JsonProperty("url")
  private String url;

  @JsonProperty("message")
  private String message;

  // 构造函数
  public ImageUploadResponse() {}

  public ImageUploadResponse(
      String filename,
      String originalName,
      long size,
      int width,
      int height,
      String url,
      String message) {
    this.filename = filename;
    this.originalName = originalName;
    this.size = size;
    this.width = width;
    this.height = height;
    this.url = url;
    this.message = message;
  }

  // Getter 和 Setter 方法
  public String getFilename() {
    return filename;
  }

  public void setFilename(String filename) {
    this.filename = filename;
  }

  public String getOriginalName() {
    return originalName;
  }

  public void setOriginalName(String originalName) {
    this.originalName = originalName;
  }

  public long getSize() {
    return size;
  }

  public void setSize(long size) {
    this.size = size;
  }

  public int getWidth() {
    return width;
  }

  public void setWidth(int width) {
    this.width = width;
  }

  public int getHeight() {
    return height;
  }

  public void setHeight(int height) {
    this.height = height;
  }

  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  @Override
  public String toString() {
    return "ImageUploadResponse{"
        + "filename='"
        + filename
        + '\''
        + ", originalName='"
        + originalName
        + '\''
        + ", size="
        + size
        + ", width="
        + width
        + ", height="
        + height
        + ", url='"
        + url
        + '\''
        + ", message='"
        + message
        + '\''
        + '}';
  }
}
