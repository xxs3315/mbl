import React from "react";
import { css } from "../styled-system/css";
import { List } from "@xxs3315/mbl-core";
import { DndTarget } from "@xxs3315/mbl-dnd";
import { pt2px } from "@xxs3315/mbl-utils";
import { useDpi } from "@xxs3315/mbl-providers";
import {
  PAGE_HEADER_ROOT_ID,
  PAGE_BODY_ROOT_ID,
  PAGE_FOOTER_ROOT_ID,
  PAGE_ROOT_ID,
} from "../constants";

export function useCanvasRenderer(
  colors: any,
  currentSelectedId?: string,
  setCurrentSelectedId?: (id: string) => void,
  canvasWidth?: number,
  canvasHeight?: number,
  currentPage?: any,
  headerElements?: React.ReactNode[],
  bodyElements?: React.ReactNode[],
  footerElements?: React.ReactNode[],
  renderDropLineElement?: any,
  renderGhostElement?: any,
  renderPlaceholderElement?: any,
  renderStackedGroupElement?: any,
  onDragEnd?: (meta: any, position: "header" | "body" | "footer") => void,
  onDragStart?: (meta: any) => void,
  onDndDropEnd?: (
    dropItem: any,
    position: "header" | "body" | "footer",
    targetId: string,
  ) => void,
  stableAcceptArrays?: any,
  stableMoreStyles?: any,
) {
  const { dpi } = useDpi();

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

  const renderCanvas = React.useCallback(() => {
    return (
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
          setCurrentSelectedId?.(PAGE_ROOT_ID);
        }}
      >
        {/* Header Section */}
        <div
          onClick={(event) => {
            event.stopPropagation();
            setCurrentSelectedId?.(PAGE_HEADER_ROOT_ID);
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
            onDragEnd={(meta) => onDragEnd?.(meta, "header")}
            onDragStart={onDragStart}
          >
            <DndTarget
              identifier={PAGE_HEADER_ROOT_ID}
              data-title={PAGE_HEADER_ROOT_ID}
              accept={stableAcceptArrays?.containerElementPageHeader}
              lastDroppedItem={null}
              onDrop={(item) =>
                onDndDropEnd?.(item, "header", PAGE_HEADER_ROOT_ID)
              }
              key={9999}
              greedy={false}
              moreStyle={stableMoreStyles?.marginTop0}
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

        {/* Body Section */}
        <div
          style={{
            display: "flex",
            minHeight: `${canvasHeight! - (pt2px(currentPageMTop, dpi) + pt2px(currentPageMBottom, dpi))}px`,
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
            setCurrentSelectedId?.(PAGE_BODY_ROOT_ID);
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
            onDragEnd={(meta) => onDragEnd?.(meta, "body")}
            onDragStart={onDragStart}
          >
            <DndTarget
              identifier={PAGE_BODY_ROOT_ID}
              data-title={PAGE_BODY_ROOT_ID}
              accept={stableAcceptArrays?.containerElementPageBody}
              lastDroppedItem={null}
              onDrop={(item) => onDndDropEnd?.(item, "body", PAGE_BODY_ROOT_ID)}
              key={9999}
              greedy={false}
              moreStyle={stableMoreStyles?.marginTop0}
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

        {/* Footer Section */}
        <div
          onClick={(event) => {
            event.stopPropagation();
            setCurrentSelectedId?.(PAGE_FOOTER_ROOT_ID);
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
            onDragEnd={(meta) => onDragEnd?.(meta, "footer")}
            onDragStart={onDragStart}
          >
            <DndTarget
              identifier={PAGE_FOOTER_ROOT_ID}
              data-title={PAGE_FOOTER_ROOT_ID}
              accept={stableAcceptArrays?.containerElementPageFooter}
              lastDroppedItem={null}
              onDrop={(item) =>
                onDndDropEnd?.(item, "footer", PAGE_FOOTER_ROOT_ID)
              }
              key={9999}
              greedy={false}
              moreStyle={stableMoreStyles?.marginTop0}
            >
              {footerElements}
            </DndTarget>
          </List>
        </div>
      </div>
    );
  }, [
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
    dpi,
    currentPageMTop,
    currentPageMRight,
    currentPageMBottom,
    currentPageMLeft,
    currentPagePTop,
    currentPagePRight,
    currentPagePBottom,
    currentPagePLeft,
    currentPageHeaderPTop,
    currentPageHeaderPRight,
    currentPageHeaderPBottom,
    currentPageHeaderPLeft,
  ]);

  return {
    renderCanvas,
  };
}
