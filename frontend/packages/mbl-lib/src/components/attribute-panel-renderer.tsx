import React from "react";
import { PageRoot } from "../comps/attribute-panel/page-root";
import { PageBodyRoot } from "../comps/attribute-panel/page-body-root";
import { PageHeaderRoot } from "../comps/attribute-panel/page-header-root";
import { PageFooterRoot } from "../comps/attribute-panel/page-footer-root";
import { AttrText } from "../comps/attribute-panel/attr-text";
import { AttrImage } from "../comps/attribute-panel/attr-image";
import { AttrBlank } from "../comps/attribute-panel/attr-blank";
import {
  PAGE_BODY_ROOT_ID,
  PAGE_FOOTER_ROOT_ID,
  PAGE_HEADER_ROOT_ID,
  PAGE_ROOT_ID,
} from "../constants";

interface AttributePanelRendererProps {
  currentSelectedId: string;
  selectedItemInfo: {
    item: any;
    position: "header" | "body" | "footer" | null;
    exists: boolean;
  };
  baseUrl?: string;
  imageUploadPath?: string;
}

// 缓存组件映射，避免重复创建
const COMPONENT_MAP = {
  [PAGE_ROOT_ID]: PageRoot,
  [PAGE_BODY_ROOT_ID]: PageBodyRoot,
  [PAGE_HEADER_ROOT_ID]: PageHeaderRoot,
  [PAGE_FOOTER_ROOT_ID]: PageFooterRoot,
} as const;

export const AttributePanelRenderer: React.FC<AttributePanelRendererProps> =
  React.memo(
    ({ currentSelectedId, selectedItemInfo, baseUrl, imageUploadPath }) => {
      // 首先检查是否是特殊页面ID
      if (currentSelectedId in COMPONENT_MAP) {
        const Component =
          COMPONENT_MAP[currentSelectedId as keyof typeof COMPONENT_MAP];
        return <Component />;
      }

      // 检查是否有选中的项目
      if (!selectedItemInfo.exists || !selectedItemInfo.item) {
        return <AttrBlank />;
      }

      const itemType = selectedItemInfo.item.cat;

      // 根据项目类型渲染对应的属性面板
      switch (itemType) {
        case "text":
        case "page-number":
          return <AttrText />;
        case "image":
          return (
            <AttrImage baseUrl={baseUrl} imageUploadPath={imageUploadPath} />
          );
        default:
          return <AttrBlank />;
      }
    },
  );

AttributePanelRenderer.displayName = "AttributePanelRenderer";
