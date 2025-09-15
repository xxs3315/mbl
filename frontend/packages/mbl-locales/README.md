# @xxs3315/mbl-locales

MixBoxLayout 多语言支持库

## 功能特性

- 支持中文（zh-CN）和英文（en-US）
- 基于 i18next 和 react-i18next
- 类型安全的翻译键
- 简单易用的 API

## 安装

```bash
pnpm add @xxs3315/mbl-locales
```

## 使用方法

### 基本用法

```typescript
import { initI18n, t, setLocale, getCurrentLocale } from '@xxs3315/mbl-locales';

// 初始化多语言
initI18n('zh-CN'); // 默认中文

// 获取翻译文本
const text = t('attributePanel.text.title'); // "文本属性"

// 切换语言
setLocale('en-US');

// 获取当前语言
const currentLang = getCurrentLocale(); // "en-US"
```

### 在 React 组件中使用

```typescript
import React from 'react';
import { I18nProvider, useI18n, LanguageSwitcher } from '@xxs3315/mbl-lib';

function App() {
  return (
    <I18nProvider defaultLocale="zh-CN">
      <MyComponent />
      <LanguageSwitcher />
    </I18nProvider>
  );
}

function MyComponent() {
  const { t, locale, setLocale } = useI18n();
  
  return (
    <div>
      <h1>{t('attributePanel.text.title')}</h1>
      <p>当前语言: {locale}</p>
      <button onClick={() => setLocale('en-US')}>
        切换到英文
      </button>
    </div>
  );
}
```

### 在 MixBoxLayout 中使用

```typescript
import { MixBoxLayout } from '@xxs3315/mbl-lib';

function App() {
  return (
    <MixBoxLayout
      id="my-layout"
      contents={contentData}
      locale="zh-CN" // 设置默认语言
      onContentChange={handleContentChange}
    />
  );
}
```

## API 参考

### 函数

- `initI18n(locale?: SupportedLocale)`: 初始化 i18n 配置
- `t(key: string, options?: any)`: 获取翻译文本
- `setLocale(locale: SupportedLocale)`: 设置当前语言
- `getCurrentLocale()`: 获取当前语言

### 类型

- `SupportedLocale`: 支持的语言类型，值为 `'zh-CN' | 'en-US'`
- `UIResource`: UI 资源类型

### 组件

- `I18nProvider`: 多语言上下文提供者
- `useI18n()`: 多语言 Hook
- `LanguageSwitcher`: 语言切换组件

## 添加新的翻译

1. 在 `src/langs/zh-CN/ui.json` 中添加中文翻译
2. 在 `src/langs/en-US/ui.json` 中添加对应的英文翻译
3. 重新构建包

## 支持的翻译键

### 属性面板 (attributePanel)

- `attributePanel.text.title`: 文本属性标题
- `attributePanel.text.bold`: 粗体
- `attributePanel.text.leftPadding`: 左内边距
- `attributePanel.text.rightPadding`: 右内边距
- `attributePanel.text.topPadding`: 上内边距
- `attributePanel.text.bottomPadding`: 下内边距
- `attributePanel.text.fontSize`: 字体大小
- `attributePanel.text.fontColor`: 文字颜色
- `attributePanel.text.backgroundColor`: 背景颜色
- `attributePanel.text.horizontalAlign`: 水平对齐
- `attributePanel.text.leftAlign`: 左对齐
- `attributePanel.text.centerAlign`: 居中
- `attributePanel.text.rightAlign`: 右对齐

## 许可证

MIT
