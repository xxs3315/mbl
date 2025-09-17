import React from "react";
import { css } from "../../styled-system/css";
import { ActionIcon } from "@mantine/core";
import { MacScrollbar } from "mac-scrollbar";
import { PageStructureTree } from "../tree/page-structure-tree";

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
              onItemClick={onItemClick}
              currentSelectedId={currentSelectedId}
            />
          </MacScrollbar>
        </div>
      </div>
    );
  },
);
