import React from "react";
import { css } from "../../styled-system/css";
import { ActionIcon, Tabs } from "@mantine/core";
import { MacScrollbar } from "mac-scrollbar";
import { useThemeColorsContext, useI18n } from "@xxs3315/mbl-providers";

interface PageSelectorProps {
  showPageSelector: boolean;
  isMobileMode: boolean;
  pages: any[];
  currentPageIndex: number;
  onClose: () => void;
  onPageSelect: (pageIndex: number) => void;
}

export const PageSelector = React.memo<PageSelectorProps>(
  ({
    showPageSelector,
    isMobileMode,
    pages,
    currentPageIndex,
    onClose,
    onPageSelect,
  }) => {
    const { t } = useI18n();
    const colors = useThemeColorsContext();

    return (
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
              padding: "4px 6px 2px 6px",
              flexShrink: "0",
              backgroundColor: "gray.50",
            })}
          >
            <Tabs
              value="pages"
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
                  value="pages"
                  className={css({
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "gray.800",
                    padding: "8px 16px",
                  })}
                >
                  {t("attributePanel.mblLib.sidebars.pageSelector.title")}
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
            {/* 关闭按钮 - 仅在桌面端显示 */}
            <ActionIcon
              variant="subtle"
              aria-label="close-page-selector"
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
                  onClick={() => onPageSelect(index)}
                >
                  <div
                    className={css({
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "gray.700",
                      marginBottom: "4px",
                    })}
                  >
                    {page.name ||
                      `${t("attributePanel.mblLib.common.page")} ${index + 1}`}
                  </div>
                  <div
                    className={css({
                      fontSize: "12px",
                      color: "gray.500",
                    })}
                  >
                    {page.orientation === "portrait"
                      ? t("attributePanel.mblLib.common.portrait")
                      : t("attributePanel.mblLib.common.landscape")}{" "}
                    · {page.rectangle}
                  </div>
                </div>
              ))}
            </div>
          </MacScrollbar>
        </div>
      </div>
    );
  },
);
