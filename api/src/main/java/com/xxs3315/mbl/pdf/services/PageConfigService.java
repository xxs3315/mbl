package com.xxs3315.mbl.pdf.services;

import com.helger.pdflayout.base.PLPageSet;
import com.helger.pdflayout.spec.PreloadFont;
import java.util.Map;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PageConfigService {

  @Autowired private FontService fontService;

  /** 解析页面配置 */
  public PageConfig parsePageConfig(Map<String, Object> propsMap) {
    // 解析页面尺寸和方向
    String orientation = String.valueOf(propsMap.get("orientation"));
    String rectangleStr = String.valueOf(propsMap.get("rectangle"));
    PDRectangle rectangle = getPDRectangle(rectangleStr);

    float width = rectangle.getWidth();
    float height = rectangle.getHeight();

    if ("landscape".equals(orientation)) {
      width = rectangle.getHeight();
      height = rectangle.getWidth();
    }

    // 解析边距
    float marginTop = Float.parseFloat(String.valueOf(propsMap.get("mTop")));
    float marginRight = Float.parseFloat(String.valueOf(propsMap.get("mRight")));
    float marginBottom = Float.parseFloat(String.valueOf(propsMap.get("mBottom")));
    float marginLeft = Float.parseFloat(String.valueOf(propsMap.get("mLeft")));

    // 解析内边距
    float paddingTop = Float.parseFloat(String.valueOf(propsMap.get("mTopBody")));
    float paddingRight = Float.parseFloat(String.valueOf(propsMap.get("mRightBody")));
    float paddingBottom = Float.parseFloat(String.valueOf(propsMap.get("mBottomBody")));
    float paddingLeft = Float.parseFloat(String.valueOf(propsMap.get("mLeftBody")));

    // 解析页眉边距
    float marginTopHeader = Float.parseFloat(String.valueOf(propsMap.get("mTopHeader")));
    float marginRightHeader = Float.parseFloat(String.valueOf(propsMap.get("mRightHeader")));
    float marginBottomHeader = Float.parseFloat(String.valueOf(propsMap.get("mBottomHeader")));
    float marginLeftHeader = Float.parseFloat(String.valueOf(propsMap.get("mLeftHeader")));

    // 解析页脚边距
    float marginTopFooter = Float.parseFloat(String.valueOf(propsMap.get("mTopFooter")));
    float marginRightFooter = Float.parseFloat(String.valueOf(propsMap.get("mRightFooter")));
    float marginBottomFooter = Float.parseFloat(String.valueOf(propsMap.get("mBottomFooter")));
    float marginLeftFooter = Float.parseFloat(String.valueOf(propsMap.get("mLeftFooter")));

    // 解析其他配置
    boolean hideHeaderOnFirstPage =
        Boolean.parseBoolean(String.valueOf(propsMap.get("hideHeaderOnFirstPage")));
    boolean hideFooterOnFirstPage =
        Boolean.parseBoolean(String.valueOf(propsMap.get("hideFooterOnFirstPage")));

    String defaultFontName = String.valueOf(propsMap.get("defaultPageRootFont"));
    PreloadFont defaultFont = fontService.getFont(defaultFontName);
    String defaultFontSize = String.valueOf(propsMap.get("defaultPageRootFontSize"));
    String defaultFontColor = String.valueOf(propsMap.get("defaultPageRootFontColor"));
    String defaultBackground = String.valueOf(propsMap.get("defaultPageRootBackgroundColor"));

    return new PageConfig(
        rectangle,
        width,
        height,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        marginTopHeader,
        marginRightHeader,
        marginBottomHeader,
        marginLeftHeader,
        marginTopFooter,
        marginRightFooter,
        marginBottomFooter,
        marginLeftFooter,
        hideHeaderOnFirstPage,
        hideFooterOnFirstPage,
        defaultFont,
        defaultFontSize,
        defaultFontColor,
        defaultBackground);
  }

  /** 创建页面设置 */
  public PLPageSet createPageSet(PageConfig config) {
    return new PLPageSet(config.getWidth(), config.getHeight())
        .setMargin(
            config.getMarginTop(),
            config.getMarginRight(),
            config.getMarginBottom(),
            config.getMarginLeft())
        .setPadding(
            config.getPaddingTop(),
            config.getPaddingRight(),
            config.getPaddingBottom(),
            config.getPaddingLeft());
  }

  /** 根据字符串获取PDRectangle */
  private PDRectangle getPDRectangle(String rectangleStr) {
    return switch (rectangleStr) {
      case "LETTER" -> PDRectangle.LETTER;
      case "TABLOID" -> PDRectangle.TABLOID;
      case "LEGAL" -> PDRectangle.LEGAL;
      case "A0" -> PDRectangle.A0;
      case "A1" -> PDRectangle.A1;
      case "A2" -> PDRectangle.A2;
      case "A3" -> PDRectangle.A3;
      case "A5" -> PDRectangle.A5;
      case "A6" -> PDRectangle.A6;
      default -> PDRectangle.A4;
    };
  }

  /** 页面配置数据类 */
  public static class PageConfig {
    private final PDRectangle rectangle;
    private final float width;
    private final float height;
    private final float marginTop;
    private final float marginRight;
    private final float marginBottom;
    private final float marginLeft;
    private final float paddingTop;
    private final float paddingRight;
    private final float paddingBottom;
    private final float paddingLeft;
    private final float marginTopHeader;
    private final float marginRightHeader;
    private final float marginBottomHeader;
    private final float marginLeftHeader;
    private final float marginTopFooter;
    private final float marginRightFooter;
    private final float marginBottomFooter;
    private final float marginLeftFooter;
    private final boolean hideHeaderOnFirstPage;
    private final boolean hideFooterOnFirstPage;
    private final PreloadFont defaultFont;
    private final String defaultFontSize;
    private final String defaultFontColor;
    private final String defaultBackground;

    public PageConfig(
        PDRectangle rectangle,
        float width,
        float height,
        float marginTop,
        float marginRight,
        float marginBottom,
        float marginLeft,
        float paddingTop,
        float paddingRight,
        float paddingBottom,
        float paddingLeft,
        float marginTopHeader,
        float marginRightHeader,
        float marginBottomHeader,
        float marginLeftHeader,
        float marginTopFooter,
        float marginRightFooter,
        float marginBottomFooter,
        float marginLeftFooter,
        boolean hideHeaderOnFirstPage,
        boolean hideFooterOnFirstPage,
        PreloadFont defaultFont,
        String defaultFontSize,
        String defaultFontColor,
        String defaultBackground) {
      this.rectangle = rectangle;
      this.width = width;
      this.height = height;
      this.marginTop = marginTop;
      this.marginRight = marginRight;
      this.marginBottom = marginBottom;
      this.marginLeft = marginLeft;
      this.paddingTop = paddingTop;
      this.paddingRight = paddingRight;
      this.paddingBottom = paddingBottom;
      this.paddingLeft = paddingLeft;
      this.marginTopHeader = marginTopHeader;
      this.marginRightHeader = marginRightHeader;
      this.marginBottomHeader = marginBottomHeader;
      this.marginLeftHeader = marginLeftHeader;
      this.marginTopFooter = marginTopFooter;
      this.marginRightFooter = marginRightFooter;
      this.marginBottomFooter = marginBottomFooter;
      this.marginLeftFooter = marginLeftFooter;
      this.hideHeaderOnFirstPage = hideHeaderOnFirstPage;
      this.hideFooterOnFirstPage = hideFooterOnFirstPage;
      this.defaultFont = defaultFont;
      this.defaultFontSize = defaultFontSize;
      this.defaultFontColor = defaultFontColor;
      this.defaultBackground = defaultBackground;
    }

    // Getters
    public PDRectangle getRectangle() {
      return rectangle;
    }

    public float getWidth() {
      return width;
    }

    public float getHeight() {
      return height;
    }

    public float getMarginTop() {
      return marginTop;
    }

    public float getMarginRight() {
      return marginRight;
    }

    public float getMarginBottom() {
      return marginBottom;
    }

    public float getMarginLeft() {
      return marginLeft;
    }

    public float getPaddingTop() {
      return paddingTop;
    }

    public float getPaddingRight() {
      return paddingRight;
    }

    public float getPaddingBottom() {
      return paddingBottom;
    }

    public float getPaddingLeft() {
      return paddingLeft;
    }

    public float getMarginTopHeader() {
      return marginTopHeader;
    }

    public float getMarginRightHeader() {
      return marginRightHeader;
    }

    public float getMarginBottomHeader() {
      return marginBottomHeader;
    }

    public float getMarginLeftHeader() {
      return marginLeftHeader;
    }

    public float getMarginTopFooter() {
      return marginTopFooter;
    }

    public float getMarginRightFooter() {
      return marginRightFooter;
    }

    public float getMarginBottomFooter() {
      return marginBottomFooter;
    }

    public float getMarginLeftFooter() {
      return marginLeftFooter;
    }

    public boolean isHideHeaderOnFirstPage() {
      return hideHeaderOnFirstPage;
    }

    public boolean isHideFooterOnFirstPage() {
      return hideFooterOnFirstPage;
    }

    public PreloadFont getDefaultFont() {
      return defaultFont;
    }

    public String getDefaultFontSize() {
      return defaultFontSize;
    }

    public String getDefaultFontColor() {
      return defaultFontColor;
    }

    public String getDefaultBackground() {
      return defaultBackground;
    }
  }
}
