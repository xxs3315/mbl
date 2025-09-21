package com.xxs3315.mbl.pdf.services;

import com.helger.pdflayout.base.EPLPlaceholder;
import com.helger.pdflayout.base.PLColor;
import com.helger.pdflayout.element.text.PLText;
import com.helger.pdflayout.spec.EHorzAlignment;
import com.helger.pdflayout.spec.EVertAlignment;
import com.helger.pdflayout.spec.FontSpec;
import com.helger.pdflayout.spec.PreloadFont;
import java.awt.Color;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class StyleService {

  /** 从十六进制颜色字符串创建PLColor */
  public PLColor createColorFromHex(String hexColor) {
    if (StringUtils.isBlank(hexColor) || "#00000000".equals(hexColor)) {
      return null;
    }
    Color rgb = Color.decode(hexColor);
    return new PLColor(rgb.getRed(), rgb.getGreen(), rgb.getBlue());
  }

  /** 获取水平对齐方式 */
  public EHorzAlignment getHorizontalAlignment(Map<String, Object> elementMap) {
    if (!elementMap.containsKey("horizontal")) {
      return EHorzAlignment.CENTER;
    }

    String alignment = (String) elementMap.get("horizontal");
    return switch (alignment) {
      case "left" -> EHorzAlignment.LEFT;
      case "right" -> EHorzAlignment.RIGHT;
      default -> EHorzAlignment.CENTER;
    };
  }

  /** 获取垂直对齐方式 */
  public EVertAlignment getVerticalAlignment(Map<String, Object> elementMap) {
    if (!elementMap.containsKey("vertical")) {
      return EVertAlignment.MIDDLE;
    }

    String alignment = (String) elementMap.get("vertical");
    return switch (alignment) {
      case "top" -> EVertAlignment.TOP;
      case "bottom" -> EVertAlignment.BOTTOM;
      default -> EVertAlignment.MIDDLE;
    };
  }

  /** 创建字体规格 */
  public FontSpec createFontSpec(PreloadFont font, float fontSize, PLColor color) {
    return new FontSpec(font, fontSize).getCloneWithDifferentColor(color);
  }

  /** 处理页码占位符 */
  public String processPageNumberPlaceholders(String value) {
    if (StringUtils.isBlank(value)) {
      return "";
    }

    String processedValue = value;
    if (processedValue.contains("${PAGE_NUMBER}")) {
      processedValue =
          StringUtils.replace(
              processedValue, "${PAGE_NUMBER}", EPLPlaceholder.TOTAL_PAGE_NUMBER.getVariable());
    }
    if (processedValue.contains("${PAGE_INDEX}")) {
      processedValue =
          StringUtils.replace(
              processedValue, "${PAGE_INDEX}", EPLPlaceholder.TOTAL_PAGE_INDEX.getVariable());
    }
    if (processedValue.contains("${PAGE_COUNT}")) {
      processedValue =
          StringUtils.replace(
              processedValue, "${PAGE_COUNT}", EPLPlaceholder.TOTAL_PAGE_COUNT.getVariable());
    }

    return processedValue;
  }

  /** 获取表格间距 */
  public float getTableGap(Object gap) {
    if (gap == null) {
      return 6f;
    }

    String gapStr = String.valueOf(gap);
    return switch (gapStr) {
      case "compact" -> 2f;
      case "loose" -> 10f;
      default -> 6f;
    };
  }

  /** 应用样式到文本元素 */
  public void applyTextStyle(
      PLText text,
      Map<String, Object> elementMap,
      String defaultFontColor,
      String defaultBackground) {
    // 应用背景色
    PLColor bgColor = null;
    if (elementMap.containsKey("background")) {
      bgColor = createColorFromHex((String) elementMap.get("background"));
    } else if (!"#00000000".equals(defaultBackground)) {
      bgColor = createColorFromHex(defaultBackground);
    }

    if (bgColor != null) {
      text.setFillColor(bgColor);
    }
  }
}
