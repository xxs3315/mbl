import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { MantineProvider } from "@mantine/core";
import { theme, type ThemeVariant, themeVariants } from "@xxs3315/mbl-themes";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ContentData } from "@xxs3315/mbl-typings";
import {
  ContentsStoreContext,
  createContentsStore,
  useContentsStoreContext,
} from "./store/store";
import { defaultContents } from "./store/default-data";
import {
  CurrentSelectedIdProvider,
  DpiProvider,
  I18nProvider,
  ThemeProvider,
  useCurrentSelectedId,
  useThemeColorsContext,
} from "@xxs3315/mbl-providers";
import { MacScrollbar } from "mac-scrollbar";
import "mac-scrollbar/dist/mac-scrollbar.css";
import {
  PAGE_BODY_ROOT_ID,
  PAGE_FOOTER_ROOT_ID,
  PAGE_HEADER_ROOT_ID,
} from "./constants";
import { css } from "./styled-system/css";
import { ControlBar, LeftSidebar, PageSelector, RightSidebar } from "./layout";
import {
  useCanvasRenderer,
  useCanvasSize,
  useComponentRenderer,
  useContentChange,
  useDpiCalculator,
  useDragHandlers,
  useInteractionButtons,
  useItemElement,
  usePopoverState,
  useRenderFunctions,
  useResponsiveLayout,
  useSelectedItem,
  useStableStyles,
  useUndoRedo,
} from "./hooks";
import { usePreview } from "./hooks/use-preview";

// 内部组件，在 MantineProvider 内部使用 useThemeColors
const MixBoxLayoutContent = React.memo<{
  onContentChange?: (updatedContents: ContentData) => void;
  baseUrl?: string;
  imageUploadPath?: string;
  imageDownloadPath?: string;
  pdfGeneratePath?: string;
  pdfDownloadPath?: string;
  taskStatusPath?: string;
  plugins?: Array<{ metadata: any; plugin: any }>;
  enablePluginSystem?: boolean;
}>(
  ({
    onContentChange,
    baseUrl,
    imageUploadPath,
    imageDownloadPath,
    pdfGeneratePath,
    pdfDownloadPath,
    taskStatusPath,
    plugins,
    enablePluginSystem = false,
  }) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    // 使用 DPI 计算器 hook
    useDpiCalculator();

    // 定义颜色常量
    const colors = useThemeColorsContext();

    const { currentSelectedId, setCurrentSelectedId } = useCurrentSelectedId();

    // 使用响应式布局 hook
    const {
      showPageSelector,
      setShowPageSelector,
      showLeftSidebar,
      setShowLeftSidebar,
      showRightSidebar,
      setShowRightSidebar,
      isMobileMode,
    } = useResponsiveLayout(containerRef);

    // 优化全局事件处理，减少事件冒泡
    React.useEffect(() => {
      const handleGlobalMouseDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        // 如果点击的是交互按钮，阻止事件冒泡
        if (
          target.closest("[data-interactive]") ||
          target.closest("[data-popover-target]")
        ) {
          e.stopPropagation();
        }
      };

      // 使用passive: true提高性能
      document.addEventListener("mousedown", handleGlobalMouseDown, {
        passive: false,
      });

      return () => {
        document.removeEventListener("mousedown", handleGlobalMouseDown);
      };
    }, []);

    // 使用细粒度订阅，只订阅真正需要的状态
    const pages = useContentsStoreContext((s) => s.pages);
    const currentPageIndex = useContentsStoreContext((s) => s.currentPageIndex);
    const currentPageHeaderContent = useContentsStoreContext(
      (s) => s.currentPageHeaderContent,
    );
    const currentPageBodyContent = useContentsStoreContext(
      (s) => s.currentPageBodyContent,
    );
    const currentPageFooterContent = useContentsStoreContext(
      (s) => s.currentPageFooterContent,
    );
    const setCurrentPageIndex = useContentsStoreContext(
      (s) => s.setCurrentPageIndex,
    );
    const setCurrentPageAndContent = useContentsStoreContext(
      (s) => s.setCurrentPageAndContent,
    );
    const updateTextItemValue = useContentsStoreContext(
      (s) => s.updateTextItemValue,
    );
    const updatePluginItemProps = useContentsStoreContext(
      (s) => s.updatePluginItemProps,
    );

    const currentPage = React.useMemo(() => {
      return pages[currentPageIndex];
    }, [pages, currentPageIndex]);

    // 使用画布尺寸计算 hook
    const { canvasWidth, canvasHeight } = useCanvasSize(currentPage);

    // 使用渲染函数 hook
    const {
      renderDropLineElement,
      renderGhostElement,
      renderPlaceholderElement,
      renderStackedGroupElement,
      renderHorizontalDropLineElement,
      renderHorizontalGhostElement,
      renderHorizontalPlaceholderElement,
      renderHorizontalStackedGroupElement,
    } = useRenderFunctions(colors);

    // 使用拖拽处理 hook
    const { copyItem, deleteItem, onDragEnd, onDndDropEnd } = useDragHandlers(
      currentPageHeaderContent,
      currentPageBodyContent,
      currentPageFooterContent,
      currentPage,
      currentPageIndex,
      setCurrentPageAndContent,
      setCurrentSelectedId,
      plugins,
      enablePluginSystem,
    );

    // 使用 Popover 状态管理 hook
    const { togglePopover, isPopoverOpen, closePopover } = usePopoverState();

    // 路径缓存，避免重复计算
    const pathCache = React.useRef<Map<string, any[]>>(new Map());

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

    // 使用交互按钮渲染 hook
    const {
      renderDragHandle,
      renderCopyButton,
      renderDeleteButton,
      renderPopover,
    } = useInteractionButtons(
      colors,
      currentSelectedId,
      togglePopover,
      isPopoverOpen,
      closePopover,
      setCurrentSelectedId,
      getCachedPath,
      currentPageHeaderContent,
      currentPageBodyContent,
      currentPageFooterContent,
      PAGE_HEADER_ROOT_ID,
      PAGE_BODY_ROOT_ID,
      PAGE_FOOTER_ROOT_ID,
    );

    const onDragStart = React.useCallback((meta: any) => {
      console.log("drag start: ", meta.identifier);
    }, []);

    // 使用稳定样式 hook
    const {
      stableAcceptArrays,
      stableMoreStyles,
      getVerticalStyle,
      getFlexStyle,
    } = useStableStyles();

    // 处理插件属性变化 - 使用稳定的 store 方法
    const handlePluginPropsChange = React.useCallback(
      (
        itemId: string,
        newProps: any,
        position: "header" | "body" | "footer",
      ) => {
        console.log(
          "[Plugin] Updating plugin props:",
          itemId,
          newProps,
          position,
        );

        // 直接使用 store 方法更新，类似于 updateTextItemValue
        updatePluginItemProps(itemId, newProps, position);
      },
      [updatePluginItemProps], // 只依赖 store 方法，引用稳定
    );

    // 使用组件渲染器 hook
    const { getComponent } = useComponentRenderer(
      updateTextItemValue,
      enablePluginSystem,
      plugins,
      handlePluginPropsChange,
    );

    // 使用项目元素创建 hook
    const { createItemElement } = useItemElement(
      colors,
      currentSelectedId,
      setCurrentSelectedId,
      getFlexStyle,
      getComponent,
      renderDragHandle,
      renderCopyButton,
      renderDeleteButton,
      renderPopover,
      renderDropLineElement,
      renderGhostElement,
      renderPlaceholderElement,
      renderStackedGroupElement,
      renderHorizontalDropLineElement,
      renderHorizontalGhostElement,
      renderHorizontalPlaceholderElement,
      renderHorizontalStackedGroupElement,
      onDragEnd,
      onDndDropEnd,
      stableAcceptArrays,
      stableMoreStyles,
      getVerticalStyle,
      currentPageHeaderContent,
      currentPageBodyContent,
      currentPageFooterContent,
      copyItem,
      deleteItem,
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

    // 使用画布渲染器 hook
    const { renderCanvas } = useCanvasRenderer(
      colors,
      currentSelectedId,
      setCurrentSelectedId,
      canvasWidth,
      canvasHeight,
      currentPage,
      headerElements,
      bodyElements,
      footerElements,
      renderDropLineElement,
      renderGhostElement,
      renderPlaceholderElement,
      renderStackedGroupElement,
      onDragEnd,
      onDragStart,
      onDndDropEnd,
      stableAcceptArrays,
      stableMoreStyles,
    );

    // 使用撤销重做 hook
    const { undoCount, redoCount, undo, redo } = useUndoRedo();

    // 使用预览 hook
    const { preview, previewAll, isPreviewing } = usePreview({
      baseUrl,
      pdfGeneratePath,
    });

    useEffect(() => {
      console.log("[Preview] isPreviewing: ", isPreviewing);
    }, [isPreviewing]);

    // 使用内容变化监听 hook
    useContentChange(onContentChange);

    // 使用选中项信息 hook
    const selectedItemInfo = useSelectedItem();

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
          backgroundColor: "white",
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
        {/* 左侧页面选择器 */}
        <PageSelector
          showPageSelector={showPageSelector}
          isMobileMode={isMobileMode}
          pages={pages}
          currentPageIndex={currentPageIndex}
          onClose={() => setShowPageSelector(false)}
          onPageSelect={setCurrentPageIndex}
        />

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
          <ControlBar
            showPageSelector={showPageSelector}
            showLeftSidebar={showLeftSidebar}
            showRightSidebar={showRightSidebar}
            isMobileMode={isMobileMode}
            undoCount={undoCount}
            redoCount={redoCount}
            onTogglePageSelector={() => {
              isMobileMode && !showPageSelector && setShowLeftSidebar(false);
              isMobileMode && !showPageSelector && setShowRightSidebar(false);
              setShowPageSelector(!showPageSelector);
            }}
            onToggleLeftSidebar={() => setShowLeftSidebar(!showLeftSidebar)}
            onToggleRightSidebar={() => setShowRightSidebar(!showRightSidebar)}
            onToggleAllSidebars={() => {
              // 实现全部显示/全部隐藏的切换
              const allShown =
                showPageSelector && showLeftSidebar && showRightSidebar;
              const allHidden =
                !showPageSelector && !showLeftSidebar && !showRightSidebar;

              if (allShown) {
                // 如果全部显示，则全部隐藏
                setShowPageSelector(false);
                setShowLeftSidebar(false);
                setShowRightSidebar(false);
              } else if (allHidden) {
                // 如果全部隐藏，则全部显示
                setShowPageSelector(true);
                setShowLeftSidebar(true);
                setShowRightSidebar(true);
              } else {
                // 其他情况（部分显示），则全部显示
                setShowPageSelector(true);
                setShowLeftSidebar(true);
                setShowRightSidebar(true);
              }
            }}
            onUndo={undo}
            onRedo={redo}
            onPreview={preview}
            onPreviewAll={previewAll}
            isPreviewing={isPreviewing}
            plugins={plugins}
            enablePluginSystem={enablePluginSystem}
          />

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
            <LeftSidebar
              showLeftSidebar={showLeftSidebar}
              isMobileMode={isMobileMode}
              currentPage={currentPage}
              currentPageHeaderContent={currentPageHeaderContent}
              currentPageBodyContent={currentPageBodyContent}
              currentPageFooterContent={currentPageFooterContent}
              currentSelectedId={currentSelectedId}
              onItemClick={setCurrentSelectedId}
              onClose={() => setShowLeftSidebar(false)}
            />

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
              {renderCanvas()}
            </MacScrollbar>

            {/* 右侧边栏 */}
            <RightSidebar
              showRightSidebar={showRightSidebar}
              isMobileMode={isMobileMode}
              currentSelectedId={currentSelectedId}
              selectedItemInfo={selectedItemInfo}
              baseUrl={baseUrl}
              imageUploadPath={imageUploadPath}
              imageDownloadPath={imageDownloadPath}
              taskStatusPath={taskStatusPath}
              pdfDownloadPath={pdfDownloadPath}
              plugins={plugins}
              enablePluginSystem={enablePluginSystem}
              onPluginPropsChange={handlePluginPropsChange}
              onClose={() => setShowRightSidebar(false)}
            />
          </div>
        </div>
      </div>
    );
  },
);

// 外部组件，提供 MantineProvider
export const MixBoxLayout = React.memo<{
  id: string;
  contents: ContentData;
  onContentChange?: (updatedContents: ContentData) => void;
  theme?: ThemeVariant;
  baseUrl?: string;
  imageUploadPath?: string;
  imageDownloadPath?: string;
  pdfGeneratePath?: string;
  pdfDownloadPath?: string;
  taskStatusPath?: string;
  plugins?: Array<{ metadata: any; plugin: any }>;
  enablePluginSystem?: boolean;
  locale?: "zh-CN" | "en-US";
}>(
  ({
    id,
    contents,
    onContentChange,
    theme: themeVariant = "blue",
    baseUrl,
    imageUploadPath,
    imageDownloadPath,
    pdfGeneratePath,
    pdfDownloadPath,
    taskStatusPath,
    plugins,
    enablePluginSystem = false,
    locale = "zh-CN",
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
        <I18nProvider defaultLocale={locale}>
          <ContentsStoreContext.Provider value={store}>
            <DpiProvider>
              <ThemeProvider>
                <CurrentSelectedIdProvider>
                  <DndProvider backend={HTML5Backend}>
                    <MixBoxLayoutContent
                      onContentChange={onContentChange}
                      baseUrl={baseUrl}
                      imageUploadPath={imageUploadPath}
                      imageDownloadPath={imageDownloadPath}
                      pdfGeneratePath={pdfGeneratePath}
                      pdfDownloadPath={pdfDownloadPath}
                      taskStatusPath={taskStatusPath}
                      plugins={plugins}
                      enablePluginSystem={enablePluginSystem}
                    />
                  </DndProvider>
                </CurrentSelectedIdProvider>
              </ThemeProvider>
            </DpiProvider>
          </ContentsStoreContext.Provider>
        </I18nProvider>
      </MantineProvider>
    );
  },
);
