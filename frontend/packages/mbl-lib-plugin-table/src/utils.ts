import { pt2px } from "@xxs3315/mbl-utils";

// 工具函数：将 columns 数组转换为 Map
export const columnsToMap = (columns: any[]) => {
  return new Map(columns);
};

// 获取 flex 样式
export const getFlexStyle = (item: any) => {
  const flexValue = item.wildStar
    ? "1"
    : `${item.canGrow ? "1" : "0"} ${item.canShrink ? "1" : "0"} ${item.flexUnit === "%" ? item.flexValue : item.flexValue}${item.flexUnit}`;
  return { flex: flexValue };
};

// 获取垂直对齐样式
export const getVerticalStyle = (vertical?: string) => {
  if (vertical === "top")
    return {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginTop: 0,
    };
  if (vertical === "bottom")
    return {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-end",
      marginTop: 0,
    };
  return {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 0,
  };
};

// 生成随机ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// 获取内边距样式
export const getPaddingStyle = (
  pTop: number,
  pRight: number,
  pBottom: number,
  pLeft: number,
  dpi: number,
) => ({
  paddingTop: `${pt2px(pTop ?? 0, dpi)}px`,
  paddingRight: `${pt2px(pRight ?? 0, dpi)}px`,
  paddingBottom: `${pt2px(pBottom ?? 0, dpi)}px`,
  paddingLeft: `${pt2px(pLeft ?? 0, dpi)}px`,
});
