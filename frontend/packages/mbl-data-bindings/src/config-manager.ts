import { DataBindingConfig, NewConfigType, STORAGE_KEY } from "./types";
import { formatJson } from "./json-utils";

/**
 * 可用的配置类型
 */
export const availableConfigTypes: NewConfigType[] = [
  {
    id: "static-list",
    name: "静态数组数据",
    description: "本地JSON数组数据，如用户列表、商品列表等",
    shape: "list",
    request: "data",
  },
  {
    id: "static-object",
    name: "静态对象数据",
    description: "本地JSON对象数据，如用户信息、配置信息等",
    shape: "object",
    request: "data",
  },
  {
    id: "remote-list",
    name: "远程数组数据",
    description: "从API获取的数组数据，如REST API返回的列表",
    shape: "list",
    request: "url",
  },
  {
    id: "remote-object",
    name: "远程对象数据",
    description: "从API获取的对象数据，如REST API返回的单个资源",
    shape: "object",
    request: "url",
  },
];

/**
 * 从localStorage加载配置
 */
export const loadConfigs = (): DataBindingConfig[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn("Failed to load configs from localStorage:", error);
    return [];
  }
};

/**
 * 保存配置到localStorage
 */
export const saveConfigs = (configs: DataBindingConfig[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
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
): DataBindingConfig[] => {
  const newConfig = createConfig(configType);
  const updatedConfigs = [...configs, newConfig];
  saveConfigs(updatedConfigs);
  return updatedConfigs;
};

/**
 * 更新配置值
 */
export const updateConfigValue = (
  configs: DataBindingConfig[],
  id: string,
  value: string,
): DataBindingConfig[] => {
  const updatedConfigs = configs.map((config) =>
    config.id === id ? { ...config, value } : config,
  );
  saveConfigs(updatedConfigs);
  return updatedConfigs;
};

/**
 * 删除配置
 */
export const deleteConfig = (
  configs: DataBindingConfig[],
  id: string,
): DataBindingConfig[] => {
  const updatedConfigs = configs.filter((config) => config.id !== id);
  saveConfigs(updatedConfigs);
  return updatedConfigs;
};

/**
 * 格式化配置JSON
 */
export const formatConfigJson = (
  configs: DataBindingConfig[],
  id: string,
): DataBindingConfig[] => {
  const config = configs.find((c) => c.id === id);
  if (!config || config.request !== "data") return configs;

  const formatted = formatJson(config.value);
  if (formatted !== config.value) {
    return updateConfigValue(configs, id, formatted);
  }
  return configs;
};
