/**
 * 表格插件属性接口
 */
export interface TablePluginProps {
  id: string;
  onPropsChange?: (newProps: any) => void;
  attrs: {
    pluginId: string;
    value: string;
    background: string;
    horizontal: "left" | "center" | "right";
    vertical: "top" | "middle" | "bottom";
    wildStar: boolean;
    canShrink: boolean;
    canGrow: boolean;
    flexValue: number;
    flexUnit: "px" | "%" | "pt";
    pTop: number;
    pRight: number;
    pBottom: number;
    pLeft: number;
    bindings: Record<string, any>;
    columns: any[];
    bindingColumns: any[];
  };
}

/**
 * 表格插件元数据
 */
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
    // 属性
    value: "",
    background: "#f2f3f5",
    horizontal: "left" as const,
    vertical: "top" as const,
    wildStar: false,
    canShrink: false,
    canGrow: true,
    flexValue: 100,
    flexUnit: "px" as const,
    pTop: 0,
    pRight: 0,
    pBottom: 0,
    pLeft: 0,
    bindings: {},
    columns: [
      [
        "table-root",
        {
          id: "table-root",
          title: "",
          children: ["hlG3wLEQNtxW"],
          cat: "container",
          direction: "vertical",
        },
      ],

      [
        "hlG3wLEQNtxW",
        {
          id: "hlG3wLEQNtxW",
          title: "container-hlG3wLEQNtxW",
          children: ["97p5pTRWYJL9", "e6ccaf5fd46t", "cEaNlFkj8gwV"],
          cat: "container",
          direction: "horizontal",
          wildStar: true,
          canShrink: false,
          canGrow: false,
          flexValue: 100,
          flexUnit: "px",
          horizontal: "center",
          vertical: "middle",
        },
      ],
      [
        "97p5pTRWYJL9",
        {
          id: "97p5pTRWYJL9",
          title: "text-97p5pTRWYJL9",
          cat: "text",
          value: "序号",
          horizontal: "center",
          vertical: "middle",
          font: "simsun",
          fontSize: 10,
          fontColor: "#000000",
          wildStar: false,
          canShrink: false,
          canGrow: false,
          flexValue: 16,
          flexUnit: "%",
        },
      ],
      [
        "e6ccaf5fd46t",
        {
          id: "e6ccaf5fd46t",
          title: "text-e6ccaf5fd46t",
          cat: "text",
          value: "姓名",
          horizontal: "center",
          vertical: "middle",
          font: "simsun",
          fontSize: 10,
          fontColor: "#000000",
          wildStar: false,
          canShrink: false,
          canGrow: false,
          flexValue: 50,
          flexUnit: "%",
        },
      ],
      [
        "cEaNlFkj8gwV",
        {
          id: "cEaNlFkj8gwV",
          title: "text-cEaNlFkj8gwV",
          cat: "text",
          value: "Email",
          horizontal: "center",
          vertical: "middle",
          font: "simsun",
          fontSize: 10,
          fontColor: "#000000",
          wildStar: true,
          canShrink: false,
          canGrow: false,
          flexValue: 34,
          flexUnit: "%",
        },
      ],
    ],
    bindingColumns: [
      [
        "table-root-column-binding",
        {
          id: "table-root-column-binding",
          title: "",
          children: ["hlG3wLEQNtxW-column-binding"],
          cat: "container",
          direction: "vertical",
        },
      ],

      [
        "hlG3wLEQNtxW-column-binding",
        {
          id: "hlG3wLEQNtxW-column-binding",
          title: "container-hlG3wLEQNtxW-column-binding",
          children: [
            "97p5pTRWYJL9-column-binding",
            "e6ccaf5fd46t-column-binding",
            "cEaNlFkj8gwV-column-binding",
          ],
          cat: "container",
          direction: "horizontal",
          wildStar: true,
          canShrink: false,
          canGrow: false,
          flexValue: 100,
          flexUnit: "px",
          horizontal: "center",
          vertical: "middle",
        },
      ],
      [
        "97p5pTRWYJL9-column-binding",
        {
          id: "97p5pTRWYJL9-column-binding",
          title: "text-97p5pTRWYJL9-column-binding",
          cat: "text",
          value: "",
          horizontal: "center",
          vertical: "middle",
          font: "simsun",
          fontSize: 10,
          fontColor: "#000000",
          // wildStar: false,
          // canShrink: false,
          // canGrow: false,
          // flexValue: 16,
          // flexUnit: "%",
        },
      ],
      [
        "e6ccaf5fd46t-column-binding",
        {
          id: "e6ccaf5fd46t-column-binding",
          title: "text-e6ccaf5fd46t-column-binding",
          cat: "text",
          value: "",
          horizontal: "center",
          vertical: "middle",
          font: "simsun",
          fontSize: 10,
          fontColor: "#000000",
          // wildStar: false,
          // canShrink: false,
          // canGrow: false,
          // flexValue: 50,
          // flexUnit: "%",
        },
      ],
      [
        "cEaNlFkj8gwV-column-binding",
        {
          id: "cEaNlFkj8gwV-column-binding",
          title: "text-cEaNlFkj8gwV-column-binding",
          cat: "text",
          value: "",
          horizontal: "center",
          vertical: "middle",
          font: "simsun",
          fontSize: 10,
          fontColor: "#000000",
          // wildStar: true,
          // canShrink: false,
          // canGrow: false,
          // flexValue: 34,
          // flexUnit: "%",
        },
      ],
    ],
  },
};
