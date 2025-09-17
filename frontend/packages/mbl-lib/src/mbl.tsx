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
  Popover,
  NavLink,
} from "@mantine/core";
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
import { DpiProvider, useDpi } from "./providers/dpi-provider";
import {
  ThemeProvider,
  useThemeColorsContext,
} from "./providers/theme-provider";
import { getRectangleSize, mm2px, pt2px } from "@xxs3315/mbl-utils";
import { useMount } from "react-use";
import { MacScrollbar } from "mac-scrollbar";
import "mac-scrollbar/dist/mac-scrollbar.css";
import {
  CurrentSelectedIdProvider,
  useCurrentSelectedId,
} from "./providers/current-selected-id-provider";
import { I18nProvider } from "./providers/i18n-provider";
import {
  PAGE_BODY_ROOT_ID,
  PAGE_FOOTER_ROOT_ID,
  PAGE_HEADER_ROOT_ID,
  PAGE_ROOT_ID,
} from "./constants";
import { AttributePanelRenderer } from "./comps/attribute-panel/components/attribute-panel-renderer";
import {
  PageSelector,
  ControlBar,
  LeftSidebar,
  RightSidebar,
  TextareaWithComposition,
} from "./components";
import {
  useResponsiveLayout,
  useDragHandlers,
  usePopoverState,
  useUndoRedo,
  useContentChange,
  useSelectedItemInfo,
  useRenderFunctions,
  useCanvasSize,
  useInteractionButtons,
} from "./hooks";

// 内部组件，在 MantineProvider 内部使用 useThemeColors
const MixBoxLayoutContent = React.memo<{
  onContentChange?: (updatedContents: ContentData) => void;
  baseUrl?: string;
  imageUploadPath?: string;
  imageDownloadPath?: string;
  pdfGeneratePath?: string;
  pdfDownloadPath?: string;
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
    plugins,
    enablePluginSystem = false,
  }) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

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

    // 从当前页面获取所有属性
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

    const getFlexStyle = React.useMemo(() => {
      return (item: any) => {
        const flexValue = item.wildStar
          ? "1"
          : `${item.canGrow ? "1" : "0"} ${item.canShrink ? "1" : "0"} ${item.flexUnit === "%" ? item.flexValue : pt2px(item.flexValue ?? 0, dpi)}${item.flexUnit}`;
        return { flex: flexValue };
      };
    }, [dpi]);

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
                  src={
                    props.value && props.value.length > 0 ? props.value : null
                  }
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
            // 检查是否是插件项目
            if (props.pluginId && enablePluginSystem && plugins) {
              console.log(
                "[Plugin] Rendering plugin component:",
                props.pluginId,
              );

              // 查找对应的插件
              const pluginWrapper = plugins.find(
                (p) => p.metadata.id === props.pluginId,
              );
              if (pluginWrapper) {
                const plugin = pluginWrapper.plugin;

                // 调用插件的render方法
                if (plugin.render) {
                  const pluginProps = {
                    id: props.id,
                    attrs: props,
                    // 不直接传递 dpi，让插件组件自己通过 useDpi hook 订阅
                    // 不直接传递 currentSelectedId，让插件组件自己订阅
                    // 不直接传递 colors，让插件组件自己通过 useThemeColorsContext hook 订阅
                    onPropsChange: (newProps: any) => {
                      // 通过 handlePluginPropsChange 更新 store
                      handlePluginPropsChange(props.id, newProps, position);
                    },
                  };

                  return plugin.render(pluginProps);
                }
              }
            }

            return <span key={`${position}-item-${props.id}-target`} />;
        }
      },
      [updateTextItemValue, enablePluginSystem, handlePluginPropsChange],
    );

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
                  {renderCopyButton(item.id, position, copyItem)}
                  {renderDeleteButton(item.id, position, deleteItem)}
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
                  {renderCopyButton(item.id, position, copyItem)}
                  {renderDeleteButton(item.id, position, deleteItem)}
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
              {renderCopyButton(item.id, position, copyItem)}
              {renderDeleteButton(item.id, position, deleteItem)}
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

    // 使用撤销重做 hook
    const { undoCount, redoCount, undo, redo } = useUndoRedo();

    // 使用内容变化监听 hook
    useContentChange(onContentChange);

    // 使用选中项信息 hook
    const selectedItemInfo = useSelectedItemInfo(
      currentSelectedId,
      currentPageHeaderContent,
      currentPageBodyContent,
      currentPageFooterContent,
    );

    const compAttrPanel = React.useMemo(() => {
      return (
        <AttributePanelRenderer
          currentSelectedId={currentSelectedId}
          selectedItemInfo={selectedItemInfo}
          baseUrl={baseUrl}
          imageUploadPath={imageUploadPath}
          imageDownloadPath={imageDownloadPath}
          plugins={plugins}
          enablePluginSystem={enablePluginSystem}
          onPluginPropsChange={handlePluginPropsChange}
        />
      );
    }, [
      currentSelectedId,
      selectedItemInfo,
      baseUrl,
      imageUploadPath,
      imageDownloadPath,
      plugins,
      enablePluginSystem,
      handlePluginPropsChange,
    ]);

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
              <div
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
            <RightSidebar
              showRightSidebar={showRightSidebar}
              isMobileMode={isMobileMode}
              currentSelectedId={currentSelectedId}
              selectedItemInfo={selectedItemInfo}
              baseUrl={baseUrl}
              imageUploadPath={imageUploadPath}
              imageDownloadPath={imageDownloadPath}
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
