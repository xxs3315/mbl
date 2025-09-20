import { EditorTheme, THEME_STORAGE_KEY } from "./types";
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
export const getEditorTheme = (): EditorTheme => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
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
export const saveEditorTheme = (theme: EditorTheme): void => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

/**
 * 获取编辑器配置
 */
export const getEditorConfig = (request: "url" | "data") => {
  const baseConfig = {
    fontSize: 10,
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
  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
  lineHeight: "1.2",
});

/**
 * 获取编辑器属性
 */
export const getEditorProps = () => ({
  $blockScrolling: true,
  $highlightPending: true,
});
