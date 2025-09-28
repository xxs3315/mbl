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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;

@Service
public class PdfMakerService {

  private static final Logger logger = LoggerFactory.getLogger(PdfMakerService.class);

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
    logger.info("开始创建PDF文档: {}", filename);
    
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
    logger.info("准备渲染PDF到路径: {}", outputPath);
    PageLayoutPDF pdf = realPageLayout.renderTo(new File(outputPath));
    
    logger.info("PDF文档创建完成: {}", filename);

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
    logger.info("开始创建PDF页面集: {}, isGenerated={}", filename, isGenerated);

    // 解析页面配置
    watch.start("解析页面配置");
    PageConfigService.PageConfig config = pageConfigService.parsePageConfig(propsMap);
    watch.stop();
    logger.debug("页面配置解析完成: {}", watch.prettyPrint());

    // 创建页面设置
    watch.start("创建页面设置");
    PLPageSet pageSet = pageConfigService.createPageSet(config);
    watch.stop();
    logger.debug("页面设置创建完成: {}", watch.prettyPrint());

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
    logger.debug("页面头部构建完成: {}", watch.prettyPrint());

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
    logger.debug("页面底部构建完成: {}", watch.prettyPrint());

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
    logger.debug("页面主体构建完成: {}", watch.prettyPrint());

    // 渲染PDF
    watch.start("渲染PDF");
    logger.info("PDF页面集创建完成: {}", filename);

    return pageSet;
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
    logger.info("开始批量创建PDF文档: {}, 文档数量: {}", filename, propsMaps.size());
    
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
    logger.info("准备渲染批量PDF到路径: {}", outputPath);
    PageLayoutPDF pdf = realPageLayout.renderTo(new File(outputPath));
    
    logger.info("批量PDF文档创建完成: {}", filename);

    return pdf;
  }
}