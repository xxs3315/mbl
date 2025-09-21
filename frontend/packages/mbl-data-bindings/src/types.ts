// 数据绑定配置项类型
export interface DataBindingConfig {
  id: string;
  name: string;
  description: string;
  shape: "list" | "object";
  request: "url" | "data";
  value: string;
  bindings: Array<{ name: string; bind: string }>;
}

// 新增配置类型
export interface NewConfigType {
  id: string;
  name: string;
  description: string;
  shape: "list" | "object";
  request: "url" | "data";
}

// JSON字段类型
export interface JsonField {
  name: string;
  type: string;
  icon: React.ReactNode;
  color: string;
}

// 编辑器主题类型
export type EditorTheme = "github" | "monokai" | "tomorrow" | "kuroir";

// 字段图标信息
export interface FieldIconInfo {
  icon: React.ReactNode;
  color: string;
}

// 存储键基础常量
export const STORAGE_KEY_BASE = "mbl-data-binding-configs";
export const THEME_STORAGE_KEY_BASE = "mbl-data-binding-editor-theme";

// 生成带tableId后缀的存储键
export const getStorageKey = (tableId: string): string => {
  return `${STORAGE_KEY_BASE}-${tableId}`;
};

export const getThemeStorageKey = (tableId: string): string => {
  return `${THEME_STORAGE_KEY_BASE}-${tableId}`;
};
