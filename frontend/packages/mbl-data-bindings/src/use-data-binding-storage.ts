import { useCallback } from "react";
import { useTableId } from "@xxs3315/mbl-providers";
import {
  DataBindingConfig,
  EditorTheme,
  getStorageKey,
  getThemeStorageKey,
} from "./types";

/**
 * 使用 tableId 的数据绑定存储 hook
 */
export function useDataBindingStorage() {
  const { tableId } = useTableId();

  // 配置存储相关函数
  const loadConfigs = useCallback((): DataBindingConfig[] => {
    try {
      const storageKey = getStorageKey(tableId);
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn("Failed to load configs from localStorage:", error);
      return [];
    }
  }, [tableId]);

  const saveConfigs = useCallback(
    (configs: DataBindingConfig[]): void => {
      try {
        const storageKey = getStorageKey(tableId);
        localStorage.setItem(storageKey, JSON.stringify(configs));
      } catch (error) {
        console.warn("Failed to save configs to localStorage:", error);
      }
    },
    [tableId],
  );

  // 主题存储相关函数
  const getEditorTheme = useCallback((): EditorTheme => {
    try {
      const storageKey = getThemeStorageKey(tableId);
      const savedTheme = localStorage.getItem(storageKey);
      if (
        savedTheme &&
        ["github", "monokai", "tomorrow", "kuroir"].includes(savedTheme)
      ) {
        return savedTheme as EditorTheme;
      }
      return "github";
    } catch (error) {
      console.warn("Failed to load theme from localStorage:", error);
      return "github";
    }
  }, [tableId]);

  const saveEditorTheme = useCallback(
    (theme: EditorTheme): void => {
      try {
        const storageKey = getThemeStorageKey(tableId);
        localStorage.setItem(storageKey, theme);
      } catch (error) {
        console.warn("Failed to save theme to localStorage:", error);
      }
    },
    [tableId],
  );

  return {
    loadConfigs,
    saveConfigs,
    getEditorTheme,
    saveEditorTheme,
  };
}
