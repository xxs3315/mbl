// 样式常量 - 避免重复创建对象
export const HORIZONTAL_CONTAINER_STYLE = {
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  justifyContent: "flex-start",
  border: "1px solid #e5e7eb",
  padding: "0",
} as const;

export const VERTICAL_CONTAINER_STYLE = {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  border: "1px solid #e5e7eb",
  padding: "0",
} as const;

export const INNER_HORIZONTAL_STYLE = {
  display: "flex",
  width: "100%",
  flexDirection: "row",
  alignItems: "stretch",
  justifyContent: "flex-start",
  border: "1px solid #e5e7eb",
  padding: "0",
  backgroundColor: "#f3f4f620",
  color: "#3b82f6",
  gap: "1px",
} as const;

export const INNER_VERTICAL_STYLE = {
  borderRadius: "none",
  border: "1px solid #e5e7eb",
  padding: "0",
  backgroundColor: "#f3f4f620",
  display: "flex",
  flexDirection: "column",
  gap: "1px",
} as const;

export const LEAF_NODE_STYLE = {
  display: "flex",
  height: "100%",
  width: "100%",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "space-between",
  borderRadius: "none",
  border: "none",
  backgroundColor: "white",
  padding: "0",
} as const;

export const LEAF_INNER_STYLE = {
  height: "100%",
  minHeight: "16px",
  width: "100%",
  padding: "0px",
} as const;

// 按钮样式
export const BUTTON_STYLE = {
  height: "16px",
  width: "16px",
  cursor: "pointer",
  borderRadius: "2px",
  backgroundColor: "transparent",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  opacity: 1,
} as const;

export const BUTTONS_CONTAINER_STYLE = {
  position: "absolute",
  top: "-24px",
  right: "0",
  display: "flex",
  gap: "3px",
  zIndex: 10,
  backgroundColor: "#fafafa",
  borderRadius: "2px",
  padding: "2px",
  backdropFilter: "blur(8px)",
} as const;
