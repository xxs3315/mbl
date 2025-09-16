package com.xxs3315.mbl.pdf.services;

import com.helger.font.alegreya_sans.EFontResourceAlegreyaSans;
import com.helger.font.anaheim.EFontResourceAnaheim;
import com.helger.font.exo2.EFontResourceExo2;
import com.helger.font.kurinto.mono.EFontResourceKurintoMono;
import com.helger.font.kurinto.sans.EFontResourceKurintoSans;
import com.helger.font.lato2.EFontResourceLato2;
import com.helger.font.markazi.EFontResourceMarkazi;
import com.helger.font.noto_sans_hk.EFontResourceNotoSansHK;
import com.helger.font.noto_sans_sc.EFontResourceNotoSansSC;
import com.helger.font.noto_sans_tc.EFontResourceNotoSansTC;
import com.helger.font.open_sans.EFontResourceOpenSans;
import com.helger.font.roboto.EFontResourceRoboto;
import com.helger.font.source_sans3.EFontResourceSourceSans3;
import com.helger.font.source_sans_pro.EFontResourceSourceSansPro;
import com.helger.pdflayout.spec.PreloadFont;
import com.xxs3315.mbl.pdf.config.FontConfig;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FontService {

  private static final Logger logger = LoggerFactory.getLogger(FontService.class);

  // 字体缓存 - 使用ConcurrentHashMap保证线程安全
  private static final Map<String, PreloadFont> FONT_CACHE = new ConcurrentHashMap<>();

  // 默认字体缓存
  private static volatile PreloadFont DEFAULT_FONT = null;

  private final FontConfig fontConfig;

  @Autowired
  public FontService(FontConfig fontConfig) {
    this.fontConfig = fontConfig;
  }

  /** 根据字体名称获取预加载字体（带缓存和懒加载） */
  public PreloadFont getFont(String fontName) {
    try {
      // 检查内存使用情况
      if (fontConfig.isMemoryMonitoring()) {
        checkMemoryUsage();
      }

      // 如果字体名称为空或null，返回默认字体
      if (fontName == null || fontName.trim().isEmpty()) {
        return getDefaultFont();
      }

      // 如果缓存被禁用，直接加载字体
      if (!fontConfig.isCacheEnabled()) {
        return loadFont(fontName);
      }

      // 检查缓存大小限制
      checkCacheSizeLimit();

      // 从缓存获取字体，如果不存在则懒加载
      return FONT_CACHE.computeIfAbsent(fontName, this::loadFont);

    } catch (OutOfMemoryError e) {
      logger.error("OutOfMemoryError while loading font: {}", fontName, e);
      // 清理缓存并返回默认字体
      clearCache();
      return getDefaultFont();
    } catch (Exception e) {
      logger.error("Error loading font: {}", fontName, e);
      return getDefaultFont();
    }
  }

  /** 懒加载字体 */
  private PreloadFont loadFont(String fontName) {
    logger.info("Loading font: {}", fontName);

    PreloadFont scFont = getDefaultFont();

    switch (fontName.toLowerCase()) {
      case "alegreya-sans":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceAlegreyaSans.ALGREYA_SANS_NORMAL.getFontResource());
        break;
      case "anaheim":
        scFont =
            PreloadFont.createEmbedding(EFontResourceAnaheim.ANAHEIM_REGULAR.getFontResource());
        break;
      case "exo2":
        scFont = PreloadFont.createEmbedding(EFontResourceExo2.EXO2_NORMAL.getFontResource());
        break;
      case "kurinto-mono":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceKurintoMono.KURINTO_MONO_REGULAR.getFontResource());
        break;
      case "kurinto-sans":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceKurintoSans.KURINTO_SANS_REGULAR.getFontResource());
        break;
      case "lato2":
        scFont = PreloadFont.createEmbedding(EFontResourceLato2.LATO2_NORMAL.getFontResource());
        break;
      case "markazi":
        scFont = PreloadFont.createEmbedding(EFontResourceMarkazi.MARKAZI_NORMAL.getFontResource());
        break;
      case "noto-sans-hk":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceNotoSansHK.NOTO_SANS_HK_REGULAR.getFontResource());
        break;
      case "noto-sans-sc":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceNotoSansSC.NOTO_SANS_SC_REGULAR.getFontResource());
        break;
      case "noto-sans-tc":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceNotoSansTC.NOTO_SANS_TC_REGULAR.getFontResource());
        break;
      case "open-sans":
        scFont =
            PreloadFont.createEmbedding(EFontResourceOpenSans.OPEN_SANS_NORMAL.getFontResource());
        break;
      case "roboto":
        scFont = PreloadFont.createEmbedding(EFontResourceRoboto.ROBOTO_NORMAL.getFontResource());
        break;
      case "source-sans3":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceSourceSans3.SOURCE_SANS3_NORMAL.getFontResource());
        break;
      case "source-sans-pro":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceSourceSansPro.SOURCE_SANS_PRO_NORMAL.getFontResource());
        break;
      case "alegreya-sans-bd":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceAlegreyaSans.ALGREYA_SANS_BOLD.getFontResource());
        break;
      case "anaheim-bd":
        scFont =
            PreloadFont.createEmbedding(EFontResourceAnaheim.ANAHEIM_REGULAR.getFontResource());
        break;
      case "exo2-bd":
        scFont = PreloadFont.createEmbedding(EFontResourceExo2.EXO2_BOLD.getFontResource());
        break;
      case "kurinto-mono-bd":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceKurintoMono.KURINTO_MONO_BOLD.getFontResource());
        break;
      case "kurinto-sans-bd":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceKurintoSans.KURINTO_SANS_BOLD.getFontResource());
        break;
      case "lato2-bd":
        scFont = PreloadFont.createEmbedding(EFontResourceLato2.LATO2_BOLD.getFontResource());
        break;
      case "markazi-bd":
        scFont = PreloadFont.createEmbedding(EFontResourceMarkazi.MARKAZI_BOLD.getFontResource());
        break;
      case "noto-sans-hk-bd":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceNotoSansHK.NOTO_SANS_HK_BOLD.getFontResource());
        break;
      case "noto-sans-sc-bd":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceNotoSansSC.NOTO_SANS_SC_BOLD.getFontResource());
        break;
      case "noto-sans-tc-bd":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceNotoSansTC.NOTO_SANS_TC_BOLD.getFontResource());
        break;
      case "open-sans-bd":
        scFont =
            PreloadFont.createEmbedding(EFontResourceOpenSans.OPEN_SANS_BOLD.getFontResource());
        break;
      case "roboto-bd":
        scFont = PreloadFont.createEmbedding(EFontResourceRoboto.ROBOTO_BOLD.getFontResource());
        break;
      case "source-sans3-bd":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceSourceSans3.SOURCE_SANS3_BOLD.getFontResource());
        break;
      case "source-sans-pro-bd":
        scFont =
            PreloadFont.createEmbedding(
                EFontResourceSourceSansPro.SOURCE_SANS_PRO_BOLD.getFontResource());
        break;
      default:
        logger.warn("Unknown font: {}, using default font", fontName);
        return getDefaultFont();
    }

    scFont.setUseFontLineHeightFromHHEA();
    logger.info("Font loaded successfully: {}", fontName);
    return scFont;
  }

  /** 获取默认字体（单例模式） */
  private PreloadFont getDefaultFont() {
    if (DEFAULT_FONT == null) {
      synchronized (FontService.class) {
        if (DEFAULT_FONT == null) {
          logger.info("Loading default font");
          DEFAULT_FONT =
              PreloadFont.createEmbedding(
                  EFontResourceNotoSansSC.NOTO_SANS_SC_REGULAR.getFontResource());
          DEFAULT_FONT.setUseFontLineHeightFromHHEA();
        }
      }
    }
    return DEFAULT_FONT;
  }

  /** 检查内存使用情况 */
  private void checkMemoryUsage() {
    Runtime runtime = Runtime.getRuntime();
    long freeMemory = runtime.freeMemory();
    long totalMemory = runtime.totalMemory();
    long maxMemory = runtime.maxMemory();
    long usedMemory = totalMemory - freeMemory;

    // 记录内存使用情况
    logger.debug(
        "Memory usage - Free: {}MB, Used: {}MB, Total: {}MB, Max: {}MB",
        freeMemory / 1024 / 1024,
        usedMemory / 1024 / 1024,
        totalMemory / 1024 / 1024,
        maxMemory / 1024 / 1024);
  }

  /** 清理字体缓存 */
  public void clearCache() {
    logger.info("Clearing font cache, current size: {}", FONT_CACHE.size());
    FONT_CACHE.clear();
    // 不清理默认字体，因为它是单例
  }

  /** 检查缓存大小限制 */
  private void checkCacheSizeLimit() {
    if (FONT_CACHE.size() >= fontConfig.getCacheSize()) {
      logger.warn(
          "Font cache size limit reached ({}), clearing oldest entries", fontConfig.getCacheSize());
      // 简单的清理策略：清空所有缓存
      // 更复杂的策略可以使用LRU缓存
      clearCache();
    }
  }

  /** 获取缓存统计信息 */
  public Map<String, Object> getCacheStats() {
    Runtime runtime = Runtime.getRuntime();
    Map<String, Object> stats = new ConcurrentHashMap<>();
    stats.put("cachedFonts", FONT_CACHE.size());
    stats.put("freeMemory", runtime.freeMemory() / 1024 / 1024);
    stats.put("totalMemory", runtime.totalMemory() / 1024 / 1024);
    stats.put("maxMemory", runtime.maxMemory() / 1024 / 1024);
    stats.put("cachedFontNames", FONT_CACHE.keySet());
    return stats;
  }

  /** 预加载一个支持中文的字体 */
  public void preloadCommonFonts() {
    logger.info("Preloading common fonts");
    String[] commonFonts = {"noto-sans-sc", "noto-sans-sc-bd"};

    for (String fontName : commonFonts) {
      try {
        getFont(fontName);
        logger.info("Preloaded font: {}", fontName);
      } catch (Exception e) {
        logger.warn("Failed to preload font: {}", fontName, e);
      }
    }
  }
}
