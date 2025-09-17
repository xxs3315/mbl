import React from "react";
import { css } from "../styled-system/css";
import { Item, List } from "@xxs3315/mbl-core";
import { DndTarget } from "../dnd/target";
import { ItemTypes } from "../dnd/item-types";
import { pt2px } from "@xxs3315/mbl-utils";
import { useDpi } from "../providers/dpi-provider";

export function useItemElement(
  colors: any,
  currentSelectedId?: string,
  setCurrentSelectedId?: (id: string) => void,
  getFlexStyle?: (item: any) => any,
  getComponent?: (
    props: any,
    position: "header" | "body" | "footer",
  ) => React.ReactNode,
  renderDragHandle?: (
    itemId: string,
    position: "header" | "body" | "footer",
  ) => React.ReactNode,
  renderCopyButton?: (
    itemId: string,
    position: "header" | "body" | "footer",
    copyItem?: (id: string, type: string) => void,
  ) => React.ReactNode,
  renderDeleteButton?: (
    itemId: string,
    position: "header" | "body" | "footer",
    deleteItem?: (id: string, type: string) => void,
  ) => React.ReactNode,
  renderPopover?: (itemId: string) => React.ReactNode,
  renderDropLineElement?: any,
  renderGhostElement?: any,
  renderPlaceholderElement?: any,
  renderStackedGroupElement?: any,
  renderHorizontalDropLineElement?: any,
  renderHorizontalGhostElement?: any,
  renderHorizontalPlaceholderElement?: any,
  renderHorizontalStackedGroupElement?: any,
  onDragEnd?: (meta: any, position: "header" | "body" | "footer") => void,
  onDndDropEnd?: (
    dropItem: any,
    position: "header" | "body" | "footer",
    targetId: string,
  ) => void,
  stableAcceptArrays?: any,
  stableMoreStyles?: any,
  getVerticalStyle?: (vertical?: string) => any,
  currentPageHeaderContent?: Map<string, any>,
  currentPageBodyContent?: Map<string, any>,
  currentPageFooterContent?: Map<string, any>,
  copyItem?: (id: string, type: string) => void,
  deleteItem?: (id: string, type: string) => void,
) {
  const { dpi } = useDpi();

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

        const childItems = item.children.map((itemId: string) =>
          contentMap?.get(itemId),
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
                setCurrentSelectedId?.(item.id);
              }}
              currentSelectedId={currentSelectedId}
              moreStyle={getFlexStyle?.(item)}
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
                {renderDragHandle?.(item.id, position)}
                {renderCopyButton?.(item.id, position, copyItem)}
                {renderDeleteButton?.(item.id, position, deleteItem)}
                {renderPopover?.(item.id)}
                <List
                  identifier={`list-h-${item.id}`}
                  className={css({ width: "full" })}
                  renderDropLine={renderHorizontalDropLineElement}
                  renderGhost={renderHorizontalGhostElement}
                  renderPlaceholder={renderHorizontalPlaceholderElement}
                  renderStackedGroup={renderHorizontalStackedGroupElement}
                  direction="horizontal"
                  onDragEnd={(meta) => onDragEnd?.(meta, position)}
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
                    <DndTarget
                      identifier={item.id}
                      data-title={item.title}
                      accept={stableAcceptArrays?.containerAndElement}
                      lastDroppedItem={null}
                      onDrop={(dropItem) =>
                        onDndDropEnd?.(dropItem, position, item.id)
                      }
                      key={`item-h-${item.id}-target`}
                      greedy={false}
                      moreStyle={getVerticalStyle?.(item.vertical)}
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
                setCurrentSelectedId?.(item.id);
              }}
              currentSelectedId={currentSelectedId}
              moreStyle={getFlexStyle?.(item)}
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
                {renderDragHandle?.(item.id, position)}
                {renderCopyButton?.(item.id, position, copyItem)}
                {renderDeleteButton?.(item.id, position, deleteItem)}
                {renderPopover?.(item.id)}
                <List
                  identifier={`list-v-${item.id}`}
                  className={css({ width: "full" })}
                  renderDropLine={renderDropLineElement}
                  renderGhost={renderGhostElement}
                  renderPlaceholder={renderPlaceholderElement}
                  renderStackedGroup={renderStackedGroupElement}
                  onDragEnd={(meta) => onDragEnd?.(meta, position)}
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
                    <DndTarget
                      identifier={item.id}
                      data-title={item.title}
                      accept={stableAcceptArrays?.containerAndElement}
                      lastDroppedItem={null}
                      onDrop={(dropItem) =>
                        onDndDropEnd?.(dropItem, position, item.id)
                      }
                      key={`item-h-${item.id}-target`}
                      greedy={false}
                      moreStyle={stableMoreStyles?.marginTop0}
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
            setCurrentSelectedId?.(item.id);
          }}
          currentSelectedId={currentSelectedId}
          moreStyle={getFlexStyle?.(item)}
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
            {renderDragHandle?.(item.id, position)}
            {renderCopyButton?.(item.id, position, copyItem)}
            {renderDeleteButton?.(item.id, position, deleteItem)}
            {renderPopover?.(item.id)}
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
                {getComponent?.(item, position)}
              </div>
            </div>
          </div>
        </Item>
      );
    },
    [
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
    ],
  );

  return {
    createItemElement,
  };
}
