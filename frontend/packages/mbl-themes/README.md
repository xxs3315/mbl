# @xxs3315/mbl-themes

MBL项目的主题配置和工具包，提供统一的主题管理和样式工具。

## 安装

```bash
pnpm add @xxs3315/mbl-themes
```

## 快速开始

### 1. 基础主题使用

```tsx
import { MantineProvider } from '@mantine/core';
import { theme, themeVariants, type ThemeVariant } from '@xxs3315/mbl-themes';

function App() {
  const [themeVariant, setThemeVariant] = useState<ThemeVariant>('blue');
  
  const dynamicTheme = useMemo(() => ({
    ...theme,
    ...themeVariants[themeVariant],
  }), [themeVariant]);

  return (
    <MantineProvider theme={dynamicTheme}>
      <MyApp />
    </MantineProvider>
  );
}
```

### 2. 使用主题工具

```tsx
import { useThemeColors, useThemeStyles } from '@xxs3315/mbl-themes';

function MyComponent() {
  const colors = useThemeColors();
  const styles = useThemeStyles();
  
  return (
    <div style={styles.card}>
      <h1 style={{ color: colors.primary }}>标题</h1>
      <p style={{ color: colors.textSecondary }}>副标题</p>
      <button style={styles.button.primary}>
        主要按钮
      </button>
    </div>
  );
}
```

## API 参考

### 主题配置

- `theme` - Mantine主题配置对象
- `themeVariants` - 主题变体配置
- `ThemeVariant` - 主题变体类型

### 主题工具

- `useThemeColors()` - 获取当前主题颜色
- `useThemeStyles()` - 获取预定义样式
- `getThemeColorShades(colorName)` - 获取指定颜色的所有色阶
- `getThemeColorShade(colorName, shade)` - 获取指定颜色的特定色阶

## 构建

```bash
# 构建CommonJS和ESM版本
pnpm run build

# 清理构建文件
pnpm run clean
```

## 许可证

MIT License
