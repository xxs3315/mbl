package com.xxs3315.mbl.pdf.services;

import com.helger.pdflayout.PDFCreationException;
import com.helger.pdflayout.PageLayoutPDF;
import com.helger.pdflayout.base.IPLRenderableObject;
import com.helger.pdflayout.base.PLPageSet;
import com.xxs3315.mbl.pdf.properties.PdfMakerProperties;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;

@Service
public class PdfMakerService {

  @Autowired private PdfMakerProperties pdfMakerProperties;

  @Autowired private PageConfigService pageConfigService;

  @Autowired private PageContentBuilderService pageContentBuilderService;

  /**
   * 创建PDF文档
   *
   * @param filename 文件名
   * @param propsMap 配置属性映射
   * @return PageLayoutPDF对象
   * @throws IOException 如果发生IO错误
   * @throws PDFCreationException 如果PDF创建失败
   */
  public PageLayoutPDF create(
      String filename, Map<String, Object> propsMap, Map<String, Object> configMap)
      throws IOException, PDFCreationException {
    // 创建存储所有生成对象的Map
    Map<String, IPLRenderableObject<?>> generatedObjects = new LinkedHashMap<>();

    PLPageSet ps = createWithObjects(filename, propsMap, generatedObjects, false);

    PageLayoutPDF pageLayout = new PageLayoutPDF();
    pageLayout.addPageSet(ps);

    pageLayout.prepareAllPageSets();

    PageLayoutPDF realPageLayout = new PageLayoutPDF();
    ps = createWithObjects(filename, propsMap, generatedObjects, true);
    realPageLayout.addPageSet(ps);

    if (!configMap.isEmpty()) {
      Map<String, Object> pageNumberConfig = extractPageNumberConfig(configMap);

      Boolean pageNumberLeadingEnabled = (Boolean) pageNumberConfig.get("pageNumberLeadingEnabled");
      Boolean pageNumberCountEnabled = (Boolean) pageNumberConfig.get("pageNumberCountEnabled");

      Double pageNumberLeading = (Double) pageNumberConfig.get("pageNumberLeading");
      Double pageNumberCount = (Double) pageNumberConfig.get("pageNumberCount");

      if (pageNumberLeadingEnabled) {
        realPageLayout.setCustomLeadingPageCount(-1 * (pageNumberLeading.intValue() - 1));
      }

      if (pageNumberCountEnabled) {
        realPageLayout.setCustomTotalPageCount(pageNumberCount.intValue());
      }
    }

    String outputPath = pdfMakerProperties.getOutputDir() + filename + ".pdf";
    PageLayoutPDF pdf = realPageLayout.renderTo(new File(outputPath));

    return pdf;
  }

  /**
   * 从propsMap中提取水印配置
   *
   * @param propsMap 配置属性映射
   * @return 水印配置映射
   */
  private Map<String, Object> extractPageNumberConfig(Map<String, Object> propsMap) {
    Map<String, Object> pageNumberConfig = new HashMap<>();

    // 提取水印相关配置
    pageNumberConfig.put(
        "pageNumberLeadingEnabled", ((Map) propsMap.get("page")).get("pageNumberLeadingEnabled"));
    pageNumberConfig.put(
        "pageNumberLeading", ((Map) propsMap.get("page")).get("pageNumberLeading"));
    pageNumberConfig.put(
        "pageNumberCountEnabled", ((Map) propsMap.get("page")).get("pageNumberCountEnabled"));
    pageNumberConfig.put("pageNumberCount", ((Map) propsMap.get("page")).get("pageNumberCount"));

    return pageNumberConfig;
  }

  /**
   * 创建PDF文档并返回生成的对象Map
   *
   * @param filename 文件名
   * @param propsMap 配置属性映射
   * @param generatedObjects 存储生成对象的Map
   * @return PageLayoutPDF对象
   * @throws IOException 如果发生IO错误
   * @throws PDFCreationException 如果PDF创建失败
   */
  public PLPageSet createWithObjects(
      String filename,
      Map<String, Object> propsMap,
      Map<String, IPLRenderableObject<?>> generatedObjects,
      boolean isGenerated)
      throws IOException, PDFCreationException {
    StopWatch watch = new StopWatch();

    // 解析页面配置
    watch.start("解析页面配置");
    PageConfigService.PageConfig config = pageConfigService.parsePageConfig(propsMap);
    watch.stop();
    System.out.println(watch.prettyPrint());

    // 创建页面设置
    watch.start("创建页面设置");
    PLPageSet pageSet = pageConfigService.createPageSet(config);
    watch.stop();
    System.out.println(watch.prettyPrint());

    // 构建页面头部
    watch.start("构建页面头部");
    List<Object> pageHeaderContent = (List<Object>) propsMap.get("pageHeaderContent");
    var pageHeader =
        pageContentBuilderService.buildPageHeader(
            pageHeaderContent, config, generatedObjects, isGenerated);
    pageSet.setPageHeader(pageHeader);
    if (config.isHideHeaderOnFirstPage()) {
      pageSet.setDifferentFirstPageHeader(true);
    }
    watch.stop();
    System.out.println(watch.prettyPrint());

    // 构建页面底部
    watch.start("构建页面底部");
    List<Object> pageFooterContent = (List<Object>) propsMap.get("pageFooterContent");
    var pageFooter =
        pageContentBuilderService.buildPageFooter(
            pageFooterContent, config, generatedObjects, isGenerated);
    pageSet.setPageFooter(pageFooter);
    if (config.isHideFooterOnFirstPage()) {
      pageSet.setDifferentFirstPageFooter(true);
    }
    watch.stop();
    System.out.println(watch.prettyPrint());

    // 构建页面主体
    watch.start("构建页面主体");
    List<Object> pageBodyContent = (List<Object>) propsMap.get("pageBodyContent");
    List<IPLRenderableObject<?>> pageBodyElements =
        pageContentBuilderService.buildPageBody(
            pageBodyContent, config, generatedObjects, isGenerated);
    for (IPLRenderableObject<?> element : pageBodyElements) {
      pageSet.addElement(element);
    }
    watch.stop();
    System.out.println(watch.prettyPrint());

    // 渲染PDF
    watch.start("渲染PDF");

    return pageSet;

    //    PageLayoutPDF pageLayout = new PageLayoutPDF();
    //    pageLayout.addPageSet(pageSet);

    //     pageLayout.prepareAllPageSets();

    // 在prepare之后，我们可以得到表格中每一列的真实渲染width以及表格的width，这里就可以来计算表格body每一行的cell排列了，只需要用最简单的行，规避了单元格边框没有完整vertical画完整的问题

    // === 统计表格及其所有列的 getRenderWidth() ===
    // 结构: Map<tableKey, Map<colKey, width>>
    // tableKey: "table-xxx"，colKey: "table-xxx"（表本身）或 "xxx-yyy"（列）
    //    Map<String, Map<String, Float>> tableWidths = new LinkedHashMap<>();
    //    for (String key : generatedObjects.keySet()) {
    //      if (key.startsWith("table-") && !key.substring(6).contains("-")) {
    //        // 这是 table 本身
    //        String tableKey = key;
    //        Map<String, Float> widthMap = new LinkedHashMap<>();
    //        IPLRenderableObject<?> tableObj = generatedObjects.get(tableKey);
    //        if (tableObj != null) {
    //          try {
    //            widthMap.put(tableKey, (float) tableObj.getRenderWidth());
    //          } catch (Exception e) {
    //            widthMap.put(tableKey, -1f);
    //          }
    //        }
    //        // 查找所有属于该 table 的列（key为xxx-yyy）
    //        String tableId = tableKey.substring("table-".length());
    //        for (String colKey : generatedObjects.keySet()) {
    //          if (!colKey.startsWith("table-") && colKey.startsWith(tableId + "-")) {
    //            IPLRenderableObject<?> colObj = generatedObjects.get(colKey);
    //            if (colObj != null) {
    //              try {
    //                widthMap.put(colKey, (float) colObj.getRenderWidth());
    //              } catch (Exception e) {
    //                widthMap.put(colKey, -1f);
    //              }
    //            }
    //          }
    //        }
    //        tableWidths.put(tableKey, widthMap);
    //      }
    //    }
    // tableWidths 即为每个表及其所有列的宽度统计

  }

  /**
   * 从列表中创建，实际上是多个循环生成pageset
   *
   * @param filename
   * @param propsMaps
   * @return
   */
  public PageLayoutPDF create(String filename, List<Map> propsMaps, Map<String, Object> configMap)
      throws IOException, PDFCreationException {
    // 创建存储所有生成对象的Map
    Map<String, IPLRenderableObject<?>> generatedObjects = new LinkedHashMap<>();
    PageLayoutPDF pageLayout = new PageLayoutPDF();

    for (Map m : propsMaps) {
      PLPageSet ps = createWithObjects(filename, m, generatedObjects, false);
      pageLayout.addPageSet(ps);
    }

    pageLayout.prepareAllPageSets();

    PageLayoutPDF realPageLayout = new PageLayoutPDF();

    for (Map m : propsMaps) {
      PLPageSet ps = createWithObjects(filename, m, generatedObjects, true);
      realPageLayout.addPageSet(ps);
    }

    if (!configMap.isEmpty()) {
      Map<String, Object> pageNumberConfig = extractPageNumberConfig(configMap);

      Boolean pageNumberLeadingEnabled = (Boolean) pageNumberConfig.get("pageNumberLeadingEnabled");
      Boolean pageNumberCountEnabled = (Boolean) pageNumberConfig.get("pageNumberCountEnabled");

      Double pageNumberLeading = (Double) pageNumberConfig.get("pageNumberLeading");
      Double pageNumberCount = (Double) pageNumberConfig.get("pageNumberCount");

      if (pageNumberLeadingEnabled) {
        realPageLayout.setCustomLeadingPageCount(-1 * (pageNumberLeading.intValue() - 1));
      }

      if (pageNumberCountEnabled) {
        realPageLayout.setCustomTotalPageCount(pageNumberCount.intValue());
      }
    }
    String outputPath = pdfMakerProperties.getOutputDir() + filename + ".pdf";
    PageLayoutPDF pdf = realPageLayout.renderTo(new File(outputPath));

    return pdf;
  }
}
