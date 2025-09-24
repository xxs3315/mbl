# MBL - Mix Box Layout PDF Generator

MBL is a PDF generation system based on React and Spring Boot, supporting visual drag-and-drop layout design and data binding functionality.

> **Language**: [English](README.md) | [中文](README_CN.md)

## 🚀 Features

- **Visual Designer**: React-based drag-and-drop page layout design
- **Plugin Architecture**: Highly extensible plugin system supporting custom components and functionality
- **Dual Framework Support**: React 19 native support with Vue 3 integration examples
- **Data Binding**: Support for local JSON data and remote API data sources
- **Table Plugin**: Powerful table plugin with column binding and style configuration
- **PDF Generation**: High-quality PDF output based on Java
- **Multi-Theme Support**: Built-in multiple themes and styles
- **Internationalization**: Multi-language interface support

## 🏗️ Project Structure

```
mbl/
├── api/                    # Spring Boot backend service
│   ├── src/main/java/     # Java source code
│   └── src/main/resources/ # Configuration files
├── frontend/              # Frontend applications and shared components
│   ├── apps/             # Application examples and usage demos
│   │   ├── mbl-react-mantine/    # React 19 + Mantine UI example
│   │   └── mbl-vue-element-plus/ # Vue 3 + Element Plus example
│   └── packages/         # Core components and plugins (React 19 based)
│       ├── mbl-core/     # Core functionality
│       ├── mbl-lib/      # Base component library
│       ├── mbl-dnd/      # Drag and drop functionality plugin
│       ├── mbl-lib-plugin-table/ # Table plugin
│       ├── mbl-data-bindings/    # Data binding plugin
│       ├── mbl-providers/        # State management plugin
│       ├── mbl-themes/           # Theme plugin
│       └── mbl-locales/          # Internationalization plugin
└── data/                 # Data storage directory
    ├── images/          # Image resources
    └── pdfs/           # Generated PDF files
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - Core framework for components and plugins
- **TypeScript** - Type-safe JavaScript
- **Mantine** - React component library (React example)
- **Vue 3** - Alternative frontend framework (Vue example)
- **Element Plus** - Vue component library (Vue example)
- **pnpm** - Package manager

### Backend
- **Spring Boot 3** - Java application framework
- **Spring Data JPA** - Data access layer
- **H2 Database** - Embedded database
- **PostgreSQL** - Production database
- **PDFBox** - PDF generation library

## 📋 Requirements

### Node.js Environment
```bash
node -v
# v22.13.1

pnpm -v
# 10.14.0
```

### Java Environment
```bash
java --version
# openjdk 17.0.13 2024-10-15 LTS
# OpenJDK Runtime Environment Corretto-17.0.13.11.1 (build 17.0.13+11-LTS)
# OpenJDK 64-Bit Server VM Corretto-17.0.13.11.1 (build 17.0.13+11-LTS, mixed mode, sharing)

javac --version
# javac 17.0.13
```

### Database
```bash
# H2 Database (Development)
# Version: 2.3.232

# PostgreSQL (Production)
# Version: PostgreSQL 17.2 (Debian 17.2-1.pgdg120+1) on x86_64-pc-linux-gnu
```

## 🚀 Quick Start

### 1. Clone the Project
```bash
git clone <repository-url>
cd mbl
```

### 2. Install Frontend Dependencies
```bash
cd frontend
pnpm install
```

### 3. Start Frontend Development Server
```bash
# React 19 + Mantine example (recommended for plugin development)
cd apps/mbl-react-mantine
pnpm dev

# Or Vue 3 + Element Plus example (alternative usage demo)
cd apps/mbl-vue-element-plus
pnpm dev
```

### 4. Start Backend Service
```bash
cd api
./mvnw spring-boot:run
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

## 📖 User Guide

### Creating Page Layouts
1. Drag elements from the left component panel to the canvas
2. Use the right property panel to configure element styles
3. Set element dimensions, alignment, fonts, and other properties

### Plugin Usage
1. **Table Plugin**: Drag table components and configure columns and styles
2. **Data Binding Plugin**: Connect data sources for dynamic content
3. **Theme Plugin**: Switch between different visual themes
4. **Drag Plugin**: Support free dragging and sorting of elements

### Data Binding
1. Add JSON data or API addresses in the data source panel
2. Drag data fields to table columns for binding
3. Configure column display styles and formats

### PDF Generation
1. After completing the page design, click the "Generate PDF" button
2. The system will generate high-quality PDF documents based on the design
3. PDF files are saved in the `data/pdfs/` directory

## ⚙️ Configuration

### Backend Configuration (application.properties)
```properties
# PDF file output directory
pdf.file.output-dir=./data/pdfs/

# Table maximum records limit
pdf.table.max.records=1000

# Database configuration
spring.datasource.url=jdbc:h2:file:./data/h2db
spring.datasource.driver-class-name=org.h2.Driver
```

### Frontend Configuration
- Theme configuration: `frontend/packages/mbl-themes/`
- Internationalization configuration: `frontend/packages/mbl-locales/`
- Component styles: `frontend/packages/mbl-lib/src/styles/`

## 🔧 Development Guide

### Architecture Overview
MBL adopts a modular architecture with the following key characteristics:

1. **Core Components & Plugins**: All packages are built on React 19, providing the foundation for the entire system
2. **Application Examples**: Two demo applications show how to integrate and use these components in different frameworks
3. **Plugin System**: Each plugin is an independent npm package that can be developed, tested, and published separately

### Framework Integration

#### React 19 Integration (Recommended)
- **Primary Framework**: All core components and plugins are built with React 19
- **Example App**: `apps/mbl-react-mantine` demonstrates native React usage
- **Benefits**: Full feature support, optimal performance, direct plugin compatibility

#### Vue 3 Integration (Alternative)
- **Wrapper Approach**: Vue app wraps React components for cross-framework compatibility
- **Example App**: `apps/mbl-vue-element-plus` shows Vue integration patterns
- **Use Case**: When your project primarily uses Vue but needs MBL functionality

#### Core Plugin Types
- **Component Plugins**: Provide draggable UI components
- **Feature Plugins**: Provide specific functionality (data binding, themes, etc.)
- **Tool Plugins**: Provide development tools and utilities

### Creating New Component Plugins
1. Create a plugin directory in `frontend/packages/`
2. Implement component interfaces and rendering logic
3. Register components in `frontend/packages/mbl-lib/src/component-registry.ts`
4. Configure plugin metadata and dependencies

### Creating Feature Plugins
1. Create a plugin directory in `frontend/packages/`
2. Implement plugin interfaces and core functionality
3. Integrate and configure in applications
4. Provide plugin configuration panels (optional)

### Plugin Development Example

#### 1. Plugin Metadata Definition (types.ts)
```typescript
// Plugin property interface
export interface TablePluginProps {
  id: string;
  onPropsChange?: (newProps: any) => void;
  attrs: {
    pluginId: string;
    value: string;
    background: string;
    horizontal: "left" | "center" | "right";
    vertical: "top" | "middle" | "bottom";
    // ... other properties
    bindings: Record<string, any>;
    columns: any[];
    bindingColumns: any[];
  };
}

// Plugin metadata
export const TABLE_PLUGIN_METADATA = {
  id: "table-plugin",
  name: "TablePlugin", 
  version: "1.0.0",
  description: "Table plugin - supports drag-and-drop table creation",
  type: "element" as const,
  category: "plugin-table",
  icon: "table",
  toolbarConfig: {
    label: "Table",
    icon: "table", 
    tooltip: "Drag to create table",
  },
  defaultConfig: {
    // Default configuration object
    value: "",
    background: "#f2f3f5",
    columns: [/* default column configuration */],
    bindingColumns: [/* default binding column configuration */],
    // ... other default properties
  },
};
```

#### 2. Plugin Main File (table-plugin.tsx)
```typescript
import React from "react";
import { TableComponent } from "./table-component";
import { AttrPanel } from "./attr-panel";
import { TABLE_PLUGIN_METADATA, TablePluginProps } from "./types";

export const tablePlugin = {
  // Plugin metadata
  metadata: TABLE_PLUGIN_METADATA,

  // Render main component
  render: (props: TablePluginProps) => {
    return <TableComponent {...props} />;
  },

  // Render property panel
  renderAttrPanel: (
    props: TablePluginProps,
    onPropsChange?: (newProps: TablePluginProps) => void,
  ) => {
    return <AttrPanel props={props} onPropsChange={onPropsChange} />;
  },

  // Get toolbar configuration
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

  // Process drag data
  processDragData: (data: any) => {
    const defaultConfig = { ...TABLE_PLUGIN_METADATA.defaultConfig };
    // Regenerate internal IDs to avoid conflicts
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

#### 3. Package Entry File (index.ts)
```typescript
export { tablePlugin } from "./table-plugin";
export { TABLE_PLUGIN_METADATA } from "./types";
export type { TablePluginProps } from "./types";
```

#### 4. Package Configuration (package.json)
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

### Backend API Development
1. Create controllers and services in `api/src/main/java/`
2. Use Spring Data JPA for data operations
3. Add corresponding test cases

## 🧪 Testing (To Be Improved)

### Frontend Testing
```bash
cd frontend
pnpm test
```

### Backend Testing
```bash
cd api
./mvnw test
```

## 📦 Build & Deployment

### Frontend Build
```bash
cd frontend
pnpm build
```

### Backend Build
```bash
cd api
./mvnw clean package
```

### Docker Deployment
```bash
# Build image
docker build -t mbl-app .

# Run container
docker run -p 8080:8080 mbl-app
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- Project Maintainer: [Your Name]
- Email: [your.email@example.com]
- Project Link: [https://github.com/yourusername/mbl](https://github.com/yourusername/mbl)

## 🙏 Acknowledgments

Thanks to all developers and the open source community who have contributed to this project.

### Open Source Components

This project is built on the following excellent open source libraries and frameworks:

#### Frontend
- **[React](https://reactjs.org/)** - A JavaScript library for building user interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Typed superset of JavaScript
- **[Mantine](https://mantine.dev/)** - React components and hooks library
- **[Vue.js](https://vuejs.org/)** - Progressive JavaScript framework
- **[Element Plus](https://element-plus.org/)** - Vue 3 component library
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[Axios](https://axios-http.com/)** - Promise-based HTTP client
- **[React Router](https://reactrouter.com/)** - Declarative routing for React
- **[Tabler Icons](https://tabler-icons.io/)** - Free and open source icons
- **[Ace Editor](https://ace.c9.io/)** - Embeddable code editor
- **[React Ace](https://github.com/securingsincity/react-ace)** - React wrapper for Ace Editor

#### Backend
- **[Spring Boot](https://spring.io/projects/spring-boot)** - Java application framework
- **[Spring Data JPA](https://spring.io/projects/spring-data-jpa)** - Data access layer
- **[H2 Database](https://www.h2database.com/)** - In-memory database
- **[PostgreSQL](https://www.postgresql.org/)** - Open source relational database
- **[PH-PDF-Layout](https://github.com/phax/ph-pdf-layout)** - Java PDF generation library
- **[Jackson](https://github.com/FasterXML/jackson)** - JSON processing library
- **[Lombok](https://projectlombok.org/)** - Java annotation processor
- **[Apache Commons](https://commons.apache.org/)** - Apache Commons utilities
- **[OkHttp](https://square.github.io/okhttp/)** - HTTP client for Java
- **[JSONic](https://github.com/arnx/jsonic)** - JSON library for Java
- **[Commons IO](https://commons.apache.org/proper/commons-io/)** - Apache Commons IO utilities

#### Development Tools
- **[ESLint](https://eslint.org/)** - JavaScript linting utility
- **[Prettier](https://prettier.io/)** - Code formatter
- **[Maven](https://maven.apache.org/)** - Build automation tool
- **[Rimraf](https://github.com/isaacs/rimraf)** - Deep deletion module for Node.js
- **[Sort Package JSON](https://github.com/keithamus/sort-package-json)** - Sort package.json files

We are grateful to the maintainers and contributors of these projects for their dedication to open source software.

> **Note**: If we have missed any open source components, please contact us to add them.
