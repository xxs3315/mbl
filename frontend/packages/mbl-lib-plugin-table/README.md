# @xxs3315/mbl-lib-plugin-table

表格插件包，为 MixBoxLayout 提供表格功能。

## 功能特性

- 🎯 **拖拽创建**: 从工具栏拖拽创建表格
- 📊 **表格配置**: 支持行列数、边框、样式等配置
- 🎨 **样式定制**: 支持表头、单元格样式自定义
- 📱 **响应式**: 支持缩放和DPI适配
- 🔧 **插件化**: 完全插件化设计，无侵入集成

## 安装

```bash
pnpm add @xxs3315/mbl-lib-plugin-table
```

## 使用方法

### 1. 导入插件

```typescript
import { tablePlugin, TABLE_PLUGIN_METADATA } from '@xxs3315/mbl-lib-plugin-table';
```

### 2. 在 MixBoxLayout 中使用

```typescript
import { MixBoxLayout } from '@xxs3315/mbl-lib';
import { tablePlugin } from '@xxs3315/mbl-lib-plugin-table';

function App() {
  const plugins = [tablePlugin];

  return (
    <MixBoxLayout
      plugins={plugins}
      enablePluginSystem={true}
      // 其他属性...
    />
  );
}
```

## 插件配置

### 默认配置

```typescript
{
  // 表格基本属性
  rows: 3,                    // 行数
  cols: 3,                    // 列数
  borderWidth: 1,             // 边框宽度
  borderColor: '#000000',     // 边框颜色
  borderStyle: 'solid',       // 边框样式
  
  // 单元格属性
  cellPadding: 8,             // 单元格内边距
  cellBackground: '#ffffff',  // 单元格背景色
  cellTextColor: '#000000',   // 单元格文字颜色
  cellFontSize: 12,           // 单元格字体大小
  cellFontFamily: 'Arial, sans-serif', // 单元格字体
  
  // 表头属性
  headerBackground: '#f5f5f5', // 表头背景色
  headerTextColor: '#000000',  // 表头文字颜色
  headerFontSize: 14,          // 表头字体大小
  headerFontWeight: 'bold',    // 表头字体粗细
  
  // 布局属性
  width: 300,                  // 宽度
  height: 200,                 // 高度
  background: '#ffffff',       // 背景色
  horizontal: 'left',          // 水平对齐
  vertical: 'top',             // 垂直对齐
  wildStar: false,             // 通配符
  canShrink: false,            // 可收缩
  canGrow: true,               // 可扩展
  flexValue: 100,              // 弹性值
  flexUnit: 'px',              // 弹性单位
  pTop: 0,                     // 上边距
  pRight: 0,                   // 右边距
  pBottom: 0,                  // 下边距
  pLeft: 0,                    // 左边距
  bindings: []                 // 绑定配置
}
```

## 插件接口

### TablePluginProps

```typescript
interface TablePluginProps {
  id: string;
  attrs: {
    pluginId: string;
    rows: number;
    cols: number;
    borderWidth: number;
    borderColor: string;
    borderStyle: string;
    cellPadding: number;
    cellBackground: string;
    cellTextColor: string;
    cellFontSize: number;
    cellFontFamily: string;
    headerBackground: string;
    headerTextColor: string;
    headerFontSize: number;
    headerFontWeight: string;
    width: number;
    height: number;
    background: string;
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'middle' | 'bottom';
    wildStar: boolean;
    canShrink: boolean;
    canGrow: boolean;
    flexValue: number;
    flexUnit: 'px' | '%' | 'pt';
    pTop: number;
    pRight: number;
    pBottom: number;
    pLeft: number;
    bindings: any[];
  };
  scale: number;
  dpi: number;
}
```

## 开发

### 构建

```bash
# 构建 CommonJS 版本
pnpm run build:cjs

# 构建 ESM 版本
pnpm run build:esm

# 构建所有版本
pnpm run build
```

### 开发模式

```bash
# 监听模式
pnpm run dev
```

## 许可证

MIT
