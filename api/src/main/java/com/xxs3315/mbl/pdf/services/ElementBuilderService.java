package com.xxs3315.mbl.pdf.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.helger.pdflayout.base.IPLRenderableObject;
import com.helger.pdflayout.base.PLColor;
import com.helger.pdflayout.element.box.PLBox;
import com.helger.pdflayout.element.image.PLImage;
import com.helger.pdflayout.element.special.PLPageBreak;
import com.helger.pdflayout.element.table.PLTableCell;
import com.helger.pdflayout.element.text.PLText;
import com.helger.pdflayout.spec.EHorzAlignment;
import com.helger.pdflayout.spec.PreloadFont;
import com.xxs3315.mbl.service.ImageService;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.nio.file.Path;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import javax.imageio.ImageIO;
import net.arnx.jsonic.JSON;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

@Service
public class ElementBuilderService {

  private static final Logger logger = LoggerFactory.getLogger(ElementBuilderService.class);

  @Autowired private FontService fontService;

  @Autowired private StyleService styleService;

  @Autowired private ImageService imageService;

  /** 构建文本元素 */
  public PLText buildTextElement(
      EHorzAlignment alignment,
      Map<String, Object> elementMap,
      PreloadFont defaultFont,
      String defaultFontSize,
      String defaultFontColor,
      String defaultBackground) {

    // 获取字体和颜色
    PreloadFont font = defaultFont;
    if (elementMap.containsKey("font")) {
      String bold = elementMap.containsKey("bold") && (Boolean) elementMap.get("bold") ? "-bd" : "";
      font = fontService.getFont(elementMap.get("font") + bold);
    }

    PLColor color = styleService.createColorFromHex(defaultFontColor);
    if (elementMap.containsKey("fontColor")) {
      color = styleService.createColorFromHex((String) elementMap.get("fontColor"));
    }

    // 获取字体大小
    float fontSize = Float.parseFloat(defaultFontSize);
    if (elementMap.containsKey("fontSize")) {
      fontSize = ((Double) elementMap.get("fontSize")).floatValue();
    }

    // 获取文本内容
    String value = elementMap.get("value") == null ? "" : (String) elementMap.get("value");
    if (elementMap.containsKey("bindings")) {
      Object bindingsObj = elementMap.get("bindings");
      if (bindingsObj instanceof Iterable) {
        for (Object bindingObj : (Iterable<?>) bindingsObj) {
          if (!(bindingObj instanceof Map)) continue;
          Map<String, Object> binding = (Map<String, Object>) bindingObj;
          String bind = (String) binding.get("bind");
          String name = (String) binding.get("name");
          String shape = (String) binding.get("shape");
          String request = (String) binding.get("request");
          String bindingValue = (String) binding.get("value");

          Map info = null;
          // shape/request/value 逻辑判断
          if ("object".equals(shape)) {
            if ("data".equals(request)) {
              // value 是 json 字符串
              Gson gson = new GsonBuilder().setLenient().create();
              Type mapType = new TypeToken<Map>() {}.getType();
              String strictValue = JSON.encode(JSON.decode(bindingValue));
              info = gson.fromJson(strictValue, mapType);
            } else if ("url".equals(request)) {
              // value 是 url
              info = getJsonMap(bindingValue);
            }
          }

          // 处理 info（Map），比如放到 elementMap 里，或者其他逻辑
          if (info != null && name != null) {
            // 使用 commons-text 的 StringSubstitutor 进行模板替换
            // 需要在类文件顶部 import org.apache.commons.text.StringSubstitutor;
            org.apache.commons.text.StringSubstitutor substitutor =
                new org.apache.commons.text.StringSubstitutor(info);
            value = substitutor.replace(value);
          }
        }
      }
    }
    if (elementMap.containsKey("indent") && (Boolean) elementMap.get("indent")) {
      value = "  " + value;
    }

    // 创建文本元素
    PLText text =
        new PLText(value, styleService.createFontSpec(font, fontSize, color))
            .setHorzAlign(alignment);

    // 应用样式
    styleService.applyTextStyle(text, elementMap, defaultFontColor, defaultBackground);

    return text;
  }

  private Map getJsonMap(String url) {
    OkHttpClient client =
        new OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build();
    Gson gson = new GsonBuilder().setLenient().create();
    Request request = new Request.Builder().url(url).get().build();

    try (Response response = client.newCall(request).execute()) {
      if (!response.isSuccessful()) {
        logger.error("请求失败: {}, {}", url, response);
        return new HashMap();
      }

      // 获取 JSON 字符串
      String json = response.body().string();

      // 解析为 Map 类型
      String strictJson = JSON.encode(JSON.decode(json));
      return gson.fromJson(strictJson, new TypeToken<Map>() {}.getType());
    } catch (Exception e) {
      logger.error("请求异常: {}", e.getMessage(), e);
      return new HashMap();
    }
  }

  /** 构建图片元素 */
  public PLImage buildImageElement(Map<String, Object> elementMap) throws IOException {
    if (!elementMap.containsKey("value") || elementMap.get("value") == null) {
      return null;
    }

    String imageValue = elementMap.get("value").toString();
    InputStream imageStream = null;

    // 情况1: 处理 base64 图片
    if (imageValue.startsWith("data:image/")) {
      imageStream = handleBase64Image(imageValue);
    }
    // 情况2: 处理 URL 链接图片
    else if (imageValue.startsWith("http://") || imageValue.startsWith("https://") || imageValue.contains("/api/images/")) {
      imageStream = handleUrlImage(imageValue);
    }
    // 其他情况，使用空白图片作为默认值
    else {
      imageStream = createBlankImage();
    }

    // 获取宽度和高度参数
    float width = getFloatValue(elementMap, "width", 100f);
    float height = getFloatValue(elementMap, "height", 100f);

    // 创建 PLImage
    return new PLImage(ImageIO.read(imageStream), width, height);
  }

  /**
   * 处理 base64 格式的图片
   */
  private InputStream handleBase64Image(String base64Value) {
    try {
      String base64 = base64Value.split(",")[1];
      return new ByteArrayInputStream(Base64.getDecoder().decode(base64));
    } catch (Exception e) {
      System.err.println("处理 base64 图片失败: " + e.getMessage());
      return createBlankImage();
    }
  }

  /**
   * 处理 URL 链接的图片
   */
  private InputStream handleUrlImage(String imageUrl) {
    try {
      // 如果是本地 API 图片路径
      if (imageUrl.contains("/api/images/")) {
        return handleLocalApiImage(imageUrl);
      }
      // 如果是外部 HTTP/HTTPS 链接
      else if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return handleExternalImage(imageUrl);
      }
    } catch (Exception e) {
      System.err.println("处理 URL 图片失败: " + e.getMessage());
    }
    return createBlankImage();
  }

  /**
   * 处理本地 API 图片路径
   */
  private InputStream handleLocalApiImage(String imageUrl) throws Exception {
    String imageFileName = imageUrl.split("/api/images/")[1];
    Path filePath = Path.of(imageService.getImageFileInfo(imageFileName).getPath());
    Resource resource = new UrlResource(filePath.toUri());

    if (resource.exists() && resource.isReadable()) {
      return resource.getInputStream();
    }
    throw new IOException("本地图片文件不存在或不可读: " + imageUrl);
  }

  /**
   * 处理外部 HTTP/HTTPS 图片链接
   */
  private InputStream handleExternalImage(String imageUrl) throws Exception {
    // 这里可以添加对外部图片的处理逻辑
    // 例如使用 OkHttp 或其他 HTTP 客户端下载图片
    throw new UnsupportedOperationException("外部图片链接处理功能待实现: " + imageUrl);
  }

  /**
   * 创建空白图片作为默认值
   */
  private InputStream createBlankImage() {
    try {
      BufferedImage blankImage = new BufferedImage(10, 10, BufferedImage.TYPE_INT_RGB);
      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      ImageIO.write(blankImage, "PNG", baos);
      return new ByteArrayInputStream(baos.toByteArray());
    } catch (IOException e) {
      System.err.println("创建空白图片失败: " + e.getMessage());
      return new ByteArrayInputStream(new byte[0]);
    }
  }

  /**
   * 从 Map 中获取浮点数值，如果不存在则返回默认值
   */
  private float getFloatValue(Map<String, Object> elementMap, String key, float defaultValue) {
    if (elementMap.containsKey(key) && elementMap.get(key) != null) {
      Object value = elementMap.get(key);
      if (value instanceof Double) {
        return ((Double) value).floatValue();
      } else if (value instanceof Float) {
        return (Float) value;
      } else if (value instanceof Number) {
        return ((Number) value).floatValue();
      }
    }
    return defaultValue;
  }

  /** 构建占位符元素 */
  public PLBox buildPlaceholderElement(
      Map<String, Object> elementMap,
      float paddingTop,
      float paddingRight,
      float paddingBottom,
      float paddingLeft) {
    float width = 100f;
    if (elementMap.containsKey("width") && elementMap.get("width") != null) {
      width = ((Double) elementMap.get("width")).floatValue();
    }

    float height = 100f;
    if (elementMap.containsKey("height") && elementMap.get("height") != null) {
      height = ((Double) elementMap.get("height")).floatValue();
    }

    PLBox placeholderBox = new PLBox().setExactWidth(width).setExactHeight(height);

    if (elementMap.containsKey("background")) {
      PLColor bgColor = styleService.createColorFromHex((String) elementMap.get("background"));
      if (bgColor != null) {
        placeholderBox.setFillColor(bgColor);
      }
    }

    return placeholderBox.setMargin(paddingTop, paddingRight, paddingBottom, paddingLeft);
  }

  /** 构建页码元素 */
  public PLText buildPageNumberElement(
      Map<String, Object> elementMap,
      PreloadFont defaultFont,
      String defaultFontSize,
      String defaultFontColor,
      String defaultBackground) {

    // 获取字体
    PreloadFont font = defaultFont;
    if (elementMap.containsKey("font")) {
      font = fontService.getFont((String) elementMap.get("font"));
    }

    // 获取颜色
    PLColor color = styleService.createColorFromHex(defaultFontColor);
    if (elementMap.containsKey("fontColor")) {
      color = styleService.createColorFromHex((String) elementMap.get("fontColor"));
    }

    // 获取字体大小
    float fontSize = Float.parseFloat(defaultFontSize);
    if (elementMap.containsKey("fontSize")) {
      fontSize = ((Double) elementMap.get("fontSize")).floatValue();
    }

    // 获取文本内容并处理占位符
    String value = elementMap.get("value") == null ? "" : (String) elementMap.get("value");
    value = styleService.processPageNumberPlaceholders(value);

    // 创建文本元素
    PLText text =
        new PLText(value, styleService.createFontSpec(font, fontSize, color))
            .setReplacePlaceholder(true);

    // 应用样式
    styleService.applyTextStyle(text, elementMap, defaultFontColor, defaultBackground);

    return text;
  }

  /** 构建表格单元格 */
  public PLTableCell buildTableCell(
      IPLRenderableObject<?> content,
      EHorzAlignment alignment,
      float paddingTop,
      float paddingRight,
      float paddingBottom,
      float paddingLeft) {
    return new PLTableCell(content)
        .setHorzAlign(alignment)
        .setPadding(paddingTop, paddingRight, paddingBottom, paddingLeft);
  }

  /** 构建页面分隔符 */
  public PLPageBreak buildPageBreak() {
    return new PLPageBreak(true);
  }

  /** 获取元素的内边距 */
  public float[] getElementPadding(Map<String, Object> elementMap) {
    float pTop = 0f, pRight = 0f, pBottom = 0f, pLeft = 0f;

    if (elementMap.containsKey("pTop")) {
      pTop = Double.valueOf(String.valueOf(elementMap.get("pTop"))).floatValue();
    }
    if (elementMap.containsKey("pRight")) {
      pRight = Double.valueOf(String.valueOf(elementMap.get("pRight"))).floatValue();
    }
    if (elementMap.containsKey("pBottom")) {
      pBottom = Double.valueOf(String.valueOf(elementMap.get("pBottom"))).floatValue();
    }
    if (elementMap.containsKey("pLeft")) {
      pLeft = Double.valueOf(String.valueOf(elementMap.get("pLeft"))).floatValue();
    }

    return new float[] {pTop, pRight, pBottom, pLeft};
  }
}
