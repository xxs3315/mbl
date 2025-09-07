import React, { useEffect, useState } from "react";
import {
  DragEndMeta,
  DragHandleComponent,
  DropLineRendererInjectedProps,
  GhostRendererMeta,
  Item,
  List,
  PlaceholderRendererInjectedProps,
  PlaceholderRendererMeta,
  StackedGroupRendererInjectedProps,
} from "@xxs3315/mbl-core";
import { css } from "./styled-system/css";
import { cloneDeep } from "lodash-es";
import arrayMove from "array-move";
import { nanoid } from "nanoid";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndTarget } from "./dnd/target";
import { ItemTypes } from "./dnd/item-types";
import {
  MantineProvider,
  Textarea,
  Image as MantineImage,
  ActionIcon,
  Popover,
  NavLink,
} from "@mantine/core";
import { useThemeColors } from "./utils/theme-utils";
import { theme, themeVariants, type ThemeVariant } from "./theme";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ContentData, PageItem } from "@xxs3315/mbl-typings";
import {
  ContentsStoreContext,
  createContentsStore,
  useContentsStoreContext,
  useTemporal,
} from "./store/store";
import { defaultContents } from "./store/default-data";
import {
  Redo,
  Undo,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  LayoutDashboard,
} from "lucide-react";
import { DpiProvider, useDpi } from "./providers/dpi-provider";
import { getRectangleSize, mm2px, pt2px } from "./utils/paper";
import { useMount } from "react-use";
import { MacScrollbar } from "mac-scrollbar";
import "mac-scrollbar/dist/mac-scrollbar.css";
import {
  CurrentSelectedIdProvider,
  useCurrentSelectedId,
} from "./providers/current-selected-id-provider";
import {
  PAGE_BODY_ROOT_ID,
  PAGE_FOOTER_ROOT_ID,
  PAGE_HEADER_ROOT_ID,
  PAGE_ROOT_ID,
} from "./constants";
import { AttributePanelRenderer } from "./comps/attribute-panel/components/attribute-panel-renderer";
import { Box } from "./dnd/box";
import { toolPanelComps } from "./comps/tool-panel/data";
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
  const colors = useThemeColors();

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
const PageStructureTree = React.memo<{
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

// 内部组件，在 MantineProvider 内部使用 useThemeColors
const MixBoxLayoutContent = React.memo<{
  onContentChange?: (updatedContents: ContentData) => void;
  baseUrl?: string;
  imageUploadPath?: string;
  imageDownloadPath?: string;
}>(({ onContentChange, baseUrl, imageUploadPath, imageDownloadPath }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { dpi, setDpi } = useDpi();

  const getDPI = () => {
    const dpiDiv = document.createElement("div");
    dpiDiv.style.cssText =
      "width:1in;height:1in;position:absolute;left:-100%;top:-100%;";
    document.body.appendChild(dpiDiv);
    const dpi = dpiDiv.offsetWidth;
    document.body.removeChild(dpiDiv);
    return dpi;
  };

  useMount(() => {
    setDpi(getDPI());
  });

  // 定义颜色常量
  const colors = useThemeColors();

  const { currentSelectedId, setCurrentSelectedId } = useCurrentSelectedId();

  // 侧边栏显示状态 - 初始时在桌面端显示，移动端隐藏
  const [showPageSelector, setShowPageSelector] = React.useState(true);
  const [showLeftSidebar, setShowLeftSidebar] = React.useState(true);
  const [showRightSidebar, setShowRightSidebar] = React.useState(true);
  const [isMobileMode, setIsMobileMode] = React.useState(false);

  // 监听容器大小变化，在小屏幕上隐藏侧边栏
  React.useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = () => {
      if (containerRef.current) {
        const isMobile = containerRef.current.offsetWidth < 768;
        setIsMobileMode(isMobile);

        if (isMobile) {
          // 小屏幕时隐藏侧边栏
          setShowPageSelector(false);
          setShowLeftSidebar(false);
          setShowRightSidebar(false);
        } else {
          // 桌面端时显示侧边栏（如果之前被隐藏了）
          setShowPageSelector(true);
          setShowLeftSidebar(true);
          setShowRightSidebar(true);
        }
      }
    };

    // 使用 ResizeObserver 监听容器大小变化
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // 初始检查
    handleResize();

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  // 优化全局事件处理，减少事件冒泡
  React.useEffect(() => {
    const handleGlobalMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // 如果点击的是交互按钮，阻止事件冒泡
      if (
        // target.closest("[data-drag-handle]") ||
        target.closest("[data-interactive]") ||
        target.closest("[data-popover-target]")
      ) {
        e.stopPropagation();
      }
    };

    // const handleGlobalMouseMove = (e: MouseEvent) => {
    //   // 在拖拽过程中阻止不必要的事件传播
    //   if (e.buttons > 0) {
    //     // 鼠标按下状态
    //     e.stopPropagation();
    //   }
    // };

    // 使用passive: true提高性能
    document.addEventListener("mousedown", handleGlobalMouseDown, {
      passive: false,
    });
    // document.addEventListener("mousemove", handleGlobalMouseMove, {
    //   passive: false,
    // });

    return () => {
      document.removeEventListener("mousedown", handleGlobalMouseDown);
      // document.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, []);

  // 使用单个订阅获取所有需要的状态
  const state = useContentsStoreContext((s) => s);
  const pages = state.pages;
  const currentPageIndex = state.currentPageIndex;
  const currentPageHeaderContent = state.currentPageHeaderContent;
  const currentPageBodyContent = state.currentPageBodyContent;
  const currentPageFooterContent = state.currentPageFooterContent;
  const setCurrentPageIndex = state.setCurrentPageIndex;
  const setCurrentPageAndContent = state.setCurrentPageAndContent;
  const updateTextItemValue = state.updateTextItemValue;

  const currentPage = React.useMemo(() => {
    return pages[currentPageIndex];
  }, [pages, currentPageIndex]);

  // 从当前页面获取所有属性
  const currentPageRectangle = currentPage?.rectangle;
  const currentPageOrientation = currentPage?.orientation;
  const currentPageMTop = currentPage?.mTop;
  const currentPageMRight = currentPage?.mRight;
  const currentPageMBottom = currentPage?.mBottom;
  const currentPageMLeft = currentPage?.mLeft;
  const currentPagePTop = currentPage?.mTopBody;
  const currentPagePRight = currentPage?.mRightBody;
  const currentPagePBottom = currentPage?.mBottomBody;
  const currentPagePLeft = currentPage?.mLeftBody;
  const currentPageHeaderPTop = currentPage?.mTopHeader;
  const currentPageHeaderPRight = currentPage?.mRightHeader;
  const currentPageHeaderPBottom = currentPage?.mBottomHeader;
  const currentPageHeaderPLeft = currentPage?.mLeftHeader;

  const [canvasWidth, setCanvasWidth] = React.useState(1920);
  const [canvasHeight, setCanvasHeight] = React.useState(1080);

  useEffect(() => {
    console.log(`DPI: ${dpi}`);
    const width = mm2px(getRectangleSize(currentPageRectangle).width, dpi);
    const height = mm2px(getRectangleSize(currentPageRectangle).height, dpi);
    console.log(currentPageRectangle, currentPageOrientation, width, height);
    setCanvasWidth(currentPageOrientation === "portrait" ? width : height);
    setCanvasHeight(currentPageOrientation === "portrait" ? height : width);
  }, [dpi, currentPageRectangle, currentPageOrientation]);

  const renderDropLineElement = React.useCallback(
    (injectedProps: DropLineRendererInjectedProps) => {
      return (
        <div
          data-name={"drop"}
          ref={injectedProps.ref}
          className={css({
            position: "relative",
            height: "4px",
            zIndex: "30",
          })}
          style={{
            ...injectedProps.style,
            backgroundColor: colors.primary,
          }}
        >
          <div
            style={{
              content: '""',
              position: "absolute",
              top: "-2px",
              left: "-4px",
              height: "8px",
              width: "8px",
              borderRadius: "50%",
              backgroundColor: colors.primary,
            }}
          />
          <div
            style={{
              content: '""',
              position: "absolute",
              top: "-2px",
              right: "-4px",
              height: "8px",
              width: "8px",
              borderRadius: "50%",
              backgroundColor: colors.primary,
            }}
          />
        </div>
      );
    },
    [colors.primary],
  );

  const dotsSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-grip-vertical-icon lucide-grip-vertical"
    >
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  );

  const copySVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-copy-icon lucide-copy"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );

  const deleteSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-trash2-icon lucide-trash-2"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );

  const navSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-table-of-contents-icon lucide-table-of-contents"
    >
      <path d="M16 5H3" />
      <path d="M16 12H3" />
      <path d="M16 19H3" />
      <path d="M21 5h.01" />
      <path d="M21 12h.01" />
      <path d="M21 19h.01" />
    </svg>
  );

  const renderGhostElement = React.useCallback(
    ({ isGroup }: GhostRendererMeta<string>) => {
      return (
        <div
          data-name={"ghost"}
          className={css({
            height: "full",
            width: "full",
            transformOrigin: "32px 32px",
            opacity: "0.8",
            boxShadow: "lg",
            zIndex: "20",
            ...(isGroup
              ? {
                  borderRadius: "none",
                  border: "1px solid",
                  paddingX: "0",
                  paddingBottom: "0",
                }
              : {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  borderRadius: "none",
                  border: "1px solid",
                  borderColor: "gray.300",
                  backgroundColor: "white",
                  padding: "0",
                  fontWeight: "bold",
                  fontSize: "xs",
                  lineHeight: "tight",
                }),
          })}
          style={{
            borderColor: isGroup ? "#e5e7eb" : undefined, // gray.300 equivalent
            backgroundColor: isGroup ? "#f3f4f620" : undefined, // primaryLight with 20% opacity
            color: isGroup ? "#3b82f6" : undefined, // primary color
          }}
        >
          <DragHandleComponent className={css({ display: "none" })}>
            {dotsSVG}
          </DragHandleComponent>
        </div>
      );
    },
    [dotsSVG],
  );

  const renderPlaceholderElement = React.useCallback(
    (
      injectedProps: PlaceholderRendererInjectedProps,
      { isGroup }: PlaceholderRendererMeta<string>,
    ) => (
      <div
        data-name={"placeholder"}
        className={css({
          height: "full",
          width: "full",
          transformOrigin: "32px 32px",
          boxShadow: "lg",
          zIndex: "20",
          borderStyle: "dashed",
          backgroundColor: "transparent",
          ...(isGroup
            ? {
                opacity: "0.4",
              }
            : {
                opacity: "0.8",
                color: "gray.300",
              }),
        })}
        style={{
          ...injectedProps.style,
          borderColor: isGroup ? "#3b82f6" : undefined, // primary color
          backgroundColor: isGroup ? "#f3f4f620" : undefined, // primaryLight with 20% opacity
        }}
      >
        <DragHandleComponent className={css({ display: "none" })}>
          {dotsSVG}
        </DragHandleComponent>
      </div>
    ),
    [dotsSVG],
  );

  const renderStackedGroupElement = React.useCallback(
    (injectedProps: StackedGroupRendererInjectedProps) => (
      <div
        data-name={"stacked-group"}
        className={css({
          borderRadius: "none",
          border: "1px solid",
          paddingX: "0",
          paddingBottom: "0",
        })}
        style={{
          ...injectedProps.style,
          borderColor: colors.primaryLight,
          backgroundColor: `${colors.primaryLight}20`,
          boxShadow: `0 0 0 2px ${colors.primary}`,
        }}
      />
    ),
    [colors.primaryLight, colors.primary],
  );

  const findItemsRecursive = (id: string, position: string) => {
    let childIds: string[] = [];
    const newMap = cloneDeep(
      new Map(
        position === "header"
          ? currentPageHeaderContent.entries()
          : position === "footer"
            ? currentPageFooterContent.entries()
            : currentPageBodyContent.entries(),
      ),
    );
    const item = newMap.get(id);
    if (item && item.children) {
      item.children.map((childId: string) => {
        childIds.push(childId);
        childIds = childIds.concat(findItemsRecursive(childId, position));
      });
    }
    return childIds;
  };

  // 定义工具函数
  const copyItem = (id: string, type: string) => {
    console.log("copy item", id);
    const newMap = cloneDeep(
      new Map(
        type === "header"
          ? currentPageHeaderContent.entries()
          : type === "footer"
            ? currentPageFooterContent.entries()
            : currentPageBodyContent.entries(),
      ),
    );
    const item = newMap.get(id);
    if (item === undefined) return;
    let childIds = [id];
    childIds = childIds.concat(findItemsRecursive(id, type));

    // 复制左右的childIds
    const copyTargetIds: Record<string, string> = {};
    childIds.map((cid) => {
      copyTargetIds[cid] = nanoid(12);
    });
    //寻找所有的childIds对应的Item，将其中的id children替换成新的id
    const copyTargets: PageItem[] = [];
    childIds.map((cid) => {
      const t = cloneDeep(newMap.get(cid));
      if (t) {
        t.id = copyTargetIds[cid];
        const newChildren: string[] = [];
        t.children?.map((ccid: any) => {
          newChildren.push(copyTargetIds[ccid]);
        });
        t.children = newChildren;
        copyTargets.push(t);
      }
    });

    // 全局查找id在何处，并在其后追加对应的新id
    newMap.forEach((mapItem: any) => {
      if (mapItem.children && mapItem.children.indexOf(id) >= 0) {
        mapItem.children.splice(
          mapItem.children.indexOf(id),
          0,
          copyTargetIds[id],
        );
      }
    });

    // 将复制的新items加入到map中
    copyTargets.forEach((target) => {
      newMap.set(target.id, target);
    });

    // 同步到 store
    if (currentPage && setCurrentPageAndContent) {
      setCurrentPageAndContent(currentPageIndex, newMap, type as any);
    }
  };

  const deleteItem = (id: string, type: string) => {
    const newMap = cloneDeep(
      new Map(
        type === "header"
          ? currentPageHeaderContent.entries()
          : type === "footer"
            ? currentPageFooterContent.entries()
            : currentPageBodyContent.entries(),
      ),
    );
    const item = newMap.get(id);
    if (item === undefined) return;
    let childIds = [id];
    childIds = childIds.concat(findItemsRecursive(id, type));

    // 全局查找id在何处，并删除
    newMap.forEach((mapItem: any) => {
      if (mapItem.children && mapItem.children.indexOf(id) >= 0) {
        mapItem.children.splice(mapItem.children.indexOf(id), 1);
      }
    });

    // 从map中删除
    childIds.forEach((target) => {
      newMap.delete(target);
    });

    // 同步到 store
    if (currentPage && setCurrentPageAndContent) {
      setCurrentPageAndContent(
        currentPageIndex,
        newMap as Map<string, PageItem>,
        type as any,
      );
    }
  };

  const onDragEnd = React.useCallback(
    (
      meta: DragEndMeta<string>,
      position: "header" | "body" | "footer" = "body",
    ) => {
      if (
        meta.groupIdentifier === meta.nextGroupIdentifier &&
        meta.index === meta.nextIndex
      )
        return;

      let contentMap;
      let rootId;

      switch (position) {
        case "header":
          contentMap = currentPageHeaderContent;
          rootId = PAGE_HEADER_ROOT_ID;
          break;
        case "footer":
          contentMap = currentPageFooterContent;
          rootId = PAGE_FOOTER_ROOT_ID;
          break;
        case "body":
        default:
          contentMap = currentPageBodyContent;
          rootId = PAGE_BODY_ROOT_ID;
          break;
      }

      const newMap = cloneDeep(new Map(contentMap.entries()));
      const item = newMap.get(meta.identifier);
      if (item === undefined) return;
      const groupItem = newMap.get(meta.groupIdentifier ?? rootId);
      if (groupItem === undefined) return;
      if (groupItem.children === undefined) return;

      if (meta.groupIdentifier === meta.nextGroupIdentifier) {
        const nextIndex = meta.nextIndex ?? groupItem.children?.length ?? 0;
        (groupItem as any).children = arrayMove(
          groupItem.children,
          meta.index,
          nextIndex,
        );
      } else {
        if ((item as any).cat === "page-break") return; // 禁止在组间移动分页符
        const nextGroupItem = newMap.get(meta.nextGroupIdentifier ?? rootId);
        if (nextGroupItem === undefined) return;
        if (nextGroupItem.children === undefined) return;

        (groupItem as any).children.splice(meta.index, 1);
        if (meta.nextIndex === undefined) {
          // Inserts an item to a group which has no items.
          (nextGroupItem as any).children.push(meta.identifier);
        } else {
          // Insets an item to a group.
          (nextGroupItem as any).children.splice(
            meta.nextIndex,
            0,
            (item as any).id,
          );
        }
      }

      // store 变化
      if (currentPage && setCurrentPageAndContent) {
        setCurrentPageAndContent(
          currentPageIndex,
          newMap as Map<string, any>,
          position,
        );

        // 注意：拖拽后路径缓存会自动失效，因为缓存键包含了内容结构信息
        // 当内容结构变化时，新的缓存键会生成，确保 popover 显示正确的层级关系
      }
    },
    [
      PAGE_HEADER_ROOT_ID,
      PAGE_BODY_ROOT_ID,
      PAGE_FOOTER_ROOT_ID,
      currentPageHeaderContent,
      currentPageBodyContent,
      currentPageFooterContent,
      currentPage,
      currentPageIndex,
      setCurrentPageAndContent,
    ],
  );

  // 为每个popover创建独立的状态管理
  const [popoverStates, setPopoverStates] = useState<Record<string, boolean>>(
    {},
  );

  // 路径缓存，避免重复计算
  const pathCache = React.useRef<Map<string, any[]>>(new Map());

  // 切换特定popover的状态
  const togglePopover = React.useCallback((itemId: string) => {
    setPopoverStates((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }, []);

  // 检查特定popover是否打开
  const isPopoverOpen = React.useCallback(
    (itemId: string) => {
      return popoverStates[itemId] || false;
    },
    [popoverStates],
  );

  // 关闭所有popover
  const closePopover = React.useCallback(() => {
    setPopoverStates({});
  }, []);

  const onDragStart = React.useCallback((meta: any) => {
    console.log("drag start: ", meta.identifier);
  }, []);

  const getFlexStyle = React.useMemo(() => {
    return (item: any) => {
      const flexValue = item.wildStar
        ? "1"
        : `${item.canGrow ? "1" : "0"} ${item.canShrink ? "1" : "0"} ${item.flexUnit === "%" ? item.flexValue : pt2px(item.flexValue ?? 0, dpi)}${item.flexUnit}`;
      return { flex: flexValue };
    };
  }, [dpi]);

  const renderHorizontalDropLineElement = React.useCallback(
    (injectedProps: DropLineRendererInjectedProps) => {
      return (
        <div
          data-name={"drop-horizontal"}
          ref={injectedProps.ref}
          className={css({
            position: "relative",
            height: "auto",
            width: "4px",
            zIndex: "30",
          })}
          style={{
            ...injectedProps.style,
            backgroundColor: colors.primary,
          }}
        >
          <div
            style={{
              content: '""',
              position: "absolute",
              top: "-4px",
              left: "-2px",
              height: "8px",
              width: "8px",
              borderRadius: "50%",
              backgroundColor: colors.primary,
            }}
          />
          <div
            style={{
              content: '""',
              position: "absolute",
              bottom: "-4px",
              left: "-2px",
              height: "8px",
              width: "8px",
              borderRadius: "50%",
              backgroundColor: colors.primary,
            }}
          />
        </div>
      );
    },
    [colors.primary],
  );
  const renderHorizontalGhostElement = React.useCallback(
    ({ isGroup }: GhostRendererMeta<string>) => {
      return (
        <div
          data-name={"ghost-horizontal"}
          className={css({
            height: "full",
            width: "full",
            transformOrigin: "32px center",
            opacity: "0.8",
            boxShadow: "lg",
            zIndex: "20",
            ...(isGroup
              ? {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  border: "1px solid",
                  padding: "0",
                  fontWeight: "bold",
                  fontSize: "xs",
                  lineHeight: "tight",
                }
              : {
                  display: "flex",
                  height: "full",
                  minWidth: "128px",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: "none",
                  border: "1px solid",
                  borderColor: "gray.300",
                  backgroundColor: "white",
                  paddingX: "16px",
                  paddingY: "8px",
                }),
          })}
          style={{
            borderColor: isGroup ? colors.primaryLight : undefined,
            backgroundColor: isGroup ? `${colors.primaryLight}20` : undefined,
            color: isGroup ? colors.primary : undefined,
          }}
        >
          <DragHandleComponent className={css({ display: "none" })}>
            {dotsSVG}
          </DragHandleComponent>
        </div>
      );
    },
    [dotsSVG],
  );
  const renderHorizontalPlaceholderElement = React.useCallback(
    (injectedProps: PlaceholderRendererInjectedProps) => (
      <div
        data-name={"placeholder-horizontal"}
        className={css({
          display: "flex",
          height: "full",
          minWidth: "128px",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "none",
          border: "1px dashed",
          borderColor: "gray.300",
          backgroundColor: "transparent",
          color: "gray.300",
          paddingX: "16px",
          paddingY: "8px",
          position: "relative",
        })}
        style={{
          ...injectedProps.style,
          backgroundColor: `${colors.primaryLight}20`,
        }}
      >
        <DragHandleComponent className={css({ display: "none" })}>
          {dotsSVG}
        </DragHandleComponent>
      </div>
    ),
    [dotsSVG],
  );
  const renderHorizontalStackedGroupElement = React.useCallback(
    (injectedProps: StackedGroupRendererInjectedProps) => (
      <div
        data-name={"stacked-group-horizontal"}
        className={css({
          display: "flex",
          width: "full",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          border: "1px solid",
          padding: "0",
          fontWeight: "bold",
          fontSize: "xs",
          lineHeight: "tight",
          minHeight: "full",
        })}
        style={{
          ...injectedProps.style,
          borderColor: colors.primaryLight,
          backgroundColor: `${colors.primaryLight}20`,
          color: colors.primary,
          boxShadow: `0 0 0 2px ${colors.primary}`,
        }}
      />
    ),
    [colors.primaryLight, colors.primary],
  );

  const stableAcceptArrays = React.useMemo(
    () => ({
      containerAndElement: [ItemTypes.CONTAINER, ItemTypes.ELEMENT],
      containerElementPageHeader: [
        ItemTypes.CONTAINER,
        ItemTypes.ELEMENT,
        ItemTypes.PAGE_HEADER_ELEMENT,
      ],
      containerElementPageBody: [
        ItemTypes.CONTAINER,
        ItemTypes.ELEMENT,
        ItemTypes.PAGE_BODY_ELEMENT,
      ],
      containerElementPageFooter: [
        ItemTypes.CONTAINER,
        ItemTypes.ELEMENT,
        ItemTypes.PAGE_FOOTER_ELEMENT,
      ],
    }),
    [],
  );

  // 预定义稳定的样式对象
  const stableMoreStyles = React.useMemo(
    () => ({
      marginTop0: { marginTop: 0 },
      marginTop0Full: {
        marginTop: 0,
        padding: 0,
        width: "100%",
        height: "100%",
        minHeight: "24px",
      },
      flexStart: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginTop: 0,
      },
      flexCenter: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 0,
      },
      flexEnd: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        marginTop: 0,
      },
    }),
    [],
  );

  // 根据 vertical 属性获取稳定的样式对象
  const getVerticalStyle = React.useMemo(() => {
    return (vertical?: string) => {
      if (vertical === "top") return stableMoreStyles.flexStart;
      if (vertical === "bottom") return stableMoreStyles.flexEnd;
      return stableMoreStyles.flexCenter;
    };
  }, [stableMoreStyles]);

  // 处理 IME 输入的 Textarea 组件
  const TextareaWithComposition = React.memo<{
    props: any;
    updateTextItemValue: (itemId: string, newValue: string) => void;
  }>(({ props, updateTextItemValue }) => {
    const [localValue, setLocalValue] = React.useState(props.value ?? "");
    const [isComposing, setIsComposing] = React.useState(false);
    const debounceTimeoutRef = React.useRef<number | null>(null);

    // 同步外部值变化到本地状态
    React.useEffect(() => {
      setLocalValue(props.value ?? "");
    }, [props.value]);

    // 防抖更新函数
    const debouncedUpdate = React.useCallback(
      (value: string) => {
        if (debounceTimeoutRef.current) {
          window.clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = window.setTimeout(() => {
          if (updateTextItemValue && value !== props.value) {
            updateTextItemValue(props.id, value);
          }
        }, 300); // 300ms 防抖延迟
      },
      [updateTextItemValue, props.id, props.value],
    );

    // 清理定时器
    React.useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          window.clearTimeout(debounceTimeoutRef.current);
        }
      };
    }, []);

    const handleCompositionStart = React.useCallback(() => {
      setIsComposing(true);
    }, []);

    const handleCompositionEnd = React.useCallback(
      (event: React.CompositionEvent<HTMLTextAreaElement>) => {
        setIsComposing(false);
        const value = event.currentTarget.value;
        setLocalValue(value);
        // 输入法结束时立即更新
        if (updateTextItemValue && value !== props.value) {
          updateTextItemValue(props.id, value);
        }
      },
      [props.id, props.value, updateTextItemValue],
    );

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.currentTarget.value;
        setLocalValue(value);

        // 只有在非输入法状态下才进行防抖更新
        if (!isComposing) {
          debouncedUpdate(value);
        }
      },
      [isComposing, debouncedUpdate],
    );

    // 缓存样式对象以避免重复创建
    const textareaStyles = React.useMemo(
      () => ({
        root: {
          paddingTop: `${props.pTop ?? 0}px`,
          paddingRight: `${props.pRight ?? 0}px`,
          paddingBottom: `${props.pBottom ?? 0}px`,
          paddingLeft: `${props.pLeft ?? 0}px`,
        },
        input: {
          textIndent: props.indent ? "2em" : 0,
          fontSize: pt2px(props.fontSize ?? 0, dpi),
          fontWeight: props.bold ? "bolder" : "normal",
          color: props.fontColor,
          background: props.background,
          textAlign: props.horizontal,
          border: "none",
          padding: 0,
          "--input-height": "16px",
          borderRadius: 0,
        },
      }),
      [
        props.pTop,
        props.pRight,
        props.pBottom,
        props.pLeft,
        props.indent,
        props.fontSize,
        props.bold,
        props.fontColor,
        props.background,
        props.horizontal,
        dpi,
      ],
    );

    return (
      <Textarea
        autosize
        size="xs"
        radius="xs"
        value={localValue}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        styles={textareaStyles}
      />
    );
  });

  const getComponent = React.useCallback(
    (props: any, position: "header" | "body" | "footer" = "body") => {
      switch (props.cat) {
        case "text":
          return (
            <TextareaWithComposition
              key={`${position}-item-${props.id}-target`}
              props={props}
              updateTextItemValue={(itemId: string, newValue: string) =>
                updateTextItemValue(itemId, newValue, position)
              }
            />
          );
        case "image":
          return (
            <div
              style={{
                marginTop: `${pt2px(props.pTop ?? 0, dpi)}px`,
                marginRight: `${pt2px(props.pRight ?? 0, dpi)}px`,
                marginBottom: `${pt2px(props.pBottom ?? 0, dpi)}px`,
                marginLeft: `${pt2px(props.pLeft ?? 0, dpi)}px`,
              }}
            >
              <MantineImage
                key={`${position}-item-${props.id}-target`}
                radius="xs"
                h={"auto"}
                fit="scale-down"
                src={props.value && props.value.length > 0 ? props.value : null}
                styles={{
                  root: {
                    width: `${pt2px(props.width ?? 0, dpi)}px`,
                    margin: `${
                      props.horizontal === "left"
                        ? "0 auto 0 0"
                        : props.horizontal === "right"
                          ? "0 0 0 auto"
                          : "0 auto"
                    }`,
                  },
                }}
              />
            </div>
          );
        case "page-break":
          return (
            <div
              key={`item-${props.id}-target`}
              className={css({
                display: "flex",
                height: "16px",
                width: "full",
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              <div
                className={css({
                  height: "8px",
                  width: "full",
                  backgroundColor: "red.300",
                })}
              />
            </div>
          );
        case "placeholder":
          return (
            <div
              style={{
                marginTop: `${pt2px(props.pTop ?? 0, dpi)}px`,
                marginRight: `${pt2px(props.pRight ?? 0, dpi)}px`,
                marginBottom: `${pt2px(props.pBottom ?? 0, dpi)}px`,
                marginLeft: `${pt2px(props.pLeft ?? 0, dpi)}px`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pt2px(props.width ?? 0, dpi)}px`,
                  height: `${pt2px(props.height ?? 0, dpi)}px`,
                  background: `${props.background}`,
                  margin: `${
                    props.horizontal === "left"
                      ? "0 auto 0 0"
                      : props.horizontal === "right"
                        ? "0 0 0 auto"
                        : "0 auto"
                  }`,
                }}
              />
            </div>
          );
        case "page-number":
          return (
            <TextareaWithComposition
              key={`${position}-item-${props.id}-target`}
              props={props}
              updateTextItemValue={(itemId: string, newValue: string) =>
                updateTextItemValue(itemId, newValue, position)
              }
            />
          );
        default:
          return <span key={`${position}-item-${props.id}-target`} />;
      }
    },
    [updateTextItemValue, currentPageOrientation, currentPageRectangle],
  );

  // 缓存的路径查找函数
  const getCachedPath = React.useCallback(
    (itemId: string, content: Map<string, any>, rootId: string) => {
      // 生成更精确的缓存键，包含内容的结构信息
      const contentHash = Array.from(content.entries())
        .map(([id, item]) => `${id}:${item.children?.join(",") || ""}`)
        .join("|");
      const cacheKey = `${itemId}-${rootId}-${contentHash}`;

      if (pathCache.current.has(cacheKey)) {
        return pathCache.current.get(cacheKey)!;
      }

      const path: any[] = [];
      let currentId = itemId;

      while (currentId && currentId !== rootId) {
        const currentItem = content.get(currentId);
        if (currentItem) {
          path.unshift(currentItem);
          // 查找父项目
          let parentFound = false;
          for (const [id, item] of content.entries()) {
            if (item.children && item.children.includes(currentId)) {
              currentId = id;
              parentFound = true;
              break;
            }
          }
          if (!parentFound) break;
        } else {
          break;
        }
      }

      // 添加root项目
      const rootItem = content.get(rootId);
      if (rootItem) {
        path.unshift(rootItem);
      }

      pathCache.current.set(cacheKey, path);
      return path;
    },
    [],
  );

  // 公共的Popover渲染函数
  const renderPopover = React.useCallback(
    (itemId: string) => {
      // 查找当前选中项目所在的position和content
      let currentPosition: "header" | "body" | "footer" = "body";
      let currentContent = currentPageBodyContent;

      if (currentPageHeaderContent.has(itemId)) {
        currentPosition = "header";
        currentContent = currentPageHeaderContent;
      } else if (currentPageFooterContent.has(itemId)) {
        currentPosition = "footer";
        currentContent = currentPageFooterContent;
      } else if (currentPageBodyContent.has(itemId)) {
        currentPosition = "body";
        currentContent = currentPageBodyContent;
      }

      // 获取对应position的root ID
      const rootId =
        currentPosition === "header"
          ? PAGE_HEADER_ROOT_ID
          : currentPosition === "footer"
            ? PAGE_FOOTER_ROOT_ID
            : PAGE_BODY_ROOT_ID;

      // 使用缓存的路径查找
      const itemPath = getCachedPath(itemId, currentContent, rootId);

      return (
        <Popover
          offset={2}
          opened={isPopoverOpen(itemId)}
          width={200}
          position="bottom"
          withArrow
          shadow="xs"
          onDismiss={() => closePopover()}
          styles={{
            dropdown: {
              padding: "1px",
              borderRadius: "1px",
            },
          }}
        >
          <Popover.Target>
            <div
              data-popover-target="true"
              className={css({
                height: "12px",
                width: "12px",
                cursor: "pointer",
                borderRadius: "none",
                color: "black",
                position: "absolute",
                top: "0",
                right: "0",
                zIndex: "10",
              })}
              style={{
                display: itemId === currentSelectedId ? "block" : "none",
                backgroundColor: colors.primaryLight,
              }}
              onClick={(e) => {
                e.stopPropagation();
                togglePopover(itemId);
              }}
            >
              {navSVG}
            </div>
          </Popover.Target>
          <Popover.Dropdown>
            {/* 显示上级项目 */}
            {itemPath.slice(0, -1).map((item: any, index: number) => (
              <NavLink
                key={item.id}
                label={item.title || item.id.slice(0, 8)}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSelectedId(item.id);
                  closePopover();
                }}
                styles={{
                  root: {
                    padding: "0",
                    marginBottom: "0",
                    borderRadius: "0",
                    textAlign: "center",
                  },
                }}
              />
            ))}

            {/* 显示当前项目 */}
            {(() => {
              const currentItem = currentContent.get(itemId);
              if (currentItem) {
                return (
                  <NavLink
                    key={currentItem.id}
                    label={currentItem.title || currentItem.id.slice(0, 8)}
                    active={true}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSelectedId(currentItem.id);
                      closePopover();
                    }}
                    styles={{
                      root: {
                        padding: "0",
                        marginBottom: "0",
                        borderRadius: "0",
                        textAlign: "center",
                      },
                    }}
                  />
                );
              }
              return null;
            })()}
          </Popover.Dropdown>
        </Popover>
      );
    },
    [
      isPopoverOpen,
      closePopover,
      togglePopover,
      getCachedPath,
      setCurrentSelectedId,
      colors.primaryLight,
      navSVG,
      currentPageHeaderContent,
      currentPageBodyContent,
      currentPageFooterContent,
      PAGE_HEADER_ROOT_ID,
      PAGE_BODY_ROOT_ID,
      PAGE_FOOTER_ROOT_ID,
    ],
  );

  // 公共的拖拽手柄渲染函数
  const renderDragHandle = React.useCallback(
    (itemId: string, position: "header" | "body" | "footer" = "body") => {
      return (
        <DragHandleComponent
          data-drag-handle="true"
          className={css({
            height: "12px",
            width: "12px",
            cursor: "grab",
            borderRadius: "none",
            color: "black",
            position: "absolute",
            top: "0",
            left: "0",
            zIndex: "10",
            display: "block",
          })}
        >
          <div
            style={{
              backgroundColor: colors.primaryLight,
              display: itemId === currentSelectedId ? "block" : "none",
            }}
          >
            {dotsSVG}
          </div>
        </DragHandleComponent>
      );
    },
    [currentSelectedId, colors.primaryLight, dotsSVG],
  );

  // 公共的复制按钮渲染函数
  const renderCopyButton = React.useCallback(
    (itemId: string, position: "header" | "body" | "footer" = "body") => {
      return (
        <div
          data-interactive="true"
          className={css({
            height: "12px",
            width: "12px",
            cursor: "pointer",
            borderRadius: "none",
            color: "black",
            position: "absolute",
            top: "0",
            right: "32px",
            zIndex: "10",
          })}
          style={{
            display: itemId === currentSelectedId ? "block" : "none",
            backgroundColor: colors.primaryLight,
          }}
          onClick={(event) => {
            copyItem(itemId, position);
            event.stopPropagation();
          }}
        >
          {copySVG}
        </div>
      );
    },
    [currentSelectedId, colors.primaryLight, copySVG, copyItem],
  );

  // 公共的删除按钮渲染函数
  const renderDeleteButton = React.useCallback(
    (itemId: string, position: "header" | "body" | "footer" = "body") => {
      return (
        <div
          data-interactive="true"
          className={css({
            height: "12px",
            width: "12px",
            cursor: "pointer",
            borderRadius: "none",
            color: "black",
            position: "absolute",
            top: "0",
            right: "16px",
            zIndex: "10",
          })}
          style={{
            display: itemId === currentSelectedId ? "block" : "none",
            backgroundColor: colors.primaryLight,
          }}
          onClick={(event) => {
            deleteItem(itemId, position);
            event.stopPropagation();
          }}
        >
          {deleteSVG}
        </div>
      );
    },
    [currentSelectedId, colors.primaryLight, deleteSVG, deleteItem],
  );

  function onDndDropEnd(
    dropItem: any,
    position: "header" | "footer" | "body",
    id: string,
  ) {
    let contentMap;
    switch (position) {
      case "header":
        contentMap = currentPageHeaderContent;
        break;
      case "footer":
        contentMap = currentPageFooterContent;
        break;
      case "body":
      default:
        contentMap = currentPageBodyContent;
        break;
    }

    // 找到对应的target
    const newMap = cloneDeep(new Map(contentMap.entries()));
    const target = newMap.get(id);
    if (target === undefined) return;

    const newId = nanoid(12);
    if (target.direction) {
      // 目标是group，则添加进children
      if (target.children) {
        const arr = target.children.concat();
        arr.push(newId);
        target.children = arr;
      } else {
        target.children = [newId];
      }
      const v: any = {
        id: newId,
        title: `${dropItem.cat}-${newId}`,
        children: undefined,
        cat: dropItem.cat,
      };
      if (dropItem.cat === "container") {
        // 若drag的是container
        v["direction"] = dropItem.attrs.direction;
        v["children"] = [];
        v["wildStar"] = dropItem.attrs.wildStar;
        v["canShrink"] = dropItem.attrs.canShrink;
        v["canGrow"] = dropItem.attrs.canGrow;
        v["flexValue"] = dropItem.attrs.flexValue;
        v["flexUnit"] = dropItem.attrs.flexUnit;
        v["horizontal"] = dropItem.attrs.horizontal;
        v["vertical"] = dropItem.attrs.vertical;
      }
      if (dropItem.cat === "placeholder") {
        // 若drag的是text
        v["width"] = dropItem.attrs.width;
        v["height"] = dropItem.attrs.height;
        v["horizontal"] = dropItem.attrs.horizontal;
        v["vertical"] = dropItem.attrs.vertical;
        v["wildStar"] = dropItem.attrs.wildStar;
        v["canShrink"] = dropItem.attrs.canShrink;
        v["canGrow"] = dropItem.attrs.canGrow;
        v["flexValue"] = dropItem.attrs.flexValue;
        v["flexUnit"] = dropItem.attrs.flexUnit;
        v["background"] = dropItem.attrs.background;
      }
      if (dropItem.cat === "text") {
        // 若drag的是text
        v["value"] = dropItem.attrs.value ?? "";
        v["width"] = dropItem.attrs.width;
        v["height"] = dropItem.attrs.height;
        v["horizontal"] = dropItem.attrs.horizontal;
        v["vertical"] = dropItem.attrs.vertical;
        v["font"] = dropItem.attrs.font;
        v["fontSize"] = dropItem.attrs.fontSize;
        v["fontColor"] = dropItem.attrs.fontColor;
        v["wildStar"] = dropItem.attrs.wildStar;
        v["canShrink"] = dropItem.attrs.canShrink;
        v["canGrow"] = dropItem.attrs.canGrow;
        v["flexValue"] = dropItem.attrs.flexValue;
        v["flexUnit"] = dropItem.attrs.flexUnit;
        v["pLeft"] = dropItem.attrs.pLeft;
        v["pRight"] = dropItem.attrs.pRight;
        v["pTop"] = dropItem.attrs.pTop;
        v["pBottom"] = dropItem.attrs.pBottom;
      }
      if (dropItem.cat === "image") {
        // 若drag的是image
        v["value"] = dropItem.attrs.value;
        v["width"] = dropItem.attrs.width;
        v["height"] = dropItem.attrs.height;
        v["horizontal"] = dropItem.attrs.horizontal;
        v["vertical"] = dropItem.attrs.vertical;
        v["wildStar"] = dropItem.attrs.wildStar;
        v["canShrink"] = dropItem.attrs.canShrink;
        v["canGrow"] = dropItem.attrs.canGrow;
        v["flexValue"] = dropItem.attrs.flexValue;
        v["flexUnit"] = dropItem.attrs.flexUnit;
      }
      if (dropItem.cat === "table") {
        // 若drag的是table
        v["value"] = dropItem.attrs.value;
        v["columns"] = dropItem.attrs.columns;
        v["bindings"] = dropItem.attrs.bindings;
        v["horizontal"] = dropItem.attrs.horizontal;
        v["vertical"] = dropItem.attrs.vertical;
        v["vertical"] = dropItem.attrs.vertical;
        v["wildStar"] = dropItem.attrs.wildStar;
        v["canShrink"] = dropItem.attrs.canShrink;
        v["canGrow"] = dropItem.attrs.canGrow;
        v["flexValue"] = dropItem.attrs.flexValue;
        v["flexUnit"] = dropItem.attrs.flexUnit;
      }
      if (dropItem.cat === "page-number") {
        // 若drag的是text
        v["value"] = dropItem.attrs.value;
        v["width"] = dropItem.attrs.width;
        v["height"] = dropItem.attrs.height;
        v["horizontal"] = dropItem.attrs.horizontal;
        v["vertical"] = dropItem.attrs.vertical;
        v["font"] = dropItem.attrs.font;
        v["fontSize"] = dropItem.attrs.fontSize;
        v["fontColor"] = dropItem.attrs.fontColor;
        v["wildStar"] = dropItem.attrs.wildStar;
        v["canShrink"] = dropItem.attrs.canShrink;
        v["canGrow"] = dropItem.attrs.canGrow;
        v["flexValue"] = dropItem.attrs.flexValue;
        v["flexUnit"] = dropItem.attrs.flexUnit;
        v["pLeft"] = dropItem.attrs.pLeft;
        v["pRight"] = dropItem.attrs.pRight;
        v["pTop"] = dropItem.attrs.pTop;
        v["pBottom"] = dropItem.attrs.pBottom;
      }
      console.log("new item", newId, v);
      newMap.set(newId, v);
    } else {
      // 是item, 则视drag的元素改变配置 TODO
      console.log("drop to element: ", id);
    }

    // store 变化
    if (currentPage && setCurrentPageAndContent) {
      setCurrentPageAndContent(
        currentPageIndex,
        newMap as Map<string, any>,
        position,
      );
      setCurrentSelectedId(newId);
    }
  }

  const createItemElement = React.useCallback(
    (
      item: any,
      index: number,
      position: "header" | "body" | "footer" = "body",
    ) => {
      if (item.children != undefined) {
        let contentMap;
        switch (position) {
          case "header":
            contentMap = currentPageHeaderContent;
            break;
          case "footer":
            contentMap = currentPageFooterContent;
            break;
          case "body":
          default:
            contentMap = currentPageBodyContent;
            break;
        }

        const childItems = item.children.map(
          (itemId: string) => contentMap.get(itemId)!,
        );
        const childItemElements = childItems.map(
          (childItem: any, childIndex: number) =>
            createItemElement(childItem, childIndex, position),
        );

        if (item.direction === "horizontal") {
          return (
            <Item
              key={`item-h-${item.id}`}
              identifier={item.id}
              index={index}
              isGroup
              isUsedCustomDragHandlers={true}
              onTap={(event) => {
                event?.stopPropagation();
                setCurrentSelectedId(item.id);
              }}
              currentSelectedId={currentSelectedId}
              moreStyle={getFlexStyle(item)}
            >
              <div
                className={css({
                  position: "relative",
                  flex: "1",
                })}
                style={{
                  boxShadow:
                    item.id === currentSelectedId
                      ? `0 0 0 1px ${colors.primary}`
                      : "none",
                }}
              >
                {renderDragHandle(item.id, position)}
                {renderCopyButton(item.id, position)}
                {renderDeleteButton(item.id, position)}
                {renderPopover(item.id)}
                <List
                  identifier={`list-h-${item.id}`}
                  className={css({ width: "full" })}
                  renderDropLine={renderHorizontalDropLineElement}
                  renderGhost={renderHorizontalGhostElement}
                  renderPlaceholder={renderHorizontalPlaceholderElement}
                  renderStackedGroup={renderHorizontalStackedGroupElement}
                  direction="horizontal"
                  onDragEnd={(meta) => onDragEnd(meta, position)}
                  onDragStart={(meta) => {
                    console.log("drag start: ", meta.identifier);
                  }}
                >
                  <div
                    className={css({
                      display: "flex",
                      width: "full",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      border: "1px solid",
                      padding: "0",
                      fontWeight: "bold",
                      fontSize: "xs",
                      lineHeight: "tight",
                    })}
                    style={{
                      borderColor: colors.primaryLight,
                      backgroundColor: `${colors.primaryLight}20`,
                      color: colors.primary,
                    }}
                    key={`item-h-${item.id}-div`}
                  >
                    {/*<div className={styles.horizontalheading}>{item.title}</div>*/}
                    <DndTarget
                      identifier={item.id}
                      data-title={item.title}
                      accept={stableAcceptArrays.containerAndElement}
                      lastDroppedItem={null}
                      onDrop={(dropItem) =>
                        onDndDropEnd(dropItem, position, item.id)
                      }
                      key={`item-h-${item.id}-target`}
                      greedy={false}
                      moreStyle={getVerticalStyle(item.vertical)}
                    >
                      {childItemElements}
                    </DndTarget>
                  </div>
                </List>
              </div>
            </Item>
          );
        }
        if (item.direction === "vertical") {
          return (
            <Item
              key={`item-v-${item.id}`}
              identifier={item.id}
              index={index}
              isGroup
              isUsedCustomDragHandlers={true}
              onTap={(event) => {
                event?.stopPropagation();
                setCurrentSelectedId(item.id);
              }}
              currentSelectedId={currentSelectedId}
              moreStyle={getFlexStyle(item)}
            >
              <div
                className={css({
                  position: "relative",
                  flex: "1",
                })}
                style={{
                  boxShadow:
                    item.id === currentSelectedId
                      ? `0 0 0 1px ${colors.primary}`
                      : "none",
                }}
              >
                {renderDragHandle(item.id, position)}
                {renderCopyButton(item.id, position)}
                {renderDeleteButton(item.id, position)}
                {renderPopover(item.id)}
                <List
                  identifier={`list-v-${item.id}`}
                  className={css({ width: "full" })}
                  renderDropLine={renderDropLineElement}
                  renderGhost={renderGhostElement}
                  renderPlaceholder={renderPlaceholderElement}
                  renderStackedGroup={renderStackedGroupElement}
                  onDragEnd={(meta) => onDragEnd(meta, position)}
                  onDragStart={(meta) => {
                    console.log("drag start: ", meta.identifier);
                  }}
                >
                  <div
                    className={css({
                      borderRadius: "none",
                      border: "1px solid",
                      paddingX: "0",
                      paddingBottom: "0",
                    })}
                    style={{
                      borderColor: colors.primaryLight,
                      backgroundColor: `${colors.primaryLight}20`,
                    }}
                    key={`item-h-${item.id}-div`}
                  >
                    {/*<div className={styles.heading}>{item.title}</div>*/}
                    <DndTarget
                      identifier={item.id}
                      data-title={item.title}
                      accept={stableAcceptArrays.containerAndElement}
                      lastDroppedItem={null}
                      onDrop={(dropItem) =>
                        onDndDropEnd(dropItem, position, item.id)
                      }
                      key={`item-h-${item.id}-target`}
                      greedy={false}
                      moreStyle={stableMoreStyles.marginTop0}
                    >
                      {childItemElements}
                    </DndTarget>
                  </div>
                </List>
              </div>
            </Item>
          );
        }
      }

      return (
        <Item
          key={item.id}
          identifier={item.id}
          index={index}
          isUsedCustomDragHandlers={true}
          onTap={(event) => {
            event?.stopPropagation();
            setCurrentSelectedId(item.id);
          }}
          currentSelectedId={currentSelectedId}
          moreStyle={getFlexStyle(item)}
        >
          <div
            className={css({
              position: "relative",
              flex: "1",
            })}
            style={{
              boxShadow: "none",
            }}
          >
            {renderDragHandle(item.id, position)}
            {renderCopyButton(item.id, position)}
            {renderDeleteButton(item.id, position)}
            {renderPopover(item.id)}
            <div
              className={css({
                display: "flex",
                height: "full",
                width: "full",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
                borderRadius: "none",
                border: "none",
                backgroundColor: "white",
                padding: "0",
                fontWeight: "bold",
                fontSize: "xs",
                lineHeight: "tight",
              })}
              style={{
                color: colors.primary,
                boxShadow:
                  item.id === currentSelectedId
                    ? `0 0 0 1px ${colors.primary}`
                    : "none",
              }}
              key={`item-${item.id}-div`}
            >
              <div
                className={css({
                  height: "full",
                  minHeight: "16px",
                  width: "full",
                  padding: "0px",
                })}
              >
                {getComponent(item, position)}
              </div>
            </div>
          </div>
        </Item>
      );
    },
    [
      currentPageHeaderContent,
      currentPageBodyContent,
      currentPageFooterContent,
      getFlexStyle,
      getComponent,
      copyItem,
      deleteItem,
      renderDropLineElement,
      renderGhostElement,
      renderPlaceholderElement,
      renderStackedGroupElement,
      renderHorizontalDropLineElement,
      renderHorizontalGhostElement,
      renderHorizontalPlaceholderElement,
      renderHorizontalStackedGroupElement,
      onDragEnd,
      dotsSVG,
      copySVG,
      deleteSVG,
      renderPopover,
      renderDragHandle,
      renderCopyButton,
      renderDeleteButton,
    ],
  );

  const createItemElements = React.useCallback(
    (position: "header" | "body" | "footer") => {
      let rootItem;
      let contentMap;

      switch (position) {
        case "header":
          rootItem = currentPageHeaderContent.get(PAGE_HEADER_ROOT_ID);
          contentMap = currentPageHeaderContent;
          break;
        case "footer":
          rootItem = currentPageFooterContent.get(PAGE_FOOTER_ROOT_ID);
          contentMap = currentPageFooterContent;
          break;
        case "body":
        default:
          rootItem = currentPageBodyContent.get(PAGE_BODY_ROOT_ID);
          contentMap = currentPageBodyContent;
          break;
      }

      if (!rootItem || !rootItem.children) {
        return [];
      }

      const topLevelItems = rootItem.children
        .map((itemId: any) => contentMap.get(itemId))
        .filter(Boolean); // 过滤掉未找到的项目

      return topLevelItems.map((item, index) =>
        createItemElement(item, index, position),
      );
    },
    [
      currentPageHeaderContent,
      currentPageBodyContent,
      currentPageFooterContent,
      createItemElement,
      PAGE_HEADER_ROOT_ID,
      PAGE_BODY_ROOT_ID,
      PAGE_FOOTER_ROOT_ID,
    ],
  );

  const headerElements = React.useMemo(() => {
    return createItemElements("header");
  }, [createItemElements]);

  const bodyElements = React.useMemo(() => {
    return createItemElements("body");
  }, [createItemElements]);

  const footerElements = React.useMemo(() => {
    return createItemElements("footer");
  }, [createItemElements]);

  // 生成页面选择器的选项
  const pageSelectOptions = React.useMemo(() => {
    if (!pages) return [];

    return pages.map((page, index) => ({
      value: page.id,
      label: page.name || `页面 ${index + 1}`,
    }));
  }, [pages]);

  const temporal = useTemporal();
  const [undoCount, setUndoCount] = React.useState(0);
  const [redoCount, setRedoCount] = React.useState(0);

  // 获取 store 实例
  const store = React.useContext(ContentsStoreContext);

  // 监听撤销重做栈的变化
  React.useEffect(() => {
    // 初始化计数
    const initialState = temporal.getState();
    setUndoCount(initialState.undoStack.length);
    setRedoCount(initialState.redoStack.length);

    // 订阅temporal store的变化
    const unsubscribe = temporal.subscribe((state: any) => {
      setUndoCount(state.undoStack.length);
      setRedoCount(state.redoStack.length);
    });

    return unsubscribe;
  }, [temporal]);

  // 监听 store 变化并调用 onContentChange
  React.useEffect(() => {
    if (!onContentChange || !store) return;

    const unsubscribe = store.subscribe(() => {
      const currentState = store.getState();

      // 将 Map 格式的数据转换回数组格式
      const updatedContents: ContentData = {
        config: currentState.config,
        pages: currentState.pages.map((page: any) => ({
          ...page,
          pageHeaderContent: Array.from(page.pageHeaderContent.entries()),
          pageBodyContent: Array.from(page.pageBodyContent.entries()),
          pageFooterContent: Array.from(page.pageFooterContent.entries()),
        })),
        currentPageIndex: currentState.currentPageIndex,
      };

      onContentChange(updatedContents);
    });

    return unsubscribe;
  }, [onContentChange, store]);

  // 缓存选中项信息，避免重复查找
  const selectedItemInfo = React.useMemo(() => {
    if (!currentSelectedId) {
      return { item: null, position: null, exists: false };
    }

    // 按优先级查找：header -> body -> footer
    let item = currentPageHeaderContent.get(currentSelectedId);
    let position: "header" | "body" | "footer" | null = "header";

    if (!item) {
      item = currentPageBodyContent.get(currentSelectedId);
      position = "body";
    }

    if (!item) {
      item = currentPageFooterContent.get(currentSelectedId);
      position = "footer";
    }

    if (!item) {
      position = null;
    }

    return {
      item,
      position,
      exists: !!item,
    };
  }, [
    currentSelectedId,
    currentPageHeaderContent,
    currentPageBodyContent,
    currentPageFooterContent,
  ]);

  const compAttrPanel = React.useMemo(() => {
    return (
      <AttributePanelRenderer
        currentSelectedId={currentSelectedId}
        selectedItemInfo={selectedItemInfo}
        baseUrl={baseUrl}
        imageUploadPath={imageUploadPath}
      />
    );
  }, [currentSelectedId, selectedItemInfo, baseUrl, imageUploadPath]);

  return (
    <div
      ref={containerRef}
      className={css({
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        flex: "1",
      })}
    >
      {/* 全局遮罩层 - 在小屏幕上显示左侧页面选择器时显示 */}
      {showPageSelector && (
        <div
          className={css({
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: "50",
            display: isMobileMode ? "block" : "none",
          })}
          onClick={() => {
            setShowPageSelector(false);
          }}
        />
      )}
      {/* 左侧页面选择器 - PDF 页面样式 */}
      <div
        className={css({
          width: showPageSelector ? "180px" : "0px",
          borderRight: showPageSelector ? "1px solid" : "none",
          borderRightColor: "gray.300",
          padding: "0px",
          backgroundColor: "gray.50",
          overflowY: "auto",
          overflowX: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: showPageSelector ? "1" : "0",
          visibility: showPageSelector ? "visible" : "hidden",
          flexShrink: 0,
          minWidth: showPageSelector ? "180px" : "0px",
          // 响应式布局：小屏幕时绝对定位，大屏幕时相对定位
          position: isMobileMode ? "absolute" : "relative",
          left: isMobileMode ? "0" : "auto",
          top: isMobileMode ? "0" : "auto",
          bottom: isMobileMode ? "0" : "auto",
          height: isMobileMode ? "100%" : "auto",
          zIndex: isMobileMode ? "60" : "auto",
          boxShadow: isMobileMode
            ? showPageSelector
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              : "none"
            : "none",
          // 确保在小屏幕时，当显示时不会被隐藏
          display: isMobileMode
            ? showPageSelector
              ? "block"
              : "none"
            : "block",
        })}
      >
        <div
          className={css({
            width: "100%",
            height: "100%",
            display: showPageSelector ? "flex" : "none",
            flexDirection: "column",
          })}
        >
          <div
            className={css({
              display: showPageSelector ? "flex" : "none",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 16px 12px 16px",
              borderBottom: "1px solid",
              borderBottomColor: "gray.200",
              flexShrink: "0",
              backgroundColor: "gray.50",
            })}
          >
            <div
              className={css({
                fontSize: "14px",
                fontWeight: "bold",
                color: "gray.800",
              })}
            >
              页面列表
            </div>
            {/* 关闭按钮 - 仅在桌面端显示 */}
            <ActionIcon
              variant="subtle"
              aria-label="close-page-selector"
              onClick={() => setShowPageSelector(false)}
              className={css({
                display: isMobileMode ? "none" : "flex",
                color: "gray.500",
                _hover: {
                  backgroundColor: "gray.100",
                },
              })}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </ActionIcon>
          </div>
          <MacScrollbar
            className={css({
              fontSize: "12px",
              color: "gray.600",
              display: showPageSelector ? "block" : "none",
              flex: "1",
              overflow: "auto",
              padding: "16px",
            })}
          >
            <div
              className={css({
                display: showPageSelector ? "flex" : "none",
                flexDirection: "column",
                gap: "12px",
              })}
            >
              {pages?.map((page, index) => (
                <div
                  key={page.id}
                  className={css({
                    border: "1px solid",
                    borderColor: "rgba(184, 184, 184, 0.5)",
                    borderRadius: "0px",
                    padding: "12px",
                    backgroundColor: "white",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    margin: "12px auto",
                    transform: "translateZ(0)", // 启用硬件加速
                    willChange: "transform, box-shadow, border-color", // 优化动画性能
                    _hover: {
                      borderColor: "rgba(184, 184, 184, 1)",
                      transform: "translateY(-2px)", // 悬停时轻微上移
                    },
                  })}
                  style={{
                    boxShadow:
                      currentPageIndex === index
                        ? `0 0 6px ${colors.primary}`
                        : "0 0 12px rgba(0, 0, 0, 0.2)",
                  }}
                  onClick={() => setCurrentPageIndex(index)}
                >
                  <div
                    className={css({
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "gray.700",
                      marginBottom: "4px",
                    })}
                  >
                    {page.name || `页面 ${index + 1}`}
                  </div>
                  <div
                    className={css({
                      fontSize: "12px",
                      color: "gray.500",
                    })}
                  >
                    {page.orientation === "portrait" ? "纵向" : "横向"} ·{" "}
                    {page.rectangle}
                  </div>
                </div>
              ))}
            </div>
          </MacScrollbar>
        </div>
      </div>

      {/* 右侧主要内容区域 */}
      <div
        className={css({
          flex: "1",
          display: "flex",
          flexDirection: "column",
          minWidth: "0",
          // 响应式布局：小屏幕时占满宽度，大屏幕时正常布局
          marginLeft: isMobileMode ? "0" : "auto",
        })}
      >
        {/* 上部 - 控制栏 */}
        <div
          className={css({
            height: "36px",
            borderBottom: "1px solid",
            borderBottomColor: "gray.300",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2px",
            flexShrink: 0,
          })}
        >
          {/* 左侧 - 侧边栏控制按钮 */}
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "4px",
            })}
          >
            <ActionIcon
              variant="subtle"
              size="lg"
              aria-label="toggle-page-selector"
              onClick={() => {
                isMobileMode && !showPageSelector && setShowLeftSidebar(false);
                isMobileMode && !showPageSelector && setShowRightSidebar(false);
                setShowPageSelector(!showPageSelector);
              }}
              className={css({
                backgroundColor: showPageSelector ? "green.500" : "gray.400",
                color: "white",
                _hover: {
                  backgroundColor: showPageSelector ? "green.600" : "gray.500",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              })}
            >
              <LayoutDashboard size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              size="lg"
              aria-label="toggle-left-sidebar"
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className={css({
                backgroundColor: showLeftSidebar ? "blue.500" : "gray.400",
                color: "white",
                _hover: {
                  backgroundColor: showLeftSidebar ? "blue.600" : "gray.500",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              })}
            >
              {showLeftSidebar ? (
                <PanelLeftClose size={16} />
              ) : (
                <PanelLeftOpen size={16} />
              )}
            </ActionIcon>
          </div>
          {/* 中间 - 工具按钮和 Undo/Redo 按钮 */}
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flex: "1",
              minWidth: "0",
              justifyContent: "center",
              overflow: "hidden",
            })}
          >
            {/* 工具按钮 - 横向滚动 */}
            <MacScrollbar
              className={css({
                flexShrink: "1",
                minWidth: "0",
                maxWidth: "300px", // 限制最大宽度
                height: "40px", // 固定高度
              })}
            >
              <div
                className={css({
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  height: "100%",
                  paddingY: "4px",
                })}
              >
                {toolPanelComps.map((panel, panelIndex) => (
                  <React.Fragment key={panel.id}>
                    {panel.items?.map((item: any, itemIndex: number) => (
                      <div
                        key={`toolbar-${panel.id}-${itemIndex}`}
                        className={css({
                          flexShrink: "0", // 防止按钮被压缩
                        })}
                      >
                        <Box
                          name={item.name}
                          type={item.type}
                          cat={item.cat}
                          attrs={item.attrs}
                          isDropped={false}
                          direction={item.direction}
                        />
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </MacScrollbar>
            {/*分割短竖线 - 响应式显示 */}
            <div
              className={css({
                width: "1px",
                height: "12px",
                backgroundColor: "gray.200",
                marginX: "4px",
                flexShrink: "0",
                display: {
                  base: "none", // 小屏幕隐藏分隔线
                  sm: "block", // 大屏幕显示
                },
              })}
            />

            {/* Undo/Redo 按钮 - 始终显示 */}
            <div
              className={css({
                display: "flex",
                alignItems: "center",
                gap: "4px",
                flexShrink: "0",
              })}
            >
              <ActionIcon
                variant="subtle"
                size="lg"
                aria-label="undo"
                onClick={() => temporal.getState().undo()}
                disabled={undoCount === 0}
                className={css({
                  backgroundColor: showLeftSidebar ? "blue.500" : "gray.400",
                  color: "white",
                  _hover: {
                    backgroundColor: showLeftSidebar ? "blue.600" : "gray.500",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:disabled, &[data-disabled]": {
                    backgroundColor: "transparent !important",
                  },
                })}
              >
                <Undo size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                size="lg"
                aria-label="redo"
                onClick={() => temporal.getState().redo()}
                disabled={redoCount === 0}
                className={css({
                  backgroundColor: showLeftSidebar ? "blue.500" : "gray.400",
                  color: "white",
                  _hover: {
                    backgroundColor: showLeftSidebar ? "blue.600" : "gray.500",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:disabled, &[data-disabled]": {
                    backgroundColor: "transparent !important",
                  },
                })}
              >
                <Redo size={16} />
              </ActionIcon>
            </div>
          </div>

          {/* 右侧 - 侧边栏控制按钮 */}
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "4px",
            })}
          >
            <ActionIcon
              variant="subtle"
              size="lg"
              aria-label="toggle-right-sidebar"
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className={css({
                backgroundColor: showRightSidebar ? "purple.500" : "gray.400",
                color: "white",
                _hover: {
                  backgroundColor: showRightSidebar ? "purple.600" : "gray.500",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              })}
            >
              {showRightSidebar ? (
                <PanelRightClose size={16} />
              ) : (
                <PanelRightOpen size={16} />
              )}
            </ActionIcon>
          </div>
        </div>

        {/* 下部 - 左中右三栏布局 */}
        <div
          className={css({
            flex: "1",
            display: "flex",
            overflow: "hidden",
            position: "relative",
            minWidth: "0",
          })}
        >
          {/* 遮罩层 - 在小屏幕上显示侧边栏时显示 */}
          {(showLeftSidebar || showRightSidebar) && (
            <div
              className={css({
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: "50",
                display: isMobileMode ? "block" : "none",
              })}
              onClick={() => {
                setShowLeftSidebar(false);
                setShowRightSidebar(false);
              }}
            />
          )}
          {/* 左侧边栏 */}
          <div
            className={css({
              width: showLeftSidebar ? "270px" : "0px",
              borderRight: showLeftSidebar ? "1px solid" : "none",
              borderRightColor: "gray.300",
              backgroundColor: "gray.50",
              padding: showLeftSidebar ? "0px" : "0px",
              overflowY: "auto",
              overflowX: "hidden",
              flexShrink: 0,
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: showLeftSidebar ? "1" : "0",
              visibility: showLeftSidebar ? "visible" : "hidden",
              minWidth: showLeftSidebar ? "270px" : "0px",
              // 响应式布局：小屏幕时绝对定位，大屏幕时相对定位
              position: isMobileMode ? "absolute" : "relative",
              left: isMobileMode ? "0" : "auto",
              top: isMobileMode ? "0" : "auto",
              bottom: isMobileMode ? "0" : "auto",
              height: isMobileMode ? "100%" : "auto",
              zIndex: isMobileMode ? "60" : "auto",
              boxShadow: isMobileMode
                ? showLeftSidebar
                  ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  : "none"
                : "none",
              // 确保在小屏幕时，当显示时不会被隐藏
              display: isMobileMode
                ? showLeftSidebar
                  ? "block"
                  : "none"
                : "block",
            })}
          >
            <div
              className={css({
                width: "100%",
                height: "100%",
                display: showLeftSidebar ? "flex" : "none",
                flexDirection: "column",
              })}
            >
              <div
                className={css({
                  display: showLeftSidebar ? "flex" : "none",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 16px 12px 16px",
                  borderBottom: "1px solid",
                  borderColor: "gray.200",
                  flexShrink: "0",
                  backgroundColor: "gray.50",
                })}
              >
                <div
                  className={css({
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "gray.800",
                  })}
                >
                  页面信息
                </div>
                {/* 关闭按钮 - 仅在桌面端显示 */}
                <ActionIcon
                  variant="subtle"
                  aria-label="close-left-sidebar"
                  onClick={() => setShowLeftSidebar(false)}
                  className={css({
                    display: isMobileMode ? "none" : "flex",
                    color: "gray.500",
                    _hover: {
                      backgroundColor: "gray.100",
                    },
                  })}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </ActionIcon>
              </div>
              <MacScrollbar
                className={css({
                  fontSize: "12px",
                  color: "gray.600",
                  display: showLeftSidebar ? "block" : "none",
                  flex: "1",
                  overflow: "auto",
                  padding: "16px",
                })}
              >
                <PageStructureTree
                  currentPage={currentPage}
                  currentPageHeaderContent={currentPageHeaderContent}
                  currentPageBodyContent={currentPageBodyContent}
                  currentPageFooterContent={currentPageFooterContent}
                  onItemClick={setCurrentSelectedId}
                  currentSelectedId={currentSelectedId}
                />
              </MacScrollbar>
            </div>
          </div>

          {/* 中间主要内容区域 */}
          <MacScrollbar
            id="main-container"
            className={css({
              flex: "1",
              overflow: "auto",
              position: "relative",
              minWidth: "0",
            })}
          >
            <div
              className={css({
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: "translateZ(0)", // 启用硬件加速
                willChange: "transform, box-shadow", // 优化动画性能
              })}
              style={{
                width: `${canvasWidth}px`,
                minHeight: `${canvasHeight}px`,
                borderTop: "1px solid rgba(184, 184, 184, 1)",
                borderRight: "1px solid rgba(184, 184, 184, 1)",
                borderBottom: "1px solid rgba(184, 184, 184, 1)",
                borderLeft: "1px solid rgba(184, 184, 184, 1)",
                margin: "12px auto",
                boxShadow:
                  PAGE_ROOT_ID === currentSelectedId
                    ? `0 0 6px ${colors.primary}`
                    : "0 0 12px rgba(0, 0, 0, 0.2)",
              }}
              onClick={(event) => {
                event.stopPropagation();
                setCurrentSelectedId(PAGE_ROOT_ID);
              }}
            >
              <div
                className={css({
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: "translateZ(0)", // 启用硬件加速
                  willChange: "box-shadow, padding, margin", // 优化动画性能
                })}
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentSelectedId(PAGE_HEADER_ROOT_ID);
                }}
                style={{
                  display: "flex",
                  minHeight: `${pt2px(currentPageMTop, dpi)}px`,
                  marginLeft: `${pt2px(currentPageMLeft, dpi)}px`,
                  marginRight: `${pt2px(currentPageMRight, dpi)}px`,
                  boxShadow:
                    PAGE_HEADER_ROOT_ID === currentSelectedId
                      ? `0 0 0 1px ${colors.primary}`
                      : "none",
                  padding: `${pt2px(currentPageHeaderPTop, dpi)}px ${pt2px(currentPageHeaderPRight, dpi)}px ${pt2px(currentPageHeaderPBottom, dpi)}px ${pt2px(currentPageHeaderPLeft, dpi)}px`,
                }}
              >
                <List
                  identifier="list-v-header-root"
                  className={css({
                    width: "100%",
                    flex: "1",
                  })}
                  renderDropLine={renderDropLineElement}
                  renderGhost={renderGhostElement}
                  renderPlaceholder={renderPlaceholderElement}
                  renderStackedGroup={renderStackedGroupElement}
                  onDragEnd={(meta) => onDragEnd(meta, "header")}
                  onDragStart={onDragStart}
                >
                  <DndTarget
                    identifier={PAGE_HEADER_ROOT_ID}
                    data-title={PAGE_HEADER_ROOT_ID}
                    accept={stableAcceptArrays.containerElementPageHeader}
                    lastDroppedItem={null}
                    onDrop={(item) =>
                      onDndDropEnd(item, "header", PAGE_HEADER_ROOT_ID)
                    }
                    key={9999}
                    greedy={false}
                    moreStyle={stableMoreStyles.marginTop0}
                  >
                    {headerElements}
                  </DndTarget>
                </List>
              </div>
              {/* Header 和 Body 之间的分割提示线 */}
              <div
                style={{
                  marginLeft: `${pt2px(currentPageMLeft, dpi) - 16}px`,
                  marginRight: `${pt2px(currentPageMRight, dpi) - 16}px`,
                  height: "1px",
                  display: "flex",
                  justifyContent: "space-between",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRight: "1px solid rgba(184, 184, 184, 0.9)",
                    borderBottom: "1px solid rgba(184, 184, 184, 0.9)",
                    marginTop: "-15px",
                  }}
                />
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderLeft: "1px solid rgba(184, 184, 184, 0.9)",
                    borderBottom: "1px solid rgba(184, 184, 184, 0.9)",
                    marginTop: "-15px",
                  }}
                />
              </div>
              <div
                className={css({
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: "translateZ(0)", // 启用硬件加速
                  willChange: "box-shadow, padding, margin", // 优化动画性能
                })}
                style={{
                  display: "flex",
                  minHeight: `${canvasHeight - (pt2px(currentPageMTop, dpi) + pt2px(currentPageMBottom, dpi))}px`,
                  marginLeft: `${pt2px(currentPageMLeft, dpi)}px`,
                  marginRight: `${pt2px(currentPageMRight, dpi)}px`,
                  boxShadow:
                    PAGE_BODY_ROOT_ID === currentSelectedId
                      ? `0 0 0 1px ${colors.primary}`
                      : "none",
                  padding: `${pt2px(currentPagePTop, dpi)}px ${pt2px(currentPagePRight, dpi)}px ${pt2px(currentPagePBottom, dpi)}px ${pt2px(currentPagePLeft, dpi)}px`,
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentSelectedId(PAGE_BODY_ROOT_ID);
                }}
              >
                <List
                  identifier="list-v-root"
                  className={css({
                    width: "100%",
                    flex: "1",
                  })}
                  renderDropLine={renderDropLineElement}
                  renderGhost={renderGhostElement}
                  renderPlaceholder={renderPlaceholderElement}
                  renderStackedGroup={renderStackedGroupElement}
                  onDragEnd={(meta) => onDragEnd(meta, "body")}
                  onDragStart={onDragStart}
                >
                  <DndTarget
                    identifier={PAGE_BODY_ROOT_ID}
                    data-title={PAGE_BODY_ROOT_ID}
                    accept={stableAcceptArrays.containerElementPageBody}
                    lastDroppedItem={null}
                    onDrop={(item) =>
                      onDndDropEnd(item, "body", PAGE_BODY_ROOT_ID)
                    }
                    key={9999}
                    greedy={false}
                    moreStyle={stableMoreStyles.marginTop0}
                  >
                    {bodyElements}
                  </DndTarget>
                </List>
              </div>
              {/* Body 和 Footer 之间的分割提示线 */}
              <div
                style={{
                  marginLeft: `${pt2px(currentPageMLeft, dpi) - 16}px`,
                  marginRight: `${pt2px(currentPageMRight, dpi) - 16}px`,
                  height: "1px",
                  display: "flex",
                  justifyContent: "space-between",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRight: "1px solid rgba(184, 184, 184, 0.9)",
                    borderTop: "1px solid rgba(184, 184, 184, 0.9)",
                  }}
                />
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderLeft: "1px solid rgba(184, 184, 184, 0.9)",
                    borderTop: "1px solid rgba(184, 184, 184, 0.9)",
                  }}
                />
              </div>
              <div
                className={css({
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: "translateZ(0)", // 启用硬件加速
                  willChange: "box-shadow, margin", // 优化动画性能
                })}
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentSelectedId(PAGE_FOOTER_ROOT_ID);
                }}
                style={{
                  display: "flex",
                  minHeight: `${pt2px(currentPageMBottom, dpi)}px`,
                  marginLeft: `${pt2px(currentPageMLeft, dpi)}px`,
                  marginRight: `${pt2px(currentPageMRight, dpi)}px`,
                  boxShadow:
                    PAGE_FOOTER_ROOT_ID === currentSelectedId
                      ? `0 0 0 1px ${colors.primary}`
                      : "none",
                }}
              >
                <List
                  identifier="list-v-footer-root"
                  className={css({
                    width: "100%",
                    flex: "1",
                  })}
                  renderDropLine={renderDropLineElement}
                  renderGhost={renderGhostElement}
                  renderPlaceholder={renderPlaceholderElement}
                  renderStackedGroup={renderStackedGroupElement}
                  onDragEnd={(meta) => onDragEnd(meta, "footer")}
                  onDragStart={onDragStart}
                >
                  <DndTarget
                    identifier={PAGE_FOOTER_ROOT_ID}
                    data-title={PAGE_FOOTER_ROOT_ID}
                    accept={stableAcceptArrays.containerElementPageFooter}
                    lastDroppedItem={null}
                    onDrop={(item) =>
                      onDndDropEnd(item, "footer", PAGE_FOOTER_ROOT_ID)
                    }
                    key={9999}
                    greedy={false}
                    moreStyle={stableMoreStyles.marginTop0}
                  >
                    {footerElements}
                  </DndTarget>
                </List>
              </div>
            </div>
          </MacScrollbar>

          {/* 右侧边栏 */}
          <div
            className={css({
              width: showRightSidebar ? "270px" : "0px",
              borderLeft: showRightSidebar ? "1px solid" : "none",
              borderLeftColor: "gray.300",
              backgroundColor: "gray.50",
              padding: showRightSidebar ? "0px" : "0px",
              overflowY: "auto",
              overflowX: "hidden",
              flexShrink: 0,
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: showRightSidebar ? "1" : "0",
              visibility: showRightSidebar ? "visible" : "hidden",
              minWidth: showRightSidebar ? "270px" : "0px",
              // 响应式布局：小屏幕时绝对定位，大屏幕时相对定位
              position: isMobileMode ? "absolute" : "relative",
              right: isMobileMode ? "0" : "auto",
              top: isMobileMode ? "0" : "auto",
              bottom: isMobileMode ? "0" : "auto",
              height: isMobileMode ? "100%" : "auto",
              zIndex: isMobileMode ? "60" : "auto",
              boxShadow: isMobileMode
                ? showRightSidebar
                  ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  : "none"
                : "none",
              // 确保在小屏幕时，当显示时不会被隐藏
              display: isMobileMode
                ? showRightSidebar
                  ? "block"
                  : "none"
                : "block",
            })}
          >
            <div
              className={css({
                width: "100%",
                height: "100%",
                display: showRightSidebar ? "flex" : "none",
                flexDirection: "column",
              })}
            >
              <div
                className={css({
                  display: showRightSidebar ? "flex" : "none",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 16px 12px 16px",
                  borderBottom: "1px solid",
                  borderBottomColor: "gray.200",
                  flexShrink: "0",
                  backgroundColor: "gray.50",
                })}
              >
                <div
                  className={css({
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "gray.800",
                  })}
                >
                  操作面板
                </div>
                {/* 关闭按钮 - 仅在桌面端显示 */}
                <ActionIcon
                  variant="subtle"
                  aria-label="close-right-sidebar"
                  onClick={() => setShowRightSidebar(false)}
                  className={css({
                    display: isMobileMode ? "none" : "flex",
                    color: "gray.500",
                    _hover: {
                      backgroundColor: "gray.100",
                    },
                  })}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </ActionIcon>
              </div>
              <MacScrollbar
                className={css({
                  fontSize: "12px",
                  color: "gray.600",
                  display: showRightSidebar ? "block" : "none",
                  flex: "1",
                  overflow: "auto",
                  padding: "16px",
                })}
              >
                {compAttrPanel}
              </MacScrollbar>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// 外部组件，提供 MantineProvider
export const MixBoxLayout = React.memo<{
  id: string;
  contents: ContentData;
  onContentChange?: (updatedContents: ContentData) => void;
  theme?: ThemeVariant;
  baseUrl?: string;
  imageUploadPath?: string;
  imageDownloadPath?: string;
}>(
  ({
    id,
    contents,
    onContentChange,
    theme: themeVariant = "blue",
    baseUrl,
    imageUploadPath,
    imageDownloadPath,
  }) => {
    // 使用 useMemo 确保 store 只在 id 或 contents 变化时重新创建
    const store = React.useMemo(() => {
      return createContentsStore(id, contents ?? defaultContents);
    }, [id, contents]);

    // 根据传入的主题变体创建动态主题
    const dynamicTheme = React.useMemo(() => {
      const baseTheme = { ...theme };
      if (themeVariant && themeVariants[themeVariant]) {
        baseTheme.primaryColor = themeVariants[themeVariant].primaryColor;
      }
      return baseTheme;
    }, [themeVariant]);

    return (
      <MantineProvider theme={dynamicTheme}>
        <ContentsStoreContext.Provider value={store}>
          <DpiProvider>
            <CurrentSelectedIdProvider>
              <DndProvider backend={HTML5Backend}>
                <MixBoxLayoutContent
                  onContentChange={onContentChange}
                  baseUrl={baseUrl}
                  imageUploadPath={imageUploadPath}
                  imageDownloadPath={imageDownloadPath}
                />
              </DndProvider>
            </CurrentSelectedIdProvider>
          </DpiProvider>
        </ContentsStoreContext.Provider>
      </MantineProvider>
    );
  },
);
