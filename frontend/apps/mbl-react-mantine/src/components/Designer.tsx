import React from "react";
import { contents } from "@xxs3315/mbl-lib-example-data";
import { MixBoxLayout } from "@xxs3315/mbl-lib";
import "@xxs3315/mbl-lib/index.css";
import { useTheme } from "../providers/ThemeProvider";
import { tablePlugin } from "@xxs3315/mbl-lib-plugin-table";
import { useLocale } from "../providers/LocaleProvider";

const Designer: React.FC = () => {
  // 定义插件列表
  const plugins = [
    {
      metadata: tablePlugin.metadata,
      plugin: tablePlugin,
    },
  ];

  const { currentTheme } = useTheme();
  const { currentLocale } = useLocale();
  return (
    <MixBoxLayout
      id={"ddb14a5da2a5423e862e3e9afd58f776"}
      contents={contents}
      onContentChange={(updatedContents) => {
        console.log(updatedContents);
      }}
      theme={currentTheme}
      locale={currentLocale}
      baseUrl={"http://localhost:28080"}
      imageUploadPath={"/api/images/upload"}
      pdfGeneratePath={"/api/pdf/generate"}
      plugins={plugins}
      enablePluginSystem={true}
    />
  );
};

export default Designer;
