package com.xxs3315.mbl.pdf.controllers;

import com.xxs3315.mbl.pdf.services.FontService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pdf/fonts")
public class FontMonitorController {

  private final FontService fontService;

  @Autowired
  public FontMonitorController(FontService fontService) {
    this.fontService = fontService;
  }

  /** 获取字体缓存统计信息 */
//  @Operation(summary = "获取字体缓存统计", description = "查看字体缓存状态和内存使用情况")
  @GetMapping("/stats")
  public ResponseEntity<Map<String, Object>> getFontStats() {
    Map<String, Object> stats = fontService.getCacheStats();
    return ResponseEntity.ok(stats);
  }

  /** 清理字体缓存 */
//  @Operation(summary = "清理字体缓存", description = "清理所有缓存的字体，释放内存")
  @DeleteMapping("/cache")
  public ResponseEntity<Map<String, Object>> clearFontCache() {
    fontService.clearCache();
    Map<String, Object> stats = fontService.getCacheStats();
    return ResponseEntity.ok(stats);
  }

  /** 预加载常用字体 */
//  @Operation(summary = "预加载常用字体", description = "预加载常用字体到缓存中")
  @PostMapping("/preload")
  public ResponseEntity<Map<String, Object>> preloadCommonFonts() {
    fontService.preloadCommonFonts();
    Map<String, Object> stats = fontService.getCacheStats();
    return ResponseEntity.ok(stats);
  }

  /** 测试字体加载 */
//  @Operation(summary = "测试字体加载", description = "测试指定字体的加载情况")
  @PostMapping("/test/{fontName}")
  public ResponseEntity<Map<String, Object>> testFontLoading(@PathVariable String fontName) {
    try {
      // 尝试加载字体
      fontService.getFont(fontName);

      Map<String, Object> stats = fontService.getCacheStats();
      stats.put("testResult", "success");
      stats.put("testedFont", fontName);

      return ResponseEntity.ok(stats);
    } catch (Exception e) {
      Map<String, Object> errorStats = fontService.getCacheStats();
      errorStats.put("testResult", "failed");
      errorStats.put("testedFont", fontName);
      errorStats.put("error", e.getMessage());

      return ResponseEntity.badRequest().body(errorStats);
    }
  }

  /** 获取内存使用情况 */
//  @Operation(summary = "获取内存使用情况", description = "查看当前JVM内存使用情况")
  @GetMapping("/memory")
  public ResponseEntity<Map<String, Object>> getMemoryInfo() {
    Map<String, Object> stats = fontService.getCacheStats();

    // 只返回内存相关信息
    Map<String, Object> memoryInfo =
        Map.of(
            "freeMemory", stats.get("freeMemory"),
            "totalMemory", stats.get("totalMemory"),
            "maxMemory", stats.get("maxMemory"),
            "usedMemory", (Long) stats.get("totalMemory") - (Long) stats.get("freeMemory"),
            "memoryUsagePercent",
                String.format(
                    "%.2f%%",
                    ((Long) stats.get("totalMemory") - (Long) stats.get("freeMemory"))
                        * 100.0
                        / (Long) stats.get("totalMemory")));

    return ResponseEntity.ok(memoryInfo);
  }
}
