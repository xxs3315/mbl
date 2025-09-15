import React from "react";
import { MixBoxLayout, LanguageSwitcher, useI18n } from "../index";
import { defaultContents } from "../store/default-data";

// 示例：展示如何在应用中使用多语言功能
export const I18nExample: React.FC = () => {
  const [locale, setLocale] = React.useState<"zh-CN" | "en-US">("zh-CN");

  return (
    <div style={{ padding: "20px" }}>
      <h2>多语言功能示例</h2>

      {/* 语言切换器 */}
      <div style={{ marginBottom: "20px" }}>
        <label>选择语言: </label>
        <LanguageSwitcher />
      </div>

      {/* MixBoxLayout 组件，支持多语言 */}
      <MixBoxLayout
        id="i18n-example"
        contents={defaultContents}
        locale={locale}
        onContentChange={(contents) => {
          console.log("内容已更新:", contents);
        }}
      />
    </div>
  );
};

// 示例：在自定义组件中使用多语言
export const CustomI18nComponent: React.FC = () => {
  const { t, locale, setLocale } = useI18n();

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>自定义多语言组件示例</h3>

      <p>当前语言: {locale}</p>
      <p>文本属性标题: {t("attributePanel.text.title")}</p>
      <p>粗体标签: {t("attributePanel.text.bold")}</p>

      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => setLocale("zh-CN")}
          style={{ marginRight: "10px" }}
        >
          切换到中文
        </button>
        <button onClick={() => setLocale("en-US")}>切换到英文</button>
      </div>
    </div>
  );
};
