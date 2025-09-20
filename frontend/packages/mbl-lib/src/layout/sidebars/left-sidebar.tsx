import React, { useState } from "react";
import { css } from "../../styled-system/css";
import { ActionIcon, Tabs } from "@mantine/core";
import { MacScrollbar } from "mac-scrollbar";
import { PageStructureTree } from "../tree/page-structure-tree";
import { DataBindingPanel } from "@xxs3315/mbl-data-bindings";

interface LeftSidebarProps {
  showLeftSidebar: boolean;
  isMobileMode: boolean;
  currentPage: any;
  currentPageHeaderContent: Map<string, any>;
  currentPageBodyContent: Map<string, any>;
  currentPageFooterContent: Map<string, any>;
  currentSelectedId?: string;
  onItemClick: (itemId: string) => void;
  onClose: () => void;
}

export const LeftSidebar = React.memo<LeftSidebarProps>(
  ({
    showLeftSidebar,
    isMobileMode,
    currentPage,
    currentPageHeaderContent,
    currentPageBodyContent,
    currentPageFooterContent,
    currentSelectedId,
    onItemClick,
    onClose,
  }) => {
    const [activeTab, setActiveTab] = useState<string>("page-info");
    return (
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
          {/* 固定标题部分 */}
          <div
            className={css({
              display: showLeftSidebar ? "flex" : "none",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "4px 6px 2px 6px",
              flexShrink: "0",
              backgroundColor: "gray.50",
            })}
          >
            <Tabs
              value={activeTab}
              onChange={(value) => setActiveTab(value || "page-info")}
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
                  value="page-info"
                  className={css({
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "gray.800",
                    padding: "8px 16px",
                  })}
                >
                  页面信息
                </Tabs.Tab>
                <Tabs.Tab
                  value="data-binding"
                  className={css({
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "gray.800",
                    padding: "8px 16px",
                  })}
                >
                  数据绑定
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
            {/* 关闭按钮 - 仅在桌面端显示 */}
            <ActionIcon
              variant="subtle"
              aria-label="close-left-sidebar"
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

          {/* 可滚动内容部分 */}
          <MacScrollbar
            className={css({
              flex: "1",
              overflow: "auto",
            })}
          >
            <Tabs
              value={activeTab}
              onChange={(value) => setActiveTab(value || "page-info")}
            >
              <Tabs.Panel value="page-info">
                <div
                  className={css({
                    fontSize: "12px",
                    color: "gray.600",
                    padding: "16px",
                  })}
                >
                  <PageStructureTree
                    currentPage={currentPage}
                    currentPageHeaderContent={currentPageHeaderContent}
                    currentPageBodyContent={currentPageBodyContent}
                    currentPageFooterContent={currentPageFooterContent}
                    onItemClick={onItemClick}
                    currentSelectedId={currentSelectedId}
                  />
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="data-binding">
                <div
                  className={css({
                    fontSize: "12px",
                    color: "gray.600",
                    padding: "16px",
                  })}
                >
                  <DataBindingPanel />
                </div>
              </Tabs.Panel>
            </Tabs>
          </MacScrollbar>
        </div>
      </div>
    );
  },
);
