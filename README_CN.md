# MBL - Mix Box Layout PDF Generator

MBL 是一个基于 React 和 Spring Boot 的 PDF 生成系统，支持可视化拖拽布局设计和数据绑定功能。

> **语言**: [English](README.md) | [中文](README_CN.md)

## 🚀 功能特性

- **可视化设计器**: 基于 React 的拖拽式页面布局设计
- **插件化架构**: 高度可扩展的插件系统，支持自定义组件和功能
- **双框架支持**: React 19 原生支持，提供 Vue 3 集成示例
- **数据绑定**: 支持本地 JSON 数据和远程 API 数据源
- **表格插件**: 强大的表格插件，支持列绑定和样式配置
- **PDF 生成**: 基于 Java 的高质量 PDF 输出
- **多主题支持**: 内置多种主题和样式
- **国际化**: 支持多语言界面

## 🏗️ 项目结构

```
mbl/
├── api/                    # Spring Boot 后端服务
│   ├── src/main/java/     # Java 源代码
│   └── src/main/resources/ # 配置文件
├── frontend/              # 前端应用和共享组件
│   ├── apps/             # 应用示例和使用演示
│   │   ├── mbl-react-mantine/    # React 19 + Mantine UI 示例
│   │   └── mbl-vue-element-plus/ # Vue 3 + Element Plus 示例
│   └── packages/         # 核心组件和插件（基于 React 19）
│       ├── mbl-core/     # 核心功能
│       ├── mbl-lib/      # 基础组件库
│       ├── mbl-dnd/      # 拖拽功能插件
│       ├── mbl-lib-plugin-table/ # 表格插件
│       ├── mbl-data-bindings/    # 数据绑定插件
│       ├── mbl-providers/        # 状态管理插件
│       ├── mbl-themes/           # 主题插件
│       └── mbl-locales/          # 国际化插件
└── data/                 # 数据存储目录
    ├── images/          # 图片资源
    └── pdfs/           # 生成的 PDF 文件
```

## 🛠️ 技术栈

### 前端
- **React 19** - 组件和插件的核心框架
- **TypeScript** - 类型安全的 JavaScript
- **Mantine** - React 组件库（React 示例）
- **Vue 3** - 备选前端框架（Vue 示例）
- **Element Plus** - Vue 组件库（Vue 示例）
- **pnpm** - 包管理器

### 后端
- **Spring Boot 3** - Java 应用框架
- **Spring Data JPA** - 数据访问层
- **H2 Database** - 嵌入式数据库
- **PostgreSQL** - 生产环境数据库
- **PDFBox** - PDF 生成库

## 📋 环境要求

### Node.js 环境
```bash
node -v
# v22.13.1

pnpm -v
# 10.14.0
```

### Java 环境
```bash
java --version
# openjdk 17.0.13 2024-10-15 LTS
# OpenJDK Runtime Environment Corretto-17.0.13.11.1 (build 17.0.13+11-LTS)
# OpenJDK 64-Bit Server VM Corretto-17.0.13.11.1 (build 17.0.13+11-LTS, mixed mode, sharing)

javac --version
# javac 17.0.13
```

### 数据库
```bash
# H2 Database (开发环境)
# 版本: 2.3.232

# PostgreSQL (生产环境)
# 版本: PostgreSQL 17.2 (Debian 17.2-1.pgdg120+1) on x86_64-pc-linux-gnu
```

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd mbl
```

### 2. 安装前端依赖
```bash
cd frontend
pnpm install
```

### 3. 构建前端包
```bash
# 构建所有包和插件
pnpm run build

# 或构建特定包
cd packages/mbl-lib
pnpm run build

cd packages/mbl-lib-plugin-table
pnpm run build
```

### 4. 启动前端开发服务器
```bash
# React 19 + Mantine 示例（推荐用于插件开发）
cd apps/mbl-react-mantine
pnpm dev

# 或 Vue 3 + Element Plus 示例（替代使用演示）
cd apps/mbl-vue-element-plus
pnpm dev
```

### 5. 启动后端服务
```bash
cd api

# 使用 H2 数据库启动（默认，用于开发）
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2

# 或使用 PostgreSQL 启动（用于生产）
./mvnw spring-boot:run -Dspring-boot.run.profiles=postgresql
```

### 6. 访问应用
- 前端: http://localhost:5173
- 后端 API: http://localhost:29080
- H2 控制台（使用 H2 配置时）: http://localhost:29080/h2-console

## 📖 使用指南

### 创建页面布局
1. 从顶部组件面板拖拽元素到画布
2. 使用右侧属性面板配置元素样式
3. 设置元素的尺寸、对齐方式、字体等属性

### 插件使用
1. **表格插件**: 拖拽表格组件，配置列数和样式
2. **数据绑定插件**: 连接数据源，实现动态内容
3. **主题插件**: 切换不同的视觉主题
4. **拖拽插件**: 支持元素的自由拖拽和排序

### 数据绑定
1. 在数据源面板添加 JSON 数据或 API 地址
2. 拖拽数据字段到表格列进行绑定
3. 配置列的显示样式和格式

### 生成 PDF
1. 完成页面设计后，点击"生成 PDF"按钮
2. 系统将根据设计生成高质量的 PDF 文档
3. PDF 文件保存在 `data/pdfs/` 目录下

## ⚙️ 配置说明

### 后端配置 (application.properties)
```properties
# PDF 文件输出目录
pdf.file.output-dir=./data/pdfs/

# 表格最大记录数限制
pdf.table.max.records=1000

# 数据库配置
spring.datasource.url=jdbc:h2:file:./data/h2db
spring.datasource.driver-class-name=org.h2.Driver
```

### 前端配置
- 主题配置: `frontend/packages/mbl-themes/`
- 国际化配置: `frontend/packages/mbl-locales/`
- 组件样式: `frontend/packages/mbl-lib/src/styles/`

## 🔧 开发指南

### 架构概述
MBL 采用模块化架构，具有以下关键特点：

1. **核心组件和插件**：所有 packages 都基于 React 19 构建，为整个系统提供基础
2. **应用示例**：两个演示应用展示如何在不同框架中集成和使用这些组件
3. **插件系统**：每个插件都是独立的 npm 包，可以单独开发、测试和发布

### 框架集成

#### React 19 集成（推荐）
- **主要框架**：所有核心组件和插件都基于 React 19 构建
- **示例应用**：`apps/mbl-react-mantine` 演示原生 React 使用方式
- **优势**：完整功能支持、最优性能、直接插件兼容性

#### Vue 3 集成（替代方案）
- **包装方式**：Vue 应用包装 React 组件实现跨框架兼容
- **示例应用**：`apps/mbl-vue-element-plus` 展示 Vue 集成模式
- **使用场景**：当你的项目主要使用 Vue 但需要 MBL 功能时

#### 核心插件类型
- **组件插件**: 提供可拖拽的 UI 组件
- **功能插件**: 提供特定功能（如数据绑定、主题等）
- **工具插件**: 提供开发工具和辅助功能

### 创建插件
1. 在 `frontend/packages/` 创建插件目录（如 `mbl-lib-plugin-yourname`）
2. 按照插件结构实现插件接口和核心功能
3. 从包的 `index.ts` 文件导出插件
4. 在应用程序的 `Designer.tsx` 组件中导入并注册插件
5. 在 `package.json` 中配置插件元数据和依赖
6. 提供插件配置面板（可选）

### 插件开发示例

#### 1. 插件元数据定义 (types.ts)
```typescript
// 插件属性接口
export interface TablePluginProps {
  id: string;
  onPropsChange?: (newProps: any) => void;
  attrs: {
    pluginId: string;
    value: string;
    background: string;
    horizontal: "left" | "center" | "right";
    vertical: "top" | "middle" | "bottom";
    // ... 其他属性
    bindings: Record<string, any>;
    columns: any[];
    bindingColumns: any[];
  };
}

// 插件元数据
export const TABLE_PLUGIN_METADATA = {
  id: "table-plugin",
  name: "TablePlugin", 
  version: "1.0.0",
  description: "表格插件 - 支持拖拽创建表格",
  type: "element" as const,
  category: "plugin-table",
  icon: "table",
  toolbarConfig: {
    label: "表格",
    icon: "table", 
    tooltip: "拖拽创建表格",
  },
  defaultConfig: {
    // 默认配置对象
    value: "",
    background: "#f2f3f5",
    columns: [/* 默认列配置 */],
    bindingColumns: [/* 默认绑定列配置 */],
    // ... 其他默认属性
  },
};
```

#### 2. 插件主文件 (table-plugin.tsx)
```typescript
import React from "react";
import { TableComponent } from "./table-component";
import { AttrPanel } from "./attr-panel";
import { TABLE_PLUGIN_METADATA, TablePluginProps } from "./types";

export const tablePlugin = {
  // 插件元数据
  metadata: TABLE_PLUGIN_METADATA,

  // 渲染主组件
  render: (props: TablePluginProps) => {
    return <TableComponent {...props} />;
  },

  // 渲染属性面板
  renderAttrPanel: (
    props: TablePluginProps,
    onPropsChange?: (newProps: TablePluginProps) => void,
  ) => {
    return <AttrPanel props={props} onPropsChange={onPropsChange} />;
  },

  // 获取工具栏配置
  getToolbarConfig: () => {
    return {
      type: "element",
      cat: "plugin-table",
      attrs: {
        pluginId: TABLE_PLUGIN_METADATA.id,
        ...TABLE_PLUGIN_METADATA.defaultConfig,
      },
    };
  },

  // 处理拖拽数据
  processDragData: (data: any) => {
    const defaultConfig = { ...TABLE_PLUGIN_METADATA.defaultConfig };
    // 重新生成内部ID，避免冲突
    const { columns, bindingColumns } = regenerateTableIds(
      defaultConfig.columns,
      defaultConfig.bindingColumns,
    );

    return {
      type: "element",
      cat: "plugin-table", 
      attrs: {
        pluginId: TABLE_PLUGIN_METADATA.id,
        ...defaultConfig,
        columns,
        bindingColumns,
      },
    };
  },
};
```

#### 3. 包入口文件 (index.ts)
```typescript
export { tablePlugin } from "./table-plugin";
export { TABLE_PLUGIN_METADATA } from "./types";
export type { TablePluginProps } from "./types";
```

#### 4. 包配置 (package.json)
```json
{
  "name": "@xxs3315/mbl-lib-plugin-table",
  "version": "1.0.0",
  "description": "Table plugin for MixBoxLayout - 表格插件",
  "main": "dist/index.js",
  "module": "dist-esm/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@xxs3315/mbl-core": "workspace:*",
    "@xxs3315/mbl-dnd": "workspace:*",
    "@xxs3315/mbl-providers": "workspace:*"
  }
}
```

#### 5. 在应用中注册插件 (Designer.tsx)
```typescript
import { tablePlugin } from "@xxs3315/mbl-lib-plugin-table";

const Designer: React.FC = () => {
  // 定义插件列表
  const plugins = [
    {
      metadata: tablePlugin.metadata,
      plugin: tablePlugin,
    },
  ];

  return (
    <MixBoxLayout
      // ... 其他属性
      plugins={plugins}
      enablePluginSystem={true}
    />
  );
};
```

### 后端 API 开发
1. 在 `api/src/main/java/` 创建控制器和服务
2. 使用 Spring Data JPA 进行数据操作
3. 添加相应的测试用例

## 🧪 测试（待完善）

### 前端测试
```bash
cd frontend
pnpm test
```

### 后端测试
```bash
cd api
./mvnw test
```

## 📦 构建部署

### 前端构建
```bash
cd frontend
pnpm build
```

### 后端构建
```bash
cd api
./mvnw clean package
```

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 项目维护者: [Your Name]
- 邮箱: [your.email@example.com]
- 项目链接: [https://github.com/yourusername/mbl](https://github.com/yourusername/mbl)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和开源社区。

### 开源组件

本项目基于以下优秀的开源库和框架构建：

#### 前端
- **[React](https://reactjs.org/)** - 用于构建用户界面的 JavaScript 库
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript 的类型化超集
- **[Mantine](https://mantine.dev/)** - React 组件和钩子库
- **[Vue.js](https://vuejs.org/)** - 渐进式 JavaScript 框架
- **[Element Plus](https://element-plus.org/)** - Vue 3 组件库
- **[Vite](https://vitejs.dev/)** - 下一代前端工具
- **[pnpm](https://pnpm.io/)** - 快速、节省磁盘空间的包管理器
- **[Axios](https://axios-http.com/)** - 基于 Promise 的 HTTP 客户端
- **[React Router](https://reactrouter.com/)** - React 声明式路由
- **[Tabler Icons](https://tabler-icons.io/)** - 免费开源图标库
- **[Ace Editor](https://ace.c9.io/)** - 可嵌入的代码编辑器
- **[React Ace](https://github.com/securingsincity/react-ace)** - Ace Editor 的 React 包装器

#### 后端
- **[Spring Boot](https://spring.io/projects/spring-boot)** - Java 应用框架
- **[Spring Data JPA](https://spring.io/projects/spring-data-jpa)** - 数据访问层
- **[H2 Database](https://www.h2database.com/)** - 内存数据库
- **[PostgreSQL](https://www.postgresql.org/)** - 开源关系型数据库
- **[PH-PDF-Layout](https://github.com/phax/ph-pdf-layout)** - Java PDF 生成库
- **[Jackson](https://github.com/FasterXML/jackson)** - JSON 处理库
- **[Lombok](https://projectlombok.org/)** - Java 注解处理器
- **[Apache Commons](https://commons.apache.org/)** - Apache Commons 工具库
- **[OkHttp](https://square.github.io/okhttp/)** - Java HTTP 客户端
- **[JSONic](https://github.com/arnx/jsonic)** - Java JSON 库
- **[Commons IO](https://commons.apache.org/proper/commons-io/)** - Apache Commons IO 工具

#### 开发工具
- **[ESLint](https://eslint.org/)** - JavaScript 代码检查工具
- **[Prettier](https://prettier.io/)** - 代码格式化工具
- **[Maven](https://maven.apache.org/)** - 构建自动化工具
- **[Rimraf](https://github.com/isaacs/rimraf)** - Node.js 深度删除模块
- **[Sort Package JSON](https://github.com/keithamus/sort-package-json)** - 排序 package.json 文件

我们感谢这些项目的维护者和贡献者对开源软件的奉献精神。

> **注意**：如有遗漏的开源组件，请联系我们添加。