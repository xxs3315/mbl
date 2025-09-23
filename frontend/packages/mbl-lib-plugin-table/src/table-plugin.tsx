import React from "react";
import { TableComponent } from "./table-component";
import { AttrPanel } from "./attr-panel";
import { TABLE_PLUGIN_METADATA, TablePluginProps } from "./types";

/**
 * 表格插件对象
 */
export const tablePlugin = {
  metadata: TABLE_PLUGIN_METADATA,

  /**
   * 渲染表格组件
   */
  render: (props: TablePluginProps) => {
    return <TableComponent {...props} />;
  },

  /**
   * 渲染表格组件的属性面板
   */
  renderAttrPanel: (
    props: TablePluginProps,
    onPropsChange?: (newProps: TablePluginProps) => void,
  ) => {
    return <AttrPanel props={props} onPropsChange={onPropsChange} />;
  },

  /**
   * 获取工具栏配置
   */
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

  /**
   * 处理拖拽数据
   */
  processDragData: (data: any) => {
    // console.log("[Table Plugin] Processing drag data:", data);
    return {
      type: "element",
      cat: "plugin-table",
      attrs: {
        pluginId: TABLE_PLUGIN_METADATA.id,
        ...TABLE_PLUGIN_METADATA.defaultConfig,
      },
    };
  },
};

export default tablePlugin;
