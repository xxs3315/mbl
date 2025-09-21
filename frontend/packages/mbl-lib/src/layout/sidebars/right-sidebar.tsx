import React, { useState } from "react";
import { css } from "../../styled-system/css";
import { ActionIcon, Tabs } from "@mantine/core";
import { MacScrollbar } from "mac-scrollbar";
import { AttributePanelRenderer } from "../../comps/attribute-panel/components/attribute-panel-renderer";
import { TaskCenter } from "../../comps/task-center/task-center";

interface RightSidebarProps {
  showRightSidebar: boolean;
  isMobileMode: boolean;
  currentSelectedId?: string;
  selectedItemInfo: {
    item: any;
    position: "header" | "body" | "footer" | null;
    exists: boolean;
  };
  baseUrl?: string;
  imageUploadPath?: string;
  imageDownloadPath?: string;
  taskStatusPath?: string;
  pdfDownloadPath?: string;
  plugins?: Array<{ metadata: any; plugin: any }>;
  enablePluginSystem?: boolean;
  onPluginPropsChange: (
    itemId: string,
    newProps: any,
    position: "header" | "body" | "footer",
  ) => void;
  onClose: () => void;
}

export const RightSidebar = React.memo<RightSidebarProps>(
  ({
    showRightSidebar,
    isMobileMode,
    currentSelectedId,
    selectedItemInfo,
    baseUrl,
    imageUploadPath,
    imageDownloadPath,
    taskStatusPath,
    pdfDownloadPath,
    plugins,
    enablePluginSystem,
    onPluginPropsChange,
    onClose,
  }) => {
    const [activeTab, setActiveTab] = useState<string>("operation-panel");
    return (
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
              padding: "4px 6px 2px 6px",
              flexShrink: "0",
              backgroundColor: "gray.50",
            })}
          >
            <Tabs
              value={activeTab}
              onChange={(value) => setActiveTab(value as string)}
              className={css({
                flex: "1",
              })}
            >
              <Tabs.List
                className={css({
                  borderBottom: "none",
                })}
              >
                <Tabs.Tab
                  value="operation-panel"
                  className={css({
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "gray.800",
                    padding: "8px 16px",
                  })}
                >
                  操作面板
                </Tabs.Tab>
                <Tabs.Tab
                  value="task-center"
                  className={css({
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "gray.800",
                    padding: "8px 16px",
                  })}
                >
                  任务中心
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
            {/* 关闭按钮 - 仅在桌面端显示 */}
            <ActionIcon
              variant="subtle"
              aria-label="close-right-sidebar"
              onClick={onClose}
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
          <div
            className={css({
              display: showRightSidebar ? "block" : "none",
              flex: "1",
              overflow: "hidden",
            })}
          >
            {activeTab === "operation-panel" && (
              <MacScrollbar
                className={css({
                  fontSize: "12px",
                  color: "gray.600",
                  height: "100%",
                  overflow: "auto",
                  padding: "16px",
                })}
              >
                <AttributePanelRenderer
                  currentSelectedId={currentSelectedId || ""}
                  selectedItemInfo={selectedItemInfo}
                  baseUrl={baseUrl}
                  imageUploadPath={imageUploadPath}
                  imageDownloadPath={imageDownloadPath}
                  plugins={plugins}
                  enablePluginSystem={enablePluginSystem}
                  onPluginPropsChange={onPluginPropsChange}
                />
              </MacScrollbar>
            )}
            {activeTab === "task-center" && (
              <TaskCenter
                baseUrl={baseUrl}
                taskStatusPath={taskStatusPath}
                pdfDownloadPath={pdfDownloadPath}
              />
            )}
          </div>
        </div>
      </div>
    );
  },
);
