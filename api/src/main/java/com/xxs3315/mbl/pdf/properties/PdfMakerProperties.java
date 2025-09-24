package com.xxs3315.mbl.pdf.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "pdf.file")
public class PdfMakerProperties {
  private String outputDir = "C:\\Windows\\Temp\\";
  private int tableMaxRecords = 100;

  public String getOutputDir() {
    return outputDir;
  }

  public void setOutputDir(String outputDir) {
    this.outputDir = outputDir;
  }

  public int getTableMaxRecords() {
    return tableMaxRecords;
  }

  public void setTableMaxRecords(int tableMaxRecords) {
    this.tableMaxRecords = tableMaxRecords;
  }
}
