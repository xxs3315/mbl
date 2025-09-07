# Vue + veaury + MixBoxLayout 集成指南

本项目展示了如何在Vue 3项目中使用veaury库来集成React组件MixBoxLayout。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 构建项目

```bash
npm run build
```

## 📁 项目结构

```
src/
├── components/
│   ├── HelloWorld.vue          # Vue示例组件
│   └── MixBoxLayoutWrapper.vue # MixBoxLayout包装组件
├── App.vue                     # 主应用组件
├── main.ts                     # 应用入口
├── vite-env.d.ts              # 类型声明
└── style.css                  # 全局样式
```

## 🔧 核心配置

### 1. Vite配置 (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'  // 添加React支持
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    vue(), 
    react(), // 支持React组件
    tsconfigPaths()
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@xxs3315/mbl-lib',
      '@xxs3315/mbl-lib-example-data'
    ]
  }
})
```

### 2. 应用入口 (main.ts)

```typescript
import { createApp } from 'vue'
import { createRoot } from 'react-dom/client'
import { setVeauryOptions } from 'veaury'

// 配置veaury使用React 19的createRoot
setVeauryOptions({
    react: {
        createRoot
    }
})

createApp(App).mount('#app')
```

### 3. 类型声明 (vite-env.d.ts)

```typescript
// veaury 类型声明
declare module 'veaury' {
  // ... 类型定义
}

// MixBoxLayout 组件类型声明
declare module '@xxs3315/mbl-lib' {
  // ... 类型定义
}
```

## 🎯 使用方式

### 1. 直接使用veaury包装

```vue
<script setup lang="ts">
import { applyReactInVue } from 'veaury'
import { MixBoxLayout } from "@xxs3315/mbl-lib";
import { contents } from "@xxs3315/mbl-lib-example-data";

// 包装React组件
const VueMixBoxLayout = applyReactInVue(MixBoxLayout, {
  useInjectPropsFromWrapper: true,
  useInjectSlotsFromWrapper: true,
});
</script>

<template>
  <VueMixBoxLayout 
    id="my-layout"
    :content="contents"
    theme="light"
    height="600px"
  />
</template>
```

### 2. 使用包装组件 (推荐)

```vue
<script setup lang="ts">
import MixBoxLayoutWrapper from './components/MixBoxLayoutWrapper.vue'
import { contents } from "@xxs3315/mbl-lib-example-data";
</script>

<template>
  <MixBoxLayoutWrapper 
    id="my-layout"
    title="我的布局"
    :initial-content="contents"
    theme="light"
    height="600px"
    @theme-change="handleThemeChange"
    @content-update="handleContentUpdate"
  />
</template>
```

## 🎨 功能特性

### MixBoxLayoutWrapper 组件特性

- ✅ **主题切换**: 支持light/dark主题
- ✅ **内容管理**: 动态更新和重置内容
- ✅ **数据导出**: 导出当前内容为JSON文件
- ✅ **响应式设计**: 适配移动端和桌面端
- ✅ **事件处理**: 支持主题变化和内容更新事件
- ✅ **类型安全**: 完整的TypeScript支持

### 可用Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `id` | `string` | `'mixbox-layout'` | 组件唯一标识 |
| `title` | `string` | `'MixBoxLayout 组件'` | 组件标题 |
| `initialContent` | `any` | `contents` | 初始内容数据 |
| `theme` | `'light' \| 'dark'` | `'light'` | 主题模式 |
| `width` | `string \| number` | `'100%'` | 组件宽度 |
| `height` | `string \| number` | `'600px'` | 组件高度 |

### 可用事件

| 事件 | 参数 | 描述 |
|------|------|------|
| `theme-change` | `theme: 'light' \| 'dark'` | 主题切换时触发 |
| `content-update` | `content: any` | 内容更新时触发 |

### 可用方法

| 方法 | 描述 |
|------|------|
| `toggleTheme()` | 切换主题 |
| `resetContent()` | 重置内容 |
| `exportContent()` | 导出内容 |

## 🔍 调试和开发

### 1. 控制台日志

组件会在控制台输出有用的调试信息：

```javascript
// 组件挂载
console.log('MixBoxLayoutWrapper 组件已挂载');

// 主题切换
console.log('主题已切换为:', theme);

// 内容更新
console.log('内容已更新:', content);
```

### 2. 开发工具

- **Vue DevTools**: 支持Vue组件的调试
- **React DevTools**: 支持React组件的调试
- **TypeScript**: 完整的类型检查和智能提示

## 🚨 常见问题

### 1. React版本兼容性

确保使用React 19和对应的veaury配置：

```typescript
import { createRoot } from 'react-dom/client'
import { setVeauryOptions } from 'veaury'

setVeauryOptions({
    react: {
        createRoot  // React 19需要
    }
})
```

### 2. 样式冲突

确保导入MixBoxLayout的样式：

```typescript
import "@xxs3315/mbl-lib/dist/index.css";
```

### 3. 类型错误

确保在`vite-env.d.ts`中正确声明了所有模块类型。

### 4. 构建错误

确保在`vite.config.ts`中正确配置了React插件和依赖优化。

## 📚 相关资源

- [veaury官方文档](https://github.com/veaury/veaury)
- [Vue 3官方文档](https://vuejs.org/)
- [React 19官方文档](https://react.dev/)
- [Vite官方文档](https://vitejs.dev/)

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个集成方案！
