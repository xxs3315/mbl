import React from "react";
import { css } from "../../styled-system/css";
import { useThemeColorsContext } from "@xxs3315/mbl-providers";
import {
  ChevronRight,
  ChevronDown,
  Square,
  Type,
  Image,
  Table,
  FileText,
  Columns3,
  Rows3,
  SeparatorHorizontal,
  FileDigit,
} from "lucide-react";
import {
  PAGE_BODY_ROOT_ID,
  PAGE_FOOTER_ROOT_ID,
  PAGE_HEADER_ROOT_ID,
  PAGE_ROOT_ID,
} from "../../constants";

// 树形节点组件
const TreeNode = React.memo<{
  item: any;
  content: Map<string, any>;
  level: number;
  onItemClick: (itemId: string) => void;
  currentSelectedId?: string;
}>(({ item, content, level, onItemClick, currentSelectedId }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const colors = useThemeColorsContext();

  const getIcon = (cat?: string, direction?: string) => {
    switch (cat) {
      case "container":
        return direction === "horizontal" ? (
          <Columns3 size={14} />
        ) : (
          <Rows3 size={14} />
        );
      case "placeholder":
        return <Square size={14} />;
      case "text":
        return <Type size={14} />;
      case "image":
        return <Image size={14} />;
      case "table":
        return <Table size={14} />;
      case "page-break":
        return <SeparatorHorizontal size={14} />;
      case "page-number":
        return <FileDigit size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  const getItemName = (item: any) => {
    if (item.id === PAGE_HEADER_ROOT_ID) return "Page Header";
    if (item.id === PAGE_BODY_ROOT_ID) return "Page Body";
    if (item.id === PAGE_FOOTER_ROOT_ID) return "Page Footer";
    return item.title || item.name || item.id.slice(0, 8);
  };

  const isSelected = currentSelectedId === item.id;

  return (
    <div>
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          paddingY: "3px",
          paddingRight: "4px",
          cursor: "pointer",
          borderRadius: "4px",
          fontSize: "12px",
        })}
        style={{
          backgroundColor: isSelected ? `${colors.primary}20` : "transparent",
          color: isSelected ? colors.primary : colors.text,
          paddingLeft: `${8 + level * 10}px`, // 使用内联样式确保动态缩进生效
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = `${colors.primary}10`;
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
        onClick={() => onItemClick(item.id)}
      >
        {hasChildren && (
          <div
            className={css({
              marginRight: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "12px",
              height: "12px",
            })}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown size={10} />
            ) : (
              <ChevronRight size={10} />
            )}
          </div>
        )}
        {!hasChildren && (
          <div className={css({ width: "12px", marginRight: "6px" })} />
        )}
        <div
          className={css({
            marginRight: "6px",
            display: "flex",
            alignItems: "center",
          })}
        >
          {getIcon(item.cat, item.direction)}
        </div>
        <span className={css({ flex: "1", lineHeight: "1.2" })}>
          {getItemName(item)}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {item.children.map((childId: string) => {
            const childItem = content.get(childId);
            return childItem ? (
              <TreeNode
                key={childId}
                item={childItem}
                content={content}
                level={level + 1}
                onItemClick={onItemClick}
                currentSelectedId={currentSelectedId}
              />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
});

// 页面结构树组件
export const PageStructureTree = React.memo<{
  currentPage: any;
  currentPageHeaderContent: Map<string, any>;
  currentPageBodyContent: Map<string, any>;
  currentPageFooterContent: Map<string, any>;
  onItemClick: (itemId: string) => void;
  currentSelectedId?: string;
}>(
  ({
    currentPage,
    currentPageHeaderContent,
    currentPageBodyContent,
    currentPageFooterContent,
    onItemClick,
    currentSelectedId,
  }) => {
    const pageHeaderRoot = currentPageHeaderContent.get(PAGE_HEADER_ROOT_ID);
    const pageBodyRoot = currentPageBodyContent.get(PAGE_BODY_ROOT_ID);
    const pageFooterRoot = currentPageFooterContent.get(PAGE_FOOTER_ROOT_ID);

    // 创建 Page 根节点
    const pageRoot = {
      id: PAGE_ROOT_ID,
      title: currentPage?.name || "当前页面",
      children: [
        PAGE_HEADER_ROOT_ID,
        PAGE_BODY_ROOT_ID,
        PAGE_FOOTER_ROOT_ID,
      ].filter((id) => {
        if (id === PAGE_HEADER_ROOT_ID) return pageHeaderRoot;
        if (id === PAGE_BODY_ROOT_ID) return pageBodyRoot;
        if (id === PAGE_FOOTER_ROOT_ID) return pageFooterRoot;
        return false;
      }),
      cat: "page",
    };

    // 创建合并的内容映射
    const mergedContent = new Map([
      [PAGE_ROOT_ID, pageRoot],
      ...currentPageHeaderContent.entries(),
      ...currentPageBodyContent.entries(),
      ...currentPageFooterContent.entries(),
    ]);

    return (
      <div className={css({ fontSize: "12px" })}>
        <TreeNode
          item={pageRoot}
          content={mergedContent}
          level={0}
          onItemClick={onItemClick}
          currentSelectedId={currentSelectedId}
        />
      </div>
    );
  },
);
