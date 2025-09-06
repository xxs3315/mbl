package com.xxs3315.mbl.util;

/** 文件大小工具类 */
public class FileSizeUtil {

  /**
   * 格式化文件大小，智能选择最合适的单位
   *
   * @param bytes 文件大小（字节）
   * @return 格式化后的文件大小字符串
   */
  public static String formatFileSize(long bytes) {
    if (bytes < 1024) {
      return bytes + "B";
    } else if (bytes < 1024 * 1024) {
      return String.format("%.1fKB", bytes / 1024.0);
    } else if (bytes < 1024 * 1024 * 1024) {
      return String.format("%.1fMB", bytes / (1024.0 * 1024.0));
    } else {
      return String.format("%.1fGB", bytes / (1024.0 * 1024.0 * 1024.0));
    }
  }
}
