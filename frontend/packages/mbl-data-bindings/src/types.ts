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

// 存储键常量
export const STORAGE_KEY = "mbl-data-binding-configs";
export const THEME_STORAGE_KEY = "mbl-data-binding-editor-theme";
