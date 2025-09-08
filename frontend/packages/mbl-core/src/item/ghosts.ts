import type { Direction } from "../shared";

export const initializeGhostElementStyle = (
  itemElement: HTMLElement,
  ghostWrapperElement: HTMLElement | undefined,
  itemSpacing: number,
  direction: Direction,
) => {
  if (ghostWrapperElement === undefined) return;

  const elementRect = itemElement.getBoundingClientRect();

  // 获取ghost元素的父容器位置（用于absolute定位计算）
  const parentElement = ghostWrapperElement.parentElement;
  const parentRect = parentElement
    ? parentElement.getBoundingClientRect()
    : { top: 0, left: 0 };

  // 计算相对于父容器的位置（因为现在使用position: absolute）
  const relativeTop = elementRect.top - parentRect.top;
  const relativeLeft = elementRect.left - parentRect.left;

  const top =
    direction === "vertical" ? relativeTop + itemSpacing / 2 : relativeTop;
  const left =
    direction === "horizontal" ? relativeLeft + itemSpacing / 2 : relativeLeft;
  const width =
    direction === "horizontal"
      ? elementRect.width - itemSpacing
      : elementRect.width;
  const height =
    direction === "vertical"
      ? elementRect.height - itemSpacing
      : elementRect.height;

  ghostWrapperElement.style.top = `${top}px`;
  ghostWrapperElement.style.left = `${left}px`;
  ghostWrapperElement.style.width = `${width}px`;
  ghostWrapperElement.style.height = `${height}px`;
};

export const moveGhostElement = (
  ghostWrapperElement: HTMLElement | undefined,
  movementXY: [number, number],
) => {
  if (ghostWrapperElement === undefined) return;

  const [x, y] = movementXY;
  ghostWrapperElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
};

export const clearGhostElementStyle = (
  ghostWrapperElement: HTMLElement | undefined,
) => {
  if (ghostWrapperElement === undefined) return;

  ghostWrapperElement.style.removeProperty("width");
  ghostWrapperElement.style.removeProperty("height");
};
