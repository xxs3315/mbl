import React from "react";
import { css } from "../../styled-system/css";
import { ActionIcon, Tabs, Modal, Button, Group, Text } from "@mantine/core";
import { MacScrollbar } from "mac-scrollbar";
import { useThemeColorsContext, useI18n } from "@xxs3315/mbl-providers";
import { useContentsStoreContext } from "../../store/store";

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
    const addPageAfterCurrent = useContentsStoreContext(
      (s) => s.addPageAfterCurrent,
    );
    const deletePage = useContentsStoreContext((s) => s.deletePage);

    // 确认删除对话框状态
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

    // 处理删除确认
    const handleDeleteConfirm = () => {
      deletePage(currentPageIndex);
      setDeleteModalOpen(false);
    };

    // 处理删除按钮点击
    const handleDeleteClick = () => {
      // 如果只有一个页面，不能删除
      if (pages.length <= 1) {
        return;
      }
      setDeleteModalOpen(true);
    };

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
                  {t("sidebars.pageSelector.title", { ns: "layout" })}
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
          {/* 按钮工具条 - 固定在顶部 */}
          <div
            className={css({
              display: showPageSelector ? "flex" : "none",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "4px 6px",
              flexShrink: "0",
              backgroundColor: "gray.50",
            })}
          >
            <div>
              {/* 新增按钮 */}
              <ActionIcon
                variant="subtle"
                aria-label="add-page"
                onClick={addPageAfterCurrent}
                className={css({
                  color: "gray.700",
                  _hover: {
                    backgroundColor: "gray.100",
                  },
                })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M3 15h6" />
                  <path d="M6 12v6" />
                </svg>
              </ActionIcon>
              {/* 删除按钮 */}
              <ActionIcon
                variant="subtle"
                aria-label="delete-page"
                onClick={handleDeleteClick}
                disabled={pages.length <= 1}
                className={css({
                  color: pages.length <= 1 ? "gray.400" : "gray.700",
                  _hover: {
                    backgroundColor:
                      pages.length <= 1 ? "transparent" : "gray.100",
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
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </ActionIcon>
            </div>
            <div>
              {/* 设置按钮 */}
              <ActionIcon
                variant="subtle"
                aria-label="configuration"
                className={css({
                  color: "gray.700",
                  _hover: {
                    backgroundColor: "gray.100",
                  },
                })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 10.27 7 3.34" />
                  <path d="m11 13.73-4 6.93" />
                  <path d="M12 22v-2" />
                  <path d="M12 2v2" />
                  <path d="M14 12h8" />
                  <path d="m17 20.66-1-1.73" />
                  <path d="m17 3.34-1 1.73" />
                  <path d="M2 12h2" />
                  <path d="m20.66 17-1.73-1" />
                  <path d="m20.66 7-1.73 1" />
                  <path d="m3.34 17 1.73-1" />
                  <path d="m3.34 7 1.73 1" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="12" r="8" />
                </svg>
              </ActionIcon>
            </div>
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
                    {page.name || `${t("page", { ns: "common" })}`}
                  </div>
                  <div
                    className={css({
                      fontSize: "12px",
                      color: "gray.500",
                    })}
                  >
                    {page.orientation === "portrait"
                      ? t("portrait", {
                          ns: "common",
                        })
                      : t("landscape", {
                          ns: "common",
                        })}{" "}
                    · {page.rectangle}
                  </div>
                </div>
              ))}
            </div>
          </MacScrollbar>
        </div>

        {/* 删除确认对话框 */}
        <Modal
          opened={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title={t("sidebars.pageSelector.deleteConfirm.title", {
            ns: "layout",
          })}
          centered
        >
          <Text size="sm" mb="md">
            {t("sidebars.pageSelector.deleteConfirm.message", {
              ns: "layout",
            })}
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setDeleteModalOpen(false)}>
              {t("cancel", { ns: "common" })}
            </Button>
            <Button color="red" onClick={handleDeleteConfirm}>
              {t("delete", { ns: "common" })}
            </Button>
          </Group>
        </Modal>
      </div>
    );
  },
);
