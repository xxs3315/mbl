package com.xxs3315.mbl.pdf.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.helger.pdflayout.base.IPLRenderableObject;
import com.helger.pdflayout.base.PLColor;
import com.helger.pdflayout.element.box.PLBox;
import com.helger.pdflayout.element.image.PLImage;
import com.helger.pdflayout.element.link.PLExternalLink;
import com.helger.pdflayout.element.table.EPLTableGridType;
import com.helger.pdflayout.element.table.PLTable;
import com.helger.pdflayout.element.table.PLTableCell;
import com.helger.pdflayout.element.text.PLText;
import com.helger.pdflayout.element.vbox.PLVBox;
import com.helger.pdflayout.spec.*;
import com.xxs3315.mbl.pdf.properties.PdfMakerProperties;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.util.*;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.TimeUnit;
import javax.imageio.ImageIO;
import net.arnx.jsonic.JSON;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PageContentBuilderService {

  private static final Logger logger = LoggerFactory.getLogger(PageContentBuilderService.class);

  @Autowired private ElementBuilderService elementBuilderService;

  @Autowired private StyleService styleService;

  @Autowired private FontService fontService;

  @Autowired private PdfMakerProperties pdfMakerProperties;

  /** 构建页面头部 */
  public PLVBox buildPageHeader(
      List<Object> pageHeaderContent,
      PageConfigService.PageConfig config,
      Map<String, IPLRenderableObject<?>> generatedObjects,
      boolean isGenerated)
      throws IOException {
    PLVBox pageHeader = new PLVBox().setID("pageheader");

    Map<String, Map<String, Object>> pageHeaderMap = convertListToMap(pageHeaderContent);
    String key = "page-header-root";
    Map<String, Object> value = pageHeaderMap.get(key);

    if (value != null
        && value.containsKey("children")
        && !((List<?>) value.get("children")).isEmpty()) {
      List<String> children = (List<String>) value.get("children");
      if (!children.isEmpty()) {
        List<IPLRenderableObject<?>> rows =
            buildContentRows(
                children,
                pageHeaderMap,
                config,
                false,
                null,
                null,
                null,
                generatedObjects,
                null,
                null,
                isGenerated);

        for (IPLRenderableObject<?> row : rows) {
          pageHeader.addRow(row);
        }

        // 设置边距
        if (pageHeader.getFirstRowElement() != null) {
          ((PLTable) pageHeader.getFirstRowElement()).setMarginTop(config.getMarginTopHeader());
        }
        if (pageHeader.getLastRowElement() != null) {
          ((PLTable) pageHeader.getLastRowElement())
              .setMarginBottom(config.getMarginBottomHeader());
        }

        // 添加分隔线
        PLTable dividerLine = new PLTable(WidthSpec.star());
        dividerLine.addRow(
            new PLTableCell(new PLText("", new FontSpec(PreloadFont.REGULAR, 1)))
                .setBorderBottom(new BorderStyleSpec(PLColor.BLACK, 1f)));
        pageHeader.addRow(dividerLine);
      }
    }

    return pageHeader;
  }

  /** 构建页面底部 */
  public PLVBox buildPageFooter(
      List<Object> pageFooterContent,
      PageConfigService.PageConfig config,
      Map<String, IPLRenderableObject<?>> generatedObjects,
      boolean isGenerated)
      throws IOException {
    PLVBox pageFooter = new PLVBox().setID("pagefooter");

    Map<String, Map<String, Object>> pageFooterMap = convertListToMap(pageFooterContent);
    String key = "page-footer-root";
    Map<String, Object> value = pageFooterMap.get(key);

    if (value != null
        && value.containsKey("children")
        && !((List<?>) value.get("children")).isEmpty()) {
      List<String> children = (List<String>) value.get("children");
      if (!children.isEmpty()) {
        // 添加分隔线
        PLTable dividerLine = new PLTable(WidthSpec.star());
        dividerLine.addRow(
            new PLTableCell(new PLText("", new FontSpec(PreloadFont.REGULAR, 1)))
                .setBorderTop(new BorderStyleSpec(PLColor.BLACK, 1f)));
        pageFooter.addRow(dividerLine);

        List<IPLRenderableObject<?>> rows =
            buildContentRows(
                children,
                pageFooterMap,
                config,
                false,
                null,
                null,
                null,
                generatedObjects,
                null,
                null,
                isGenerated);

        for (IPLRenderableObject<?> row : rows) {
          pageFooter.addRow(row);
        }

        // 设置边距
        if (pageFooter.getFirstRowElement() != null) {
          ((PLTable) pageFooter.getFirstRowElement()).setMarginTop(config.getMarginTopFooter());
        }
        if (pageFooter.getLastRowElement() != null) {
          ((PLTable) pageFooter.getLastRowElement())
              .setMarginBottom(config.getMarginBottomFooter());
        }
      }
    }

    return pageFooter;
  }

  /** 构建页面主体 */
  public List<IPLRenderableObject<?>> buildPageBody(
      List<Object> pageBodyContent,
      PageConfigService.PageConfig config,
      Map<String, IPLRenderableObject<?>> generatedObjects,
      boolean isGenerated)
      throws IOException {
    Map<String, Map<String, Object>> pageBodyMap = convertListToMap(pageBodyContent);
    String key = "page-body-root";
    Map<String, Object> value = pageBodyMap.get(key);

    if (value != null
        && value.containsKey("children")
        && !((List<?>) value.get("children")).isEmpty()) {
      List<String> children = (List<String>) value.get("children");
      if (!children.isEmpty()) {
        return buildContentRows(
            children,
            pageBodyMap,
            config,
            false,
            null,
            null,
            null,
            generatedObjects,
            null,
            null,
            isGenerated);
      }
    }

    return new ArrayList<>();
  }

  /** 构建内容行 */
  private List<IPLRenderableObject<?>> buildContentRows(
      List<String> keys,
      Map<String, Map<String, Object>> contentMap,
      PageConfigService.PageConfig config,
      boolean isTable,
      EPLTableGridType gridType,
      BorderStyleSpec borderStyleSpec,
      String gap,
      Map<String, IPLRenderableObject<?>> generatedObjects,
      String parentContainerType, // 新增
      String tableId, // 新增
      boolean isGenerated)
      throws IOException {
    List<IPLRenderableObject<?>> rows = new LinkedList<>();

    for (String key : keys) {
      Map<String, Object> elementMap = contentMap.get(key);
      String category = (String) elementMap.get("cat");

      switch (category) {
        case "container":
          rows.addAll(
              buildContainerElement(
                  elementMap,
                  contentMap,
                  config,
                  isTable,
                  gridType,
                  borderStyleSpec,
                  gap,
                  generatedObjects,
                  parentContainerType,
                  tableId,
                  isGenerated));
          break;
        case "text":
          if (isTable) {
            IPLRenderableObject<?> tableTextElement =
                buildTableTextElement(elementMap, config, gap);
            rows.add(tableTextElement);
            if (generatedObjects != null
                && !isGenerated
                && elementMap.containsKey("id")
                && "horizontal".equals(parentContainerType)) {
              generatedObjects.put(tableId + "-" + elementMap.get("id"), tableTextElement);
              generatedObjects.put(tableId + "-full-" + elementMap.get("id"), tableTextElement);
            }
            if (generatedObjects != null
                && !isGenerated
                && elementMap.containsKey("id")
                && "vertical".equals(parentContainerType)) {
              generatedObjects.put(tableId + "-full-" + elementMap.get("id"), tableTextElement);
            }
          } else {
            IPLRenderableObject<?> textElement = buildTextElement(elementMap, config);
            rows.add(textElement);
            //            if (generatedObjects != null && elementMap.containsKey("id")) {
            //              generatedObjects.put((String) elementMap.get("id"), textElement);
            //            }
          }
          break;
        case "image":
          IPLRenderableObject<?> imageElement = buildImageElement(elementMap, config);
          rows.add(imageElement);
          //          if (generatedObjects != null && elementMap.containsKey("id")) {
          //            generatedObjects.put((String) elementMap.get("id"), imageElement);
          //          }
          break;
        case "placeholder":
          IPLRenderableObject<?> placeholderElement = buildPlaceholderElement(elementMap, config);
          rows.add(placeholderElement);
          //          if (generatedObjects != null && elementMap.containsKey("id")) {
          //            generatedObjects.put((String) elementMap.get("id"), placeholderElement);
          //          }
          break;
        case "page-break":
          IPLRenderableObject<?> pageBreakElement = elementBuilderService.buildPageBreak();
          rows.add(pageBreakElement);
          //          if (generatedObjects != null && elementMap.containsKey("id")) {
          //            generatedObjects.put((String) elementMap.get("id"), pageBreakElement);
          //          }
          break;
        case "page-number":
          IPLRenderableObject<?> pageNumberElement = buildPageNumberElement(elementMap, config);
          rows.add(pageNumberElement);
          //          if (generatedObjects != null && elementMap.containsKey("id")) {
          //            generatedObjects.put((String) elementMap.get("id"), pageNumberElement);
          //          }
          break;
        case "plugin-table":
          IPLRenderableObject<?> tableElement =
              buildTableElement(elementMap, contentMap, config, generatedObjects, isGenerated);
          rows.add(tableElement);
          if (generatedObjects != null && !isGenerated && elementMap.containsKey("id")) {
            generatedObjects.put("table-" + elementMap.get("id"), tableElement);
          }
          break;
      }
    }

    return rows;
  }

  /** 构建容器元素 */
  private List<IPLRenderableObject<?>> buildContainerElement(
      Map<String, Object> elementMap,
      Map<String, Map<String, Object>> contentMap,
      PageConfigService.PageConfig config,
      boolean isTable,
      EPLTableGridType gridType,
      BorderStyleSpec borderStyleSpec,
      String gap,
      Map<String, IPLRenderableObject<?>> generatedObjects,
      String parentContainerType, // 新增
      String tableId, // 新增
      boolean isGenerated)
      throws IOException {
    List<String> children = (List<String>) elementMap.get("children");
    String direction = (String) elementMap.get("direction");

    if (children.isEmpty()) {
      return new ArrayList<>();
    }

    if ("vertical".equals(direction)) {
      return buildVerticalContainer(
          children,
          contentMap,
          config,
          isTable,
          gridType,
          borderStyleSpec,
          gap,
          generatedObjects,
          "vertical",
          tableId,
          isGenerated);
    } else if ("horizontal".equals(direction)) {
      return buildHorizontalContainer(
          children,
          contentMap,
          config,
          elementMap,
          isTable,
          gridType,
          borderStyleSpec,
          gap,
          generatedObjects,
          "horizontal",
          tableId,
          isGenerated);
    }

    return new ArrayList<>();
  }

  /** 构建垂直容器 */
  private List<IPLRenderableObject<?>> buildVerticalContainer(
      List<String> children,
      Map<String, Map<String, Object>> contentMap,
      PageConfigService.PageConfig config,
      boolean isTable,
      EPLTableGridType gridType,
      BorderStyleSpec borderStyleSpec,
      String gap,
      Map<String, IPLRenderableObject<?>> generatedObjects,
      String parentContainerType, // 新增
      String tableId, // 新增
      boolean isGenerated)
      throws IOException {
    List<IPLRenderableObject<?>> subRows =
        buildContentRows(
            children,
            contentMap,
            config,
            isTable,
            gridType,
            borderStyleSpec,
            gap,
            generatedObjects,
            parentContainerType,
            tableId,
            isGenerated);
    PLTable rowTable = new PLTable(WidthSpec.star());

    for (IPLRenderableObject<?> subRow : subRows) {
      rowTable.addRow(new PLTableCell(subRow));
    }

    if (isTable) {
      gridType.applyGridToTable(rowTable, borderStyleSpec);
    }

    return List.of(rowTable);
  }

  /** 构建水平容器 */
  private List<IPLRenderableObject<?>> buildHorizontalContainer(
      List<String> children,
      Map<String, Map<String, Object>> contentMap,
      PageConfigService.PageConfig config,
      Map<String, Object> elementMap,
      boolean isTable,
      EPLTableGridType gridType,
      BorderStyleSpec borderStyleSpec,
      String gap,
      Map<String, IPLRenderableObject<?>> generatedObjects,
      String parentContainerType, // 新增
      String tableId, // 新增
      boolean isGenerated)
      throws IOException {
    WidthSpec[] widthSpecs = new WidthSpec[children.size()];

    for (int i = 0; i < children.size(); i++) {
      Map<String, Object> childMap = contentMap.get(children.get(i));
      boolean wildStar = (Boolean) childMap.get("wildStar");
      float flexValue = ((Double) childMap.get("flexValue")).floatValue();
      String flexUnit = (String) childMap.get("flexUnit");

      widthSpecs[i] =
          wildStar
              ? WidthSpec.star()
              : ("%".equals(flexUnit) ? WidthSpec.perc(flexValue) : WidthSpec.abs(flexValue));
    }

    PLTable rowTable = new PLTable(widthSpecs);
    EVertAlignment alignmentVertical = styleService.getVerticalAlignment(elementMap);

    List<IPLRenderableObject<?>> subCols =
        buildContentRows(
            children,
            contentMap,
            config,
            isTable,
            gridType,
            borderStyleSpec,
            gap,
            generatedObjects,
            parentContainerType,
            tableId,
            isGenerated);
    PLTableCell[] cells = new PLTableCell[subCols.size()];

    for (int i = 0; i < subCols.size(); i++) {
      cells[i] = new PLTableCell(subCols.get(i)).setVertAlign(alignmentVertical);
      if (contentMap.get(children.get(i)).containsKey("background")) {
        PLColor bgColor =
            styleService.createColorFromHex(
                (String) contentMap.get(children.get(i)).get("background"));
        if (bgColor != null) {
          cells[i].setFillColor(bgColor);
        }
      }
    }

    rowTable.addRow(cells);
    if (isTable) {
      gridType.applyGridToTable(rowTable, borderStyleSpec);
    }
    return List.of(rowTable);
  }

  /** 构建文本元素 */
  private PLTable buildTextElement(
      Map<String, Object> elementMap, PageConfigService.PageConfig config) {
    PLTable rowTable = new PLTable(WidthSpec.star());
    EHorzAlignment alignment = styleService.getHorizontalAlignment(elementMap);

    if (elementMap.containsKey("isHyperlink")
        && elementMap.get("isHyperlink") instanceof Boolean
        && (Boolean) elementMap.get("isHyperlink")) {}

    PLText text =
        elementBuilderService.buildTextElement(
            alignment,
            elementMap,
            config.getDefaultFont(),
            config.getDefaultFontSize(),
            config.getDefaultFontColor(),
            config.getDefaultBackground());

    if (elementMap.containsKey("isHyperlink")
        && elementMap.get("isHyperlink") instanceof Boolean
        && (Boolean) elementMap.get("isHyperlink")) {
      PLExternalLink hyperlink =
          new PLExternalLink(text)
              .setURI(
                  elementMap.containsKey("hyperlinkUri")
                      ? (String) elementMap.get("hyperlinkUri")
                      : null)
              .setBorderBottom(new BorderStyleSpec(PLColor.BLUE));
      float[] padding = elementBuilderService.getElementPadding(elementMap);
      PLTableCell cell =
          elementBuilderService.buildTableCell(
              hyperlink, alignment, padding[0], padding[1], padding[2], padding[3]);

      rowTable.addRow(cell);
    } else {
      float[] padding = elementBuilderService.getElementPadding(elementMap);
      PLTableCell cell =
          elementBuilderService.buildTableCell(
              text, alignment, padding[0], padding[1], padding[2], padding[3]);

      rowTable.addRow(cell);
    }

    return rowTable;
  }

  /** 构建图片元素 */
  private PLTable buildImageElement(
      Map<String, Object> elementMap, PageConfigService.PageConfig config) throws IOException {
    PLTable rowTable = new PLTable(WidthSpec.star());
    EHorzAlignment alignment = styleService.getHorizontalAlignment(elementMap);

    PLImage image = elementBuilderService.buildImageElement(elementMap);
    if (image != null) {
      if (elementMap.containsKey("isHyperlink")
          && elementMap.get("isHyperlink") instanceof Boolean
          && (Boolean) elementMap.get("isHyperlink")) {
        PLExternalLink hyperlink =
            new PLExternalLink(image)
                .setURI(
                    elementMap.containsKey("hyperlinkUri")
                        ? (String) elementMap.get("hyperlinkUri")
                        : null)
                .setBorderBottom(new BorderStyleSpec(PLColor.BLUE));
        float[] padding = elementBuilderService.getElementPadding(elementMap);
        PLTableCell cell =
            elementBuilderService.buildTableCell(
                hyperlink, alignment, padding[0], padding[1], padding[2], padding[3]);
        rowTable.addRow(cell);
      } else {
        float[] padding = elementBuilderService.getElementPadding(elementMap);
        PLTableCell cell =
            elementBuilderService.buildTableCell(
                image, alignment, padding[0], padding[1], padding[2], padding[3]);
        rowTable.addRow(cell);
      }
    }

    return rowTable;
  }

  /** 构建占位符元素 */
  private PLTable buildPlaceholderElement(
      Map<String, Object> elementMap, PageConfigService.PageConfig config) {
    float width = 100f;
    if (elementMap.containsKey("width") && elementMap.get("width") != null) {
      width = ((Double) elementMap.get("width")).floatValue();
    }

    PLTable rowTable = new PLTable(WidthSpec.abs(width));
    EHorzAlignment alignment = styleService.getHorizontalAlignment(elementMap);

    float[] padding = elementBuilderService.getElementPadding(elementMap);

    PLBox placeholderBox =
        elementBuilderService.buildPlaceholderElement(
            elementMap, padding[0], padding[1], padding[2], padding[3]);
    rowTable.addRow(new PLTableCell(placeholderBox).setExactWidth(width));

    PLTable pRowTable = new PLTable(WidthSpec.star());
    pRowTable.addRow(new PLTableCell(rowTable).setHorzAlign(alignment));

    return pRowTable;
  }

  /** 构建页码元素 */
  private PLTable buildPageNumberElement(
      Map<String, Object> elementMap, PageConfigService.PageConfig config) {
    PLTable rowTable = new PLTable(WidthSpec.star());
    EHorzAlignment alignment = styleService.getHorizontalAlignment(elementMap);

    PLText text =
        elementBuilderService.buildPageNumberElement(
            elementMap,
            config.getDefaultFont(),
            config.getDefaultFontSize(),
            config.getDefaultFontColor(),
            config.getDefaultBackground());

    float[] padding = elementBuilderService.getElementPadding(elementMap);
    PLTableCell cell =
        elementBuilderService.buildTableCell(
            text, alignment, padding[0], padding[1], padding[2], padding[3]);

    rowTable.addRow(cell);
    return rowTable;
  }

  /** 构建表格元素 */
  private PLTable buildTableElement(
      Map<String, Object> elementMap,
      Map<String, Map<String, Object>> contentMap,
      PageConfigService.PageConfig config,
      Map<String, IPLRenderableObject<?>> generatedObjects,
      boolean isGenerated)
      throws IOException {
    PLTable rowTable = new PLTable(WidthSpec.star());
    rowTable.setHeaderRowCount(1);

    if (!elementMap.containsKey("columns") || elementMap.get("columns") == null) {
      return rowTable;
    }

    List<?> columns = (List<?>) elementMap.get("columns");
    List<?> bindingColumns = (List<?>) elementMap.get("bindingColumns");
    Map<?, ?> bindings = (Map<?, ?>) elementMap.get("bindings");

    // 将 bindingColumns 中的属性复制到 bindings 中
    if (bindings != null) {
      for (Object entry : bindings.entrySet()) {
        Map.Entry<?, ?> bindingEntry = (Map.Entry<?, ?>) entry;
        String key = (String) bindingEntry.getKey();

        // 跳过 table-root，只处理列绑定
        if (!"table-root".equals(key)) {
          String bindingColumnKey = key + "-column-binding";

          // 在 bindingColumns 中查找对应的列
          for (Object column : bindingColumns) {
            List<?> row = (List<?>) column;
            String columnKey = (String) row.get(0);

            if (bindingColumnKey.equals(columnKey)) {
              Map<String, Object> columnData = (Map<String, Object>) row.get(1);
              Map<String, Object> bindingData = (Map<String, Object>) bindingEntry.getValue();

              // 复制属性（除了 value）
              for (Map.Entry<String, Object> attr : columnData.entrySet()) {
                if (!"value".equals(attr.getKey())) {
                  bindingData.put(attr.getKey(), attr.getValue());
                }
              }
              break;
            }
          }
        }
      }
    }

    float[] padding = elementBuilderService.getElementPadding(elementMap);

    // 转换列配置为Map
    Map<String, Map<String, Object>> columnMap = new LinkedHashMap<>();
    for (Object column : columns) {
      List<?> row = (List<?>) column;
      columnMap.put((String) row.get(0), (Map<String, Object>) row.get(1));
    }

    String root = "table-root";
    Map<String, Object> rootMap = columnMap.get(root);

    if (rootMap != null
        && rootMap.containsKey("children")
        && !((List<?>) rootMap.get("children")).isEmpty()) {
      // 构建表格头部
      PLTable tableHeader =
          buildTableHeader(columnMap, config, elementMap, generatedObjects, isGenerated);
      System.out.println("tableHeader.getRenderSize()");
      System.out.println(tableHeader.getRenderSize());
      System.out.println(tableHeader.getPreparedSize());

      rowTable.addRow(new PLTableCell(tableHeader));

      // 构建表格主体
      List<IPLRenderableObject<?>> tableBody =
          buildTableBody(columnMap, bindings, config, elementMap, generatedObjects, isGenerated);
      for (IPLRenderableObject<?> renderableObject : tableBody) {
        rowTable.addRow(new PLTableCell(renderableObject));
      }
    }

    EPLTableGridType eGridType = EPLTableGridType.FULL;
    eGridType.applyGridToTable(rowTable, new BorderStyleSpec(PLColor.BLACK, 1));

    return rowTable.setMargin(padding[0], padding[1], padding[2], padding[3]);
  }

  /** 构建表格头部 */
  private PLTable buildTableHeader(
      Map<String, Map<String, Object>> columnMap,
      PageConfigService.PageConfig config,
      Map<String, Object> elementMap,
      Map<String, IPLRenderableObject<?>> generatedObjects,
      boolean isGenerated)
      throws IOException {
    String root = "table-root";
    Map<String, Object> rootMap = columnMap.get(root);
    List<String> children = (List<String>) rootMap.get("children");

    PLTable tableHeader = new PLTable(WidthSpec.star()).setID(String.valueOf(rootMap.get("id")));
    String tableId = String.valueOf(elementMap.get("id"));

    if (!children.isEmpty()) {
      List<IPLRenderableObject<?>> headerRows =
          buildTableHeaderRows(
              children,
              columnMap,
              config,
              elementMap,
              generatedObjects,
              null,
              tableId,
              isGenerated);
      for (IPLRenderableObject<?> headerRow : headerRows) {
        tableHeader.addRow(new PLTableCell(headerRow));
      }

      // 添加分隔线
      tableHeader.addRow(
          new PLTableCell(new PLText("", new FontSpec(PreloadFont.REGULAR, 1)))
              .setBorderTop(new BorderStyleSpec(PLColor.BLACK, 1f)));
    }

    return tableHeader;
  }

  /** 构建表格头部行 */
  private List<IPLRenderableObject<?>> buildTableHeaderRows(
      List<String> keys,
      Map<String, Map<String, Object>> columnMap,
      PageConfigService.PageConfig config,
      Map<String, Object> elementMap,
      Map<String, IPLRenderableObject<?>> generatedObjects,
      String parentContainerType, // 新增
      String tableId, // 新增
      boolean isGenerated)
      throws IOException {
    List<IPLRenderableObject<?>> rows = new LinkedList<>();

    for (String key : keys) {
      Map<String, Object> map = columnMap.get(key);
      String category = (String) map.get("cat");

      if ("container".equals(category)) {
        String direction = (String) map.get("direction");
        List<String> children = (List<String>) map.get("children");
        if (children != null && !children.isEmpty()) {
          rows.addAll(
              buildContainerElement(
                  map,
                  columnMap,
                  config,
                  true,
                  EPLTableGridType.FULL_NO_BORDER,
                  new BorderStyleSpec(PLColor.BLACK, 1),
                  (String) elementMap.get("gap"),
                  generatedObjects,
                  direction,
                  tableId,
                  isGenerated));
        }
      } else if ("text".equals(category)) {
        IPLRenderableObject<?> textObj =
            buildTableTextElement(map, config, (String) elementMap.get("gap"));
        rows.add(textObj);
        if (generatedObjects != null
            && !isGenerated
            && "horizontal".equals(parentContainerType)
            && map.containsKey("id")
            && tableId != null) {
          String keyStr = tableId + "-" + map.get("id");
          String keyFullStr = tableId + "-full-" + map.get("id");
          generatedObjects.put(keyStr, textObj);
          generatedObjects.put(keyFullStr, textObj);
        }
        if (generatedObjects != null
            && !isGenerated
            && "vertical".equals(parentContainerType)
            && map.containsKey("id")
            && tableId != null) {
          String keyFullStr = tableId + "-full-" + map.get("id");
          generatedObjects.put(keyFullStr, textObj);
        }
      }
    }

    return rows;
  }

  /** 构建表格文本元素 */
  private PLTable buildTableTextElement(
      Map<String, Object> elementMap, PageConfigService.PageConfig config, String gap) {
    PLTable rowTable = new PLTable(WidthSpec.star());
    EHorzAlignment alignment = styleService.getHorizontalAlignment(elementMap);

    PLText text =
        elementBuilderService.buildTextElement(
            alignment,
            elementMap,
            config.getDefaultFont(),
            config.getDefaultFontSize(),
            config.getDefaultFontColor(),
            config.getDefaultBackground());

    float gapSize = styleService.getTableGap(gap);
    PLTableCell cell =
        elementBuilderService.buildTableCell(text, alignment, gapSize, gapSize, gapSize, gapSize);

    if (elementMap.containsKey("background")) {
      PLColor bgColor = styleService.createColorFromHex((String) elementMap.get("background"));
      if (bgColor != null) {
        cell.setFillColor(bgColor);
      }
    }

    rowTable.addRow(cell.setVertAlign(EVertAlignment.MIDDLE));
    return rowTable;
  }

  /** 创建表格主体上下文 */
  private TableBodyContext createTableBodyContext(
      Map<String, Object> elementMap, Map<String, IPLRenderableObject<?>> generatedObjects) {
    String tableId = String.valueOf(elementMap.get("id"));
    float tableFullWidth = generatedObjects.get("table-" + tableId).getRenderWidth();
    logger.info("table width: " + tableFullWidth);

    List<Float> widthPercs = new ArrayList<>();
    List<String> cols = new ArrayList<>();
    float totalWidth = 0f;

    for (String key : generatedObjects.keySet()) {
      if (key.startsWith(tableId) && !key.contains("-full-")) {
        IPLRenderableObject<?> col = generatedObjects.get(key);
        logger.info("col width: " + col.getRenderWidth());
        totalWidth += col.getRenderWidth();
        widthPercs.add(col.getRenderWidth());
        cols.add(key.substring(key.indexOf(tableId + "-") + tableId.length() + 1));
      }
    }

    logger.info("table width 2: " + totalWidth);

    float[] widthPercentages = new float[widthPercs.size()];
    for (int i = 0; i < widthPercentages.length; i++) {
      widthPercentages[i] =
          ((widthPercs.get(i) + (i == 0 ? 0 : 1)) * 100 / (tableFullWidth - 1 - 1));
    }

    return new TableBodyContext(cols, widthPercentages, tableId);
  }

  /** 创建百分比表格 */
  private PLTable createTableWithPercentage(float[] widthPercentages) {
    return PLTable.createWithPercentage(widthPercentages);
  }

  /** 处理表格数据 */
  private void processTableData(
      PLTable table,
      Map<String, Map<String, Object>> columnMap,
      Map<?, ?> bindings,
      PageConfigService.PageConfig config,
      Map<String, Object> elementMap,
      TableBodyContext context)
      throws IOException {

    String root = "table-root";
    Map<String, Object> rootMap = columnMap.get(root);
    Map<String, Object> tableBinding = (Map<String, Object>) bindings.get(root);

    String shape = (String) tableBinding.get("shape");
    String request = (String) tableBinding.get("request");
    String value = (String) tableBinding.get("value");

    if ("list".equals(shape)) {
      if ("data".equals(request)) {
        processLocalData(table, value, columnMap, bindings, config, elementMap, context);
      } else if ("url".equals(request)) {
        processRemoteData(table, value, columnMap, bindings, config, elementMap, context);
      }
    }
  }

  /** 处理本地数据 */
  private void processLocalData(
      PLTable table,
      String value,
      Map<String, Map<String, Object>> columnMap,
      Map<?, ?> bindings,
      PageConfigService.PageConfig config,
      Map<String, Object> elementMap,
      TableBodyContext context)
      throws IOException {

    Gson gson = new GsonBuilder().setLenient().create();
    Type listType = new TypeToken<List<Map>>() {}.getType();
    String strictValue = JSON.encode(JSON.decode(value));
    List<Map> dataList = gson.fromJson(strictValue, listType);

    int dataCount = 1;
    int dataLimit = pdfMakerProperties.getTableMaxRecords();
    for (Map data : dataList) {
      if (dataCount > dataLimit) {
        break;
      }
      List<PLTableCell> cells =
          buildTableRow(data, columnMap, bindings, config, elementMap, context);
      table.addRow(cells);
      dataCount++;
    }
  }

  /** 处理远程数据 */
  private void processRemoteData(
      PLTable table,
      String url,
      Map<String, Map<String, Object>> columnMap,
      Map<?, ?> bindings,
      PageConfigService.PageConfig config,
      Map<String, Object> elementMap,
      TableBodyContext context)
      throws IOException {

    List<Map> dataList = getJsonList(url);
    int dataCount = 1;
    int dataLimit = pdfMakerProperties.getTableMaxRecords();
    for (Map data : dataList) {
      if (dataCount > dataLimit) {
        break;
      }
      List<PLTableCell> cells =
          buildTableRow(data, columnMap, bindings, config, elementMap, context);
      table.addRow(cells);
      dataCount++;
    }
  }

  /** 构建表格行 */
  private List<PLTableCell> buildTableRow(
      Map<String, Object> data,
      Map<String, Map<String, Object>> columnMap,
      Map<?, ?> bindings,
      PageConfigService.PageConfig config,
      Map<String, Object> elementMap,
      TableBodyContext context)
      throws IOException {

    List<PLTableCell> cells = new ArrayList<>();
    int colspans = 0;
    int colIndex = 0;

    for (String col : context.getColumns()) {
      if (colspans > colIndex) {
        colIndex++;
        continue;
      }

      if (colspans > context.getColumns().size()) break;

      Map<String, Object> binding = (Map<String, Object>) bindings.get(col);
      PLTableCell cell =
          buildTableCell(data, col, binding, columnMap, config, elementMap, context, colspans);
      cells.add(cell);

      // 更新colspans
      if (binding != null) {
        String bindPath = String.valueOf(binding.get("value"));
        Map<String, Object> cellData = getDataValueByBindingExt(data, bindPath);
        if ("colspanText".equals(cellData.get("type"))
            || "colspanList".equals(cellData.get("type"))
            || "colspanImage".equals(cellData.get("type"))) {
          int colspan = (int) cellData.get("colspan");
          if (colspans + colspan >= context.getColumns().size()) {
            colspan = context.getColumns().size() - colspans;
          }
          colspans += colspan;
        } else {
          colspans += 1;
        }
      } else {
        colspans += 1;
      }
      colIndex++;
    }

    return cells;
  }

  /** 构建表格单元格 */
  private PLTableCell buildTableCell(
      Map<String, Object> data,
      String col,
      Map<String, Object> binding,
      Map<String, Map<String, Object>> columnMap,
      PageConfigService.PageConfig config,
      Map<String, Object> elementMap,
      TableBodyContext context,
      int colspans)
      throws IOException {

    if (binding != null) {
      String bindPath = String.valueOf(binding.get("value"));
      Map<String, Object> cellData = getDataValueByBindingExt(data, bindPath);

      PLColor bgColor = null;
      if (binding.containsKey("background")) {
        String bgColorHex = (String) binding.get("background");
        if (!"#00000000".equals(bgColorHex)) {
          bgColor = parseColor(bgColorHex);
        }
      }

      if ("image".equals(cellData.get("type"))) {
        PLBox imageBox =
            buildTableBodyImageElement(
                cellData,
                elementMap.containsKey("gap") ? String.valueOf(elementMap.get("gap")) : "compact");
        PLTableCell cell =
            new PLTableCell(imageBox)
                .setVertAlign(EVertAlignment.MIDDLE)
                .setHorzAlign(EHorzAlignment.CENTER);
        if (bgColor != null) {
          cell.setFillColor(bgColor);
        }
        return cell;
      } else if ("colspanImage".equals(cellData.get("type"))) {
        PLBox imageBox =
            buildTableBodyImageElement(
                cellData,
                elementMap.containsKey("gap") ? String.valueOf(elementMap.get("gap")) : "compact");
        int colspan = (int) cellData.get("colspan");
        if (colspans + colspan >= context.getColumns().size()) {
          colspan = context.getColumns().size() - colspans;
        }
        PLTableCell cell =
            new PLTableCell(imageBox, colspan)
                .setVertAlign(EVertAlignment.MIDDLE)
                .setHorzAlign(EHorzAlignment.CENTER);
        if (bgColor != null) {
          cell.setFillColor(bgColor);
        }
        return cell;
      } else if ("colspanText".equals(cellData.get("type"))) {
        PLBox textBox =
            buildTableBodyTextElement(
                col,
                (String) cellData.get("value"),
                columnMap,
                binding,
                config.getDefaultFont(),
                config.getDefaultFontColor(),
                config.getDefaultBackground(),
                config.getDefaultFontSize(),
                elementMap.containsKey("gap") ? String.valueOf(elementMap.get("gap")) : "compact");
        int colspan = (int) cellData.get("colspan");
        if (colspans + colspan >= context.getColumns().size()) {
          colspan = context.getColumns().size() - colspans;
        }
        PLTableCell cell =
            new PLTableCell(textBox, colspan)
                .setVertAlign(EVertAlignment.MIDDLE)
                .setHorzAlign(EHorzAlignment.CENTER);
        if (bgColor != null) {
          cell.setFillColor(bgColor);
        }
        return cell;
      } else if ("colspanList".equals(cellData.get("type"))) {
        PLBox innerTableBox =
            buildTableBodyInnerTableElement(
                col,
                (List) cellData.get("value"),
                columnMap,
                binding,
                config.getDefaultFont(),
                config.getDefaultFontColor(),
                config.getDefaultBackground(),
                config.getDefaultFontSize(),
                elementMap.containsKey("gap") ? String.valueOf(elementMap.get("gap")) : "compact");
        int colspan = (int) cellData.get("colspan");
        if (colspans + colspan >= context.getColumns().size()) {
          colspan = context.getColumns().size() - colspans;
        }
        PLTableCell cell =
            new PLTableCell(innerTableBox, colspan)
                .setVertAlign(EVertAlignment.MIDDLE)
                .setHorzAlign(EHorzAlignment.CENTER);
        if (bgColor != null) {
          cell.setFillColor(bgColor);
        }
        return cell;
      } else if ("list".equals(cellData.get("type"))) {
        PLBox innerTableBox =
            buildTableBodyInnerTableElement(
                col,
                (List) cellData.get("value"),
                columnMap,
                binding,
                config.getDefaultFont(),
                config.getDefaultFontColor(),
                config.getDefaultBackground(),
                config.getDefaultFontSize(),
                elementMap.containsKey("gap") ? String.valueOf(elementMap.get("gap")) : "compact");
        PLTableCell cell =
            new PLTableCell(innerTableBox)
                .setVertAlign(EVertAlignment.MIDDLE)
                .setHorzAlign(EHorzAlignment.CENTER);
        if (bgColor != null) {
          cell.setFillColor(bgColor);
        }
        return cell;
      } else {
        PLBox textBox =
            buildTableBodyTextElement(
                col,
                (String) cellData.get("value"),
                columnMap,
                binding,
                config.getDefaultFont(),
                config.getDefaultFontColor(),
                config.getDefaultBackground(),
                config.getDefaultFontSize(),
                elementMap.containsKey("gap") ? String.valueOf(elementMap.get("gap")) : "compact");
        PLTableCell cell =
            new PLTableCell(textBox)
                .setVertAlign(EVertAlignment.MIDDLE)
                .setHorzAlign(EHorzAlignment.CENTER);
        if (bgColor != null) {
          cell.setFillColor(bgColor);
        }
        return cell;
      }
    } else {
      PLBox textBox =
          buildTableBodyTextElement(
              col,
              "",
              columnMap,
              binding,
              config.getDefaultFont(),
              config.getDefaultFontColor(),
              config.getDefaultBackground(),
              config.getDefaultFontSize(),
              elementMap.containsKey("gap") ? String.valueOf(elementMap.get("gap")) : "compact");

      return new PLTableCell(textBox)
          .setVertAlign(EVertAlignment.MIDDLE)
          .setHorzAlign(EHorzAlignment.CENTER);
    }
  }

  private PLBox buildTableBodyImageElement(Map<String, Object> cellData, String defaultGap)
      throws IOException {
    String imageType = (String) cellData.get("imageType"); // "base64" or "url"
    String value = (String) cellData.get("value");
    float imageHeight = (Float) cellData.get("height");
    float imageWidth = imageHeight;
    // 先创建一个空白图片
    BufferedImage blankImage =
        new BufferedImage((int) imageWidth, (int) imageHeight, BufferedImage.TYPE_INT_RGB);
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    ImageIO.write(blankImage, "PNG", baos);
    InputStream is = new ByteArrayInputStream(baos.toByteArray());

    if (imageType.equalsIgnoreCase("url")) {
      // 使用OkHttp从URL读取图片
      OkHttpClient client =
          new OkHttpClient.Builder()
              .connectTimeout(30, TimeUnit.SECONDS)
              .readTimeout(30, TimeUnit.SECONDS)
              .build();

      Request request = new Request.Builder().url(value).build();

      try (Response response = client.newCall(request).execute()) {
        if (response.isSuccessful() && response.body() != null) {
          // 读取图片数据
          byte[] imageBytes = response.body().bytes();
          BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(imageBytes));

          if (originalImage != null) {
            // 计算等比例缩放
            int originalHeight = originalImage.getHeight();
            int originalWidth = originalImage.getWidth();

            // 根据imageHeight计算缩放比例
            float scale = imageHeight / originalHeight;
            int newWidth = (int) (originalWidth * scale);
            int newHeight = (int) imageHeight;

            // 创建缩放后的图片
            BufferedImage scaledImage =
                new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
            Graphics2D g2d = scaledImage.createGraphics();
            g2d.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
            g2d.dispose();

            // 转换为InputStream
            ByteArrayOutputStream baos1 = new ByteArrayOutputStream();
            ImageIO.write(scaledImage, "PNG", baos1);
            is = new ByteArrayInputStream(baos1.toByteArray());

            // 更新imageWidth为缩放后的宽度
            imageWidth = newWidth;
          }
        }
      } catch (Exception e) {
        logger.error("从URL读取图片失败: " + value, e);
      }

    } else if (imageType.equalsIgnoreCase("base64")) {
      try {
        // 解码base64图片数据
        byte[] imageBytes = Base64.getDecoder().decode(value);
        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(imageBytes));

        if (originalImage != null) {
          // 计算等比例缩放
          int originalHeight = originalImage.getHeight();
          int originalWidth = originalImage.getWidth();

          // 根据imageHeight计算缩放比例
          float scale = imageHeight / originalHeight;
          int newWidth = (int) (originalWidth * scale);
          int newHeight = (int) imageHeight;

          // 创建缩放后的图片
          BufferedImage scaledImage =
              new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
          Graphics2D g2d = scaledImage.createGraphics();
          g2d.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
          g2d.dispose();

          // 转换为InputStream
          ByteArrayOutputStream baos1 = new ByteArrayOutputStream();
          ImageIO.write(scaledImage, "PNG", baos1);
          is = new ByteArrayInputStream(baos1.toByteArray());

          // 更新imageWidth为缩放后的宽度
          imageWidth = newWidth;
        }
      } catch (Exception e) {
        logger.error("解码base64图片失败", e);
      }
    }
    // 使用is变量创建PLImage
    PLImage image = new PLImage(ImageIO.read(is), imageWidth, imageHeight);

    EHorzAlignment horzAlignment = EHorzAlignment.CENTER;
    // 外部wrapper
    PLBox target = new PLBox(image).setHorzAlign(horzAlignment).setVertSplittable(false);

    // 内边距
    target.setPadding(getTableGap(defaultGap));

    return target;
  }

  private PLColor parseColor(String colorStr) {
    Color rgb = Color.decode(colorStr);
    return new PLColor(rgb.getRed(), rgb.getGreen(), rgb.getBlue());
  }

  private float getTableGap(Object gap) {
    if (gap == null) {
      return 6;
    } else {
      if (String.valueOf(gap).equals("compact")) {
        return 2;
      }
      if (String.valueOf(gap).equals("loose")) {
        return 10;
      }
    }
    return 6;
  }

  private PLBox buildTableBodyTextElement(
      String id,
      String value,
      Map<String, Map<String, Object>> pageBodyMap,
      Map<String, Object> binding,
      PreloadFont scDefaultFont,
      String defaultFontColor,
      String defaultBgColor,
      String defaultFontSize,
      String defaultGap) {
    Map map = pageBodyMap.get(id);
    if (map != null) {
      // 首行缩进
      boolean indent = map.containsKey("indent") && (Boolean) map.get("indent");
      // 字体颜色
      PLColor fc = parseColor(defaultFontColor);
      if (binding != null && binding.containsKey("fontColor")) {
        fc = parseColor((String) binding.get("fontColor"));
      }
      //
      String gap = defaultGap;
      // 字体大小
      float fs = Float.parseFloat(defaultFontSize);
      if (binding != null && binding.containsKey("fontSize")) {
        fs = ((Double) binding.get("fontSize")).floatValue();
      }
      // 字体类型
      PreloadFont ff = scDefaultFont;
      if (binding != null && binding.containsKey("font")) {
        String bold = binding.containsKey("bold") && (Boolean) binding.get("bold") ? "-bd" : "";
        ff = fontService.getFont(binding.get("font") + bold);
      }
      // 背景颜色
      PLColor bgColor = !"#00000000".equals(defaultBgColor) ? parseColor(defaultBgColor) : null;
      if (binding != null && binding.containsKey("background")) {
        String bgColorHex = (String) binding.get("background");
        if (!"#00000000".equals(bgColorHex)) {
          bgColor = parseColor(bgColorHex);
        }
      }
      // 水平对齐方式
      EHorzAlignment horzAlignment = EHorzAlignment.CENTER;
      if (binding != null && binding.containsKey("horizontal")) {
        if ("left".equals(binding.get("horizontal"))) {
          horzAlignment = EHorzAlignment.LEFT;
        } else if ("right".equals(binding.get("horizontal"))) {
          horzAlignment = EHorzAlignment.RIGHT;
        }
      }

      //      if (indent) {
      //        String fontKey = pageBodyMap.containsKey("font") ? ((String) (map.get("font"))) :
      // "";
      //        value = fontService.getLineIndention(fontKey) + value;
      //      }

      // 创建文本元素
      PLText text = new PLText(value, new FontSpec(ff, fs).getCloneWithDifferentColor(fc));

      // 外部wrapper
      PLBox target =
          new PLBox(text.setHorzAlign(horzAlignment))
              .setHorzAlign(horzAlignment)
              .setVertSplittable(false);

      // 填充背景
      if (bgColor != null) {
        target.setFillColor(bgColor);
      }

      // 内边距
      target.setPadding(getTableGap(gap));

      return target;
    }

    return null;
  }

  private PLBox buildTableBodyInnerTableElement(
      String id,
      List values,
      Map<String, Map<String, Object>> pageBodyMap,
      Map<String, Object> binding,
      PreloadFont scDefaultFont,
      String defaultFontColor,
      String defaultBgColor,
      String defaultFontSize,
      String defaultGap) {
    Map map = pageBodyMap.get(id);
    if (map != null) {
      // 字体颜色
      PLColor fc = parseColor(defaultFontColor);
      if (binding != null && binding.containsKey("fontColor")) {
        fc = parseColor((String) binding.get("fontColor"));
      }
      //
      String gap = defaultGap;
      // 字体大小
      float fs = Float.parseFloat(defaultFontSize);
      if (binding != null && binding.containsKey("fontSize")) {
        fs = ((Double) binding.get("fontSize")).floatValue();
      }
      // 字体类型
      PreloadFont ff = scDefaultFont;
      if (binding != null && binding.containsKey("font")) {
        String bold = binding.containsKey("bold") && (Boolean) binding.get("bold") ? "-bd" : "";
        ff = fontService.getFont(binding.get("font") + bold);
      }
      // 背景颜色
      PLColor bgColor = !"#00000000".equals(defaultBgColor) ? parseColor(defaultBgColor) : null;
      if (binding != null && binding.containsKey("background")) {
        String bgColorHex = (String) binding.get("background");
        if (!"#00000000".equals(bgColorHex)) {
          bgColor = parseColor(bgColorHex);
        }
      }
      // 水平对齐方式
      EHorzAlignment horzAlignment = EHorzAlignment.CENTER;
      if (binding != null && binding.containsKey("horizontal")) {
        if ("left".equals(binding.get("horizontal"))) {
          horzAlignment = EHorzAlignment.LEFT;
        } else if ("right".equals(binding.get("horizontal"))) {
          horzAlignment = EHorzAlignment.RIGHT;
        }
      }

      PLTable aTable = PLTable.createWithEvenlySizedColumns(1);

      //      // 创建文本元素
      //      PLText text = new PLText(value, new FontSpec(ff, fs).getCloneWithDifferentColor(fc));

      for (Object value : values) {
        aTable.addAndReturnRow(
            new PLTableCell(
                    new PLBox(
                            new PLText(
                                    String.valueOf(value),
                                    new FontSpec(ff, fs).getCloneWithDifferentColor(fc))
                                .setHorzAlign(horzAlignment))
                        .setHorzAlign(horzAlignment)
                        .setVertSplittable(false))
                .setHorzAlign(horzAlignment)
                .setPadding(getTableGap(gap)));
      }

      EPLTableGridType.HORZ_NO_BORDER.applyGridToTable(
          aTable, new BorderStyleSpec(PLColor.BLACK, 1f));

      // 外部wrapper
      PLBox target = new PLBox(aTable).setHorzAlign(horzAlignment).setVertSplittable(false);

      // 填充背景
      if (bgColor != null) {
        target.setFillColor(bgColor);
      }

      // 内边距
      //      target.setPadding(getTableGap(gap));

      return target;
    }

    return null;
  }

  /** 构建表格主体 */
  private List<IPLRenderableObject<?>> buildTableBody(
      Map<String, Map<String, Object>> columnMap,
      Map<?, ?> bindings,
      PageConfigService.PageConfig config,
      Map<String, Object> elementMap,
      Map<String, IPLRenderableObject<?>> generatedObjects,
      boolean isGenerated)
      throws IOException {
    if (!isGenerated) {
      return Collections.emptyList();
    }

    logger.info("isGenerated");

    TableBodyContext context = createTableBodyContext(elementMap, generatedObjects);
    PLTable table = createTableWithPercentage(context.getWidthPercentages());

    String root = "table-root";
    Map<String, Object> rootMap = columnMap.get(root);
    Map<String, Object> tableBinding = (Map<String, Object>) bindings.get(root);

    if (rootMap.containsKey("children") && tableBinding != null) {
      processTableData(table, columnMap, bindings, config, elementMap, context);
      EPLTableGridType.FULL_NO_BORDER.applyGridToTable(
          table, new BorderStyleSpec(PLColor.BLACK, 1f));
      return List.of(table);
    }

    return Collections.emptyList();
  }

  // 辅助方法（需根据实际实现补充）
  private String getDataValueByBinding(Map<String, Object> data, String bindPath) {
    // 这里持多层级嵌套寻找，用来满足bindPath是a.b.c.d这种复杂情况
    if (data == null || bindPath == null || bindPath.isEmpty()) {
      return "";
    }
    String[] keys = bindPath.split("\\.");
    Object current = data;
    for (String key : keys) {
      if (!(current instanceof Map)) {
        return "";
      }
      current = ((Map<?, ?>) current).get(key);
      if (current == null) {
        return "";
      }
    }
    return String.valueOf(current);
  }

  private Map<String, Object> getDataValueByBindingExt(Map<String, Object> data, String bindPath) {
    HashMap<String, Object> result = new HashMap<>();
    result.put("value", "");
    result.put("type", "text");
    // 这里持多层级嵌套寻找，用来满足bindPath是a.b.c.d这种复杂情况
    if (data == null || bindPath == null || bindPath.isEmpty()) {
      return result;
    }
    String[] keys = bindPath.split("\\.");
    Object current = data;
    for (String key : keys) {
      if (!(current instanceof Map)) {
        return result;
      }
      current = ((Map<?, ?>) current).get(key);
      if (current == null) {
        return result;
      }
    }
    // TODO image 可以分为远程url或者base64
    if (current instanceof Map) {
      if (((Map<?, ?>) current).containsKey("type")
          && ((String) ((Map<?, ?>) current).get("type")).equalsIgnoreCase("image")) {
        float imageHeight = 16f;
        if (((Map<?, ?>) current).containsKey("height")) {
          imageHeight =
              (Double.valueOf(String.valueOf(((Map<?, ?>) current).get("height")))).floatValue();
          if (imageHeight <= 0) {
            imageHeight = 16f;
          }
        }
        String imageType = "base64";
        if (((Map<?, ?>) current).containsKey("imageType")
            && ((String) ((Map<?, ?>) current).get("imageType")).equalsIgnoreCase("url")) {
          imageType = "url";
        }
        // image 支持
        if (((Map<?, ?>) current).containsKey("colspan")) {
          // colspan image 支持
          result.put("value", ((Map<?, ?>) current).get("value"));
          result.put(
              "colspan",
              Double.valueOf(String.valueOf(((Map<?, ?>) current).get("colspan"))).intValue());
          result.put("type", "colspanImage");
          result.put("height", imageHeight);
          result.put("imageType", imageType);
        } else {
          // 普通 image 支持
          result.put("value", ((Map<?, ?>) current).get("value"));
          result.put("type", "image");
          result.put("height", imageHeight);
          result.put("imageType", imageType);
        }
      } else if (((Map<?, ?>) current).containsKey("colspan")
          && ((Map<?, ?>) current).containsKey("value")) {
        // colspan text 支持
        if (((Map<?, ?>) current).get("value") instanceof String
            || ((Map<?, ?>) current).get("value") instanceof Integer
            || ((Map<?, ?>) current).get("value") instanceof Long
            || ((Map<?, ?>) current).get("value") instanceof Float
            || ((Map<?, ?>) current).get("value") instanceof Double) {
          result.put("value", String.valueOf(((Map<?, ?>) current).get("value")));
          result.put(
              "colspan",
              Double.valueOf(String.valueOf(((Map<?, ?>) current).get("colspan"))).intValue());
          result.put("type", "colspanText");
        }
        // colspan List 支持
        if (((Map<?, ?>) current).get("value") instanceof List) {
          result.put("value", ((Map<?, ?>) current).get("value"));
          result.put(
              "colspan",
              Double.valueOf(String.valueOf(((Map<?, ?>) current).get("colspan"))).intValue());
          result.put("type", "colspanList");
        }
      }
    }
    // 普通 text 支持
    if (current instanceof String
        || current instanceof Integer
        || current instanceof Long
        || current instanceof Float
        || current instanceof Double) {
      result.put("value", String.valueOf(current));
      result.put("type", "text");
    }
    // List 支持
    if (current instanceof List) {
      result.put("value", current);
      result.put("type", "list");
    }
    return result;
  }

  private List<Map> getJsonList(String url) throws IOException {
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
        return Collections.emptyList();
      }

      // 获取 JSON 字符串
      String json = response.body().string();

      // 解析为 List<Map> 类型
      String strictJson = JSON.encode(JSON.decode(json));
      return gson.fromJson(strictJson, new TypeToken<List<Map>>() {}.getType());
    } catch (Exception e) {
      logger.error("请求异常: {}", e.getMessage(), e);
      return Collections.emptyList();
    }
  }

  /** 将List转换为Map */
  private Map<String, Map<String, Object>> convertListToMap(List<Object> list) {
    Map<String, Map<String, Object>> map = new LinkedHashMap<>();
    for (Object item : list) {
      List<?> row = (List<?>) item;
      map.put((String) row.get(0), (Map<String, Object>) row.get(1));
    }
    return map;
  }

  /** 表格主体上下文类 */
  private static class TableBodyContext {
    private final List<String> columns;
    private final float[] widthPercentages;
    private final String tableId;

    public TableBodyContext(List<String> columns, float[] widthPercentages, String tableId) {
      this.columns = columns;
      this.widthPercentages = widthPercentages;
      this.tableId = tableId;
    }

    public List<String> getColumns() {
      return columns;
    }

    public float[] getWidthPercentages() {
      return widthPercentages;
    }

    public String getTableId() {
      return tableId;
    }
  }
}
