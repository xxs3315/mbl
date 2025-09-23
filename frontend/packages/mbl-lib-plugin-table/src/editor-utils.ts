/**
 * 获取编辑器配置
 */
export const getEditorConfig = (request: "url" | "data") => {
  const baseConfig = {
    fontSize: 12,
    showPrintMargin: false,
    showGutter: true,
    highlightActiveLine: false,
    showLineNumbers: true,
    tabSize: 2,
    useWorker: false,
    wrap: true,
    readOnly: false, // This will be overridden in attr-panel
    highlightSelectedWord: false,
    cursorStyle: "ace" as const,
    mergeUndoDeltas: true,
    behavioursEnabled: true,
    wrapBehavioursEnabled: true,
    autoScrollEditorIntoView: true,
    scrollPastEnd: false,
    animatedScroll: true,
    fixedWidthGutter: true,
    showFoldWidgets: false,
    enableBasicAutocompletion: false,
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
      maxLines: 3,
      minLines: 2,
    };
  }
};

/**
 * 获取编辑器样式
 */
export const getEditorStyle = () => ({
  fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
  fontSize: "12px",
  lineHeight: "1.4",
  fontVariantNumeric: "tabular-nums",
  fontFeatureSettings: '"tnum"',
  letterSpacing: "0px",
  WebkitFontSmoothing: "antialiased" as const,
  MozOsxFontSmoothing: "grayscale" as const,
  textRendering: "optimizeSpeed" as const,
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
