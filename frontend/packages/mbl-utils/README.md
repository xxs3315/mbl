# @xxs3315/mbl-utils

MixBoxLayout 工具函数库

## 功能

提供 MixBoxLayout 项目中使用的通用工具函数。

### Paper 工具函数

- `mm2px(mm, dpi)` - 毫米转像素
- `px2mm(px, dpi)` - 像素转毫米
- `px2pt(px, dpi)` - 像素转点
- `pt2px(pt, dpi)` - 点转像素
- `getRectangleSize(rectangle)` - 获取页面尺寸

## 安装

```bash
pnpm add @xxs3315/mbl-utils
```

## 使用

```typescript
import { mm2px, pt2px, getRectangleSize } from '@xxs3315/mbl-utils';

// 毫米转像素
const pixels = mm2px(210, 96); // A4 宽度

// 点转像素
const pixels = pt2px(12, 96); // 12pt 字体

// 获取页面尺寸
const size = getRectangleSize('A4'); // { width: 210, height: 297 }
```

## 开发

```bash
# 构建
pnpm build

# 开发模式
pnpm dev
```
