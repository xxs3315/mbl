import React from "react";
import { getRectangleSize, mm2px } from "@xxs3315/mbl-utils";
import { useDpi } from "@xxs3315/mbl-providers";

export function useCanvasSize(currentPage: any) {
  const { dpi } = useDpi();
  const [canvasWidth, setCanvasWidth] = React.useState(1920);
  const [canvasHeight, setCanvasHeight] = React.useState(1080);

  // 从当前页面获取所有属性
  const currentPageRectangle = currentPage?.rectangle;
  const currentPageOrientation = currentPage?.orientation;

  React.useEffect(() => {
    const width = mm2px(getRectangleSize(currentPageRectangle).width, dpi);
    const height = mm2px(getRectangleSize(currentPageRectangle).height, dpi);
    setCanvasWidth(currentPageOrientation === "portrait" ? width : height);
    setCanvasHeight(currentPageOrientation === "portrait" ? height : width);
  }, [dpi, currentPageRectangle, currentPageOrientation]);

  return {
    canvasWidth,
    canvasHeight,
  };
}
