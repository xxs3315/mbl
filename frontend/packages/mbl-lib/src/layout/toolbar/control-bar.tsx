import React from "react";
import { css } from "../../styled-system/css";
import { ActionIcon, Popover, Tooltip, Loader } from "@mantine/core";
import { MacScrollbar } from "mac-scrollbar";
import { Box } from "@xxs3315/mbl-dnd";
import { toolPanelComps } from "../../comps/tool-panel/data";
import {
  Redo,
  Undo,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  LayoutDashboard,
  LayoutList,
  Eye,
  ScanEye,
} from "lucide-react";
import { useI18n } from "@xxs3315/mbl-providers";

interface ControlBarProps {
  showPageSelector: boolean;
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  isMobileMode: boolean;
  undoCount: number;
  redoCount: number;
  onTogglePageSelector: () => void;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  onToggleAllSidebars: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPreview: () => void;
  onPreviewAll: () => void;
  isPreviewing: boolean;
  plugins?: Array<{ metadata: any; plugin: any }>;
  enablePluginSystem?: boolean;
}

export const ControlBar = React.memo<ControlBarProps>(
  ({
    showPageSelector,
    showLeftSidebar,
    showRightSidebar,
    isMobileMode,
    undoCount,
    redoCount,
    onTogglePageSelector,
    onToggleLeftSidebar,
    onToggleRightSidebar,
    onToggleAllSidebars,
    onUndo,
    onRedo,
    onPreview,
    onPreviewAll,
    isPreviewing,
    plugins,
    enablePluginSystem = false,
  }) => {
    const { t } = useI18n();

    return (
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
              isMobileMode && !showPageSelector && onToggleLeftSidebar();
              isMobileMode && !showPageSelector && onToggleRightSidebar();
              onTogglePageSelector();
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
            <LayoutList size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            size="lg"
            aria-label="toggle-left-sidebar"
            onClick={onToggleLeftSidebar}
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
              maxWidth: !isMobileMode ? "100%" : "300px", // 限制最大宽度
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

              {/* 插件工具栏 */}
              {enablePluginSystem && plugins && plugins.length > 0 && (
                <React.Fragment key="plugins-panel">
                  {plugins.map((pluginWrapper, pluginIndex) => {
                    const plugin = pluginWrapper.plugin;
                    const metadata = pluginWrapper.metadata;

                    // 获取插件的工具栏配置
                    const toolbarConfig = plugin.getToolbarConfig?.() || {
                      type: "element",
                      cat: metadata.category || "plugin",
                      attrs: {
                        pluginId: metadata.id,
                        ...metadata.defaultConfig,
                      },
                    };

                    return (
                      <div
                        key={`plugin-${metadata.id}-${pluginIndex}`}
                        className={css({
                          flexShrink: "0", // 防止按钮被压缩
                        })}
                      >
                        <Box
                          name={metadata.name || metadata.id}
                          type={toolbarConfig.type}
                          cat={toolbarConfig.cat}
                          attrs={toolbarConfig.attrs}
                          isDropped={false}
                          direction={toolbarConfig.direction}
                          icon={metadata.icon}
                        />
                      </div>
                    );
                  })}
                </React.Fragment>
              )}
            </div>
          </MacScrollbar>

          {/* 分割短竖线 - 响应式显示 */}
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
              onClick={onUndo}
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
              onClick={onRedo}
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

          {/* 分割短竖线 - 响应式显示 */}
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

          {/* Preview/Preview All 按钮 - 始终显示 */}
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flexShrink: "0",
            })}
          >
            <Tooltip
              label={t("controlBar.preview", { ns: "layout" })}
              position="bottom"
              withArrow
            >
              <ActionIcon
                variant="subtle"
                size="lg"
                aria-label="undo"
                onClick={onPreview}
                disabled={isPreviewing}
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
                {isPreviewing ? <Loader size={16} /> : <Eye size={16} />}
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label={t("controlBar.previewAll", { ns: "layout" })}
              position="bottom"
              withArrow
            >
              <ActionIcon
                variant="subtle"
                size="lg"
                aria-label="redo"
                onClick={onPreviewAll}
                disabled={isPreviewing}
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
                {isPreviewing ? <Loader size={16} /> : <ScanEye size={16} />}
              </ActionIcon>
            </Tooltip>
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
            onClick={onToggleRightSidebar}
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
          <ActionIcon
            variant="subtle"
            size="lg"
            aria-label="toggle-right-sidebar"
            onClick={onToggleAllSidebars}
            className={css({
              backgroundColor: showRightSidebar ? "purple.500" : "gray.400",
              color: "white",
              _hover: {
                backgroundColor: showRightSidebar ? "purple.600" : "gray.500",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            })}
            style={{
              display: !isMobileMode ? "block" : "none",
            }}
          >
            <LayoutDashboard size={16} />
          </ActionIcon>
        </div>
      </div>
    );
  },
);
