package com.xxs3315.mbl.pdf.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "pdf.font")
public class FontConfig {

  /** 字体缓存大小限制 */
  private int cacheSize = 10;

  /** 内存阈值（MB） */
  private long memoryThreshold = 100;

  /** 是否启用字体缓存 */
  private boolean cacheEnabled = true;

  /** 是否启用内存监控 */
  private boolean memoryMonitoring = true;

  /** 是否预加载常用字体 */
  private boolean preloadCommonFonts = false;

  /** 字体加载超时时间（毫秒） */
  private long loadTimeout = 5000;

  public int getCacheSize() {
    return cacheSize;
  }

  public void setCacheSize(int cacheSize) {
    this.cacheSize = cacheSize;
  }

  public long getMemoryThreshold() {
    return memoryThreshold;
  }

  public void setMemoryThreshold(long memoryThreshold) {
    this.memoryThreshold = memoryThreshold;
  }

  public boolean isCacheEnabled() {
    return cacheEnabled;
  }

  public void setCacheEnabled(boolean cacheEnabled) {
    this.cacheEnabled = cacheEnabled;
  }

  public boolean isMemoryMonitoring() {
    return memoryMonitoring;
  }

  public void setMemoryMonitoring(boolean memoryMonitoring) {
    this.memoryMonitoring = memoryMonitoring;
  }

  public boolean isPreloadCommonFonts() {
    return preloadCommonFonts;
  }

  public void setPreloadCommonFonts(boolean preloadCommonFonts) {
    this.preloadCommonFonts = preloadCommonFonts;
  }

  public long getLoadTimeout() {
    return loadTimeout;
  }

  public void setLoadTimeout(long loadTimeout) {
    this.loadTimeout = loadTimeout;
  }
}
