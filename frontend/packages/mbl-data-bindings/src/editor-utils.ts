import { EditorTheme, getThemeStorageKey } from "./types";
import { validateJson } from "./json-utils";

/**
 * 获取输入验证错误信息
 */
export const getInputValidation = (
  value: string,
  request: "url" | "data",
): string | null => {
  if (!value.trim()) return null;

  if (request === "url") {
    return validateUrl(value) ? null : "URL格式错误，请检查";
  } else {
    const validation = validateJson(value);
    return validation.valid ? null : "JSON格式错误，请检查";
  }
};

/**
 * 验证URL格式
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 获取编辑器主题
 */
export const getEditorTheme = (tableId: string): EditorTheme => {
  const storageKey = getThemeStorageKey(tableId);
  const savedTheme = localStorage.getItem(storageKey);
  if (
    savedTheme &&
    ["github", "monokai", "tomorrow", "kuroir"].includes(savedTheme)
  ) {
    return savedTheme as EditorTheme;
  }
  return "github";
};

/**
 * 保存编辑器主题
 */
export const saveEditorTheme = (theme: EditorTheme, tableId: string): void => {
  const storageKey = getThemeStorageKey(tableId);
  localStorage.setItem(storageKey, theme);
};

/**
 * 获取编辑器配置
 */
export const getEditorConfig = (request: "url" | "data") => {
  const baseConfig = {
    fontSize: 12, // 与CSS中的fontSize保持一致
    showPrintMargin: false,
    showGutter: true,
    highlightActiveLine: false,
    showLineNumbers: true,
    tabSize: 2,
    useWorker: false,
    wrap: true,
    readOnly: false,
    highlightSelectedWord: false,
    cursorStyle: "ace" as const,
    mergeUndoDeltas: true,
    behavioursEnabled: true,
    wrapBehavioursEnabled: true,
    autoScrollEditorIntoView: true,
    scrollPastEnd: false,
    animatedScroll: true,
    // 修复等宽字体相关配置
    fixedWidthGutter: true, // 固定行号宽度
    showFoldWidgets: false, // 禁用折叠控件，避免宽度计算问题
    enableBasicAutocompletion: false, // 暂时禁用自动完成，避免字体计算干扰
    enableLiveAutocompletion: false,
    enableSnippets: false,
  };

  if (request === "data") {
    return {
      ...baseConfig,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
      maxLines: 8,
      minLines: 3,
    };
  } else {
    return {
      ...baseConfig,
      enableBasicAutocompletion: false,
      enableLiveAutocompletion: false,
      enableSnippets: false,
      maxLines: 3,
      minLines: 2,
    };
  }
};

/**
 * 获取编辑器样式
 */
export const getEditorStyle = () => ({
  // 使用更兼容的等宽字体配置
  fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
  fontSize: "12px", // 使用px而不是相对单位
  lineHeight: "1.4", // 稍微增加行高
  // 修复等宽字体导致的光标错位
  fontVariantNumeric: "tabular-nums",
  fontFeatureSettings: '"tnum"',
  letterSpacing: "0px", // 明确指定px单位
  // 强制字体渲染优化
  WebkitFontSmoothing: "antialiased" as const,
  MozOsxFontSmoothing: "grayscale" as const,
  textRendering: "optimizeSpeed" as const, // 使用optimizeSpeed而不是optimizeLegibility
  // 确保字体渲染一致性
  fontDisplay: "block" as const,
  width: "100%",
  height: "100%",
});

/**
 * 获取编辑器属性
 */
export const getEditorProps = () => ({
  $blockScrolling: true,
  $highlightPending: true,
});
