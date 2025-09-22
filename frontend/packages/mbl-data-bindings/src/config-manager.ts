import { DataBindingConfig, NewConfigType, getStorageKey } from "./types";
import { formatJson } from "./json-utils";

/**
 * 获取国际化的配置类型
 */
export const getAvailableConfigTypes = (
  t: (key: string, options?: any) => string,
): NewConfigType[] => [
  {
    id: "static-list",
    name: t("configTypes.staticList", { ns: "dataBinding" }),
    description: t("configTypes.staticListDesc", { ns: "dataBinding" }),
    shape: "list",
    request: "data",
  },
  {
    id: "static-object",
    name: t("configTypes.staticObject", { ns: "dataBinding" }),
    description: t("configTypes.staticObjectDesc", { ns: "dataBinding" }),
    shape: "object",
    request: "data",
  },
  {
    id: "remote-list",
    name: t("configTypes.remoteList", { ns: "dataBinding" }),
    description: t("configTypes.remoteListDesc", { ns: "dataBinding" }),
    shape: "list",
    request: "url",
  },
  {
    id: "remote-object",
    name: t("configTypes.remoteObject", { ns: "dataBinding" }),
    description: t("configTypes.remoteObjectDesc", { ns: "dataBinding" }),
    shape: "object",
    request: "url",
  },
];

/**
 * 从localStorage加载配置
 */
export const loadConfigs = (tableId: string): DataBindingConfig[] => {
  try {
    const storageKey = getStorageKey(tableId);
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn("Failed to load configs from localStorage:", error);
    return [];
  }
};

/**
 * 保存配置到localStorage
 */
export const saveConfigs = (
  configs: DataBindingConfig[],
  tableId: string,
): void => {
  try {
    const storageKey = getStorageKey(tableId);
    localStorage.setItem(storageKey, JSON.stringify(configs));
  } catch (error) {
    console.warn("Failed to save configs to localStorage:", error);
  }
};

/**
 * 创建新配置
 */
export const createConfig = (configType: NewConfigType): DataBindingConfig => {
  return {
    id: `${configType.id}-${Date.now()}`,
    name: configType.name,
    description: configType.description,
    shape: configType.shape,
    request: configType.request,
    value: "",
    bindings: [],
  };
};

/**
 * 添加配置
 */
export const addConfig = (
  configs: DataBindingConfig[],
  configType: NewConfigType,
  tableId: string,
): DataBindingConfig[] => {
  const newConfig = createConfig(configType);
  const updatedConfigs = [...configs, newConfig];
  saveConfigs(updatedConfigs, tableId);
  return updatedConfigs;
};

/**
 * 更新配置值
 */
export const updateConfigValue = (
  configs: DataBindingConfig[],
  id: string,
  value: string,
  tableId: string,
): DataBindingConfig[] => {
  const updatedConfigs = configs.map((config) =>
    config.id === id ? { ...config, value } : config,
  );
  saveConfigs(updatedConfigs, tableId);
  return updatedConfigs;
};

/**
 * 删除配置
 */
export const deleteConfig = (
  configs: DataBindingConfig[],
  id: string,
  tableId: string,
): DataBindingConfig[] => {
  const updatedConfigs = configs.filter((config) => config.id !== id);
  saveConfigs(updatedConfigs, tableId);
  return updatedConfigs;
};

/**
 * 格式化配置JSON
 */
export const formatConfigJson = (
  configs: DataBindingConfig[],
  id: string,
  tableId: string,
): DataBindingConfig[] => {
  const config = configs.find((c) => c.id === id);
  if (!config || config.request !== "data") return configs;

  const formatted = formatJson(config.value);
  if (formatted !== config.value) {
    return updateConfigValue(configs, id, formatted, tableId);
  }
  return configs;
};
