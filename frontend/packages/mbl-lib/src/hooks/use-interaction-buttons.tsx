import React from "react";
import { css } from "../styled-system/css";
import { DragHandleComponent } from "@xxs3315/mbl-core";
import { Popover, NavLink } from "@mantine/core";
import { DotsSVG, CopySVG, DeleteSVG, NavSVG } from "../layout/icons";

export function useInteractionButtons(
  colors: any,
  currentSelectedId?: string,
  togglePopover?: (itemId: string) => void,
  isPopoverOpen?: (itemId: string) => boolean,
  closePopover?: () => void,
  setCurrentSelectedId?: (id: string) => void,
  getCachedPath?: (
    itemId: string,
    content: Map<string, any>,
    rootId: string,
  ) => any[],
  currentPageHeaderContent?: Map<string, any>,
  currentPageBodyContent?: Map<string, any>,
  currentPageFooterContent?: Map<string, any>,
  PAGE_HEADER_ROOT_ID?: string,
  PAGE_BODY_ROOT_ID?: string,
  PAGE_FOOTER_ROOT_ID?: string,
) {
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
            display: itemId === currentSelectedId ? "block" : "none",
          })}
        >
          <div
            style={{
              backgroundColor: colors.primaryLight,
              display: itemId === currentSelectedId ? "block" : "none",
            }}
          >
            <DotsSVG />
          </div>
        </DragHandleComponent>
      );
    },
    [currentSelectedId, colors.primaryLight],
  );

  const renderCopyButton = React.useCallback(
    (
      itemId: string,
      position: "header" | "body" | "footer" = "body",
      copyItem?: (id: string, type: string) => void,
    ) => {
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
            if (copyItem) {
              copyItem(itemId, position);
            }
            event.stopPropagation();
          }}
        >
          <CopySVG />
        </div>
      );
    },
    [currentSelectedId, colors.primaryLight],
  );

  const renderDeleteButton = React.useCallback(
    (
      itemId: string,
      position: "header" | "body" | "footer" = "body",
      deleteItem?: (id: string, type: string) => void,
    ) => {
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
            if (deleteItem) {
              deleteItem(itemId, position);
            }
            event.stopPropagation();
          }}
        >
          <DeleteSVG />
        </div>
      );
    },
    [currentSelectedId, colors.primaryLight],
  );

  const renderPopover = React.useCallback(
    (itemId: string) => {
      if (
        !togglePopover ||
        !isPopoverOpen ||
        !closePopover ||
        !setCurrentSelectedId ||
        !getCachedPath
      ) {
        return null;
      }

      // 查找当前选中项目所在的position和content
      let currentPosition: "header" | "body" | "footer" = "body";
      let currentContent = currentPageBodyContent;

      if (currentPageHeaderContent?.has(itemId)) {
        currentPosition = "header";
        currentContent = currentPageHeaderContent;
      } else if (currentPageFooterContent?.has(itemId)) {
        currentPosition = "footer";
        currentContent = currentPageFooterContent;
      } else if (currentPageBodyContent?.has(itemId)) {
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

      if (!rootId || !currentContent) {
        return null;
      }

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
              <NavSVG />
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
      colors.primaryLight,
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
    ],
  );

  return {
    renderDragHandle,
    renderCopyButton,
    renderDeleteButton,
    renderPopover,
  };
}
