import React from "react";
import { TableComponent } from "./table-component";
import { AttrPanel } from "./attr-panel";
import { TABLE_PLUGIN_METADATA, TablePluginProps } from "./types";
import { regenerateTableIds } from "./utils";

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
   * 当用户拖拽table组件到界面时，会调用此方法重新生成所有内部ID
   */
  processDragData: (data: any) => {
    console.log("[Table Plugin] 开始处理拖拽数据...");
    console.log("[Table Plugin] 拖拽数据:", data);

    // 获取默认配置
    const defaultConfig = { ...TABLE_PLUGIN_METADATA.defaultConfig };
    console.log(
      "[Table Plugin] 使用默认配置，columns数量:",
      defaultConfig.columns.length,
    );
    console.log(
      "[Table Plugin] 使用默认配置，bindingColumns数量:",
      defaultConfig.bindingColumns.length,
    );

    // 重新生成表格内部所有ID
    const { columns, bindingColumns } = regenerateTableIds(
      defaultConfig.columns,
      defaultConfig.bindingColumns,
    );

    console.log("[Table Plugin] ID重新生成完成，返回处理后的数据");

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

export default tablePlugin;
