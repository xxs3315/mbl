import { ceil } from "lodash-es";
import type { PageRectangle } from "@xxs3315/mbl-typings";

export const mm2px = (mm: number, dpi: number) => {
  return ceil((mm * dpi) / 25.4);
};

export const px2mm = (px: number, dpi: number) => {
  // console.log("px2mm", px, dpi, ceil((px * 25.4) / dpi, 2));
  return ceil((px * 25.4) / dpi, 2);
};

export const px2pt = (px: number, dpi: number) => {
  // console.log("px2pt", px, dpi, ceil((px * 72) / dpi));
  return ceil((px * 72) / dpi);
};

export const pt2px = (pt: number, dpi: number) => {
  // console.log("pt2px", pt, dpi, ceil((pt * dpi) / 72));
  return ceil((pt * dpi) / 72);
};

export const getRectangleSize = (rectangle: PageRectangle) => {
  if (rectangle === "LETTER") {
    return { width: 215.9, height: 279.4 };
  }
  if (rectangle === "TABLOID") {
    return { width: 279, height: 432 };
  }
  if (rectangle === "LEGAL") {
    return { width: 216, height: 356 };
  }
  if (rectangle === "A0") {
    return { width: 841, height: 1189 };
  }
  if (rectangle === "A1") {
    return { width: 594, height: 841 };
  }
  if (rectangle === "A2") {
    return { width: 420, height: 594 };
  }
  if (rectangle === "A3") {
    return { width: 297, height: 420 };
  }
  if (rectangle === "A4") {
    return { width: 210, height: 297 };
  }
  if (rectangle === "A5") {
    return { width: 148, height: 210 };
  }
  if (rectangle === "A6") {
    return { width: 105, height: 148 };
  }
  return { width: 210, height: 297 };
};
