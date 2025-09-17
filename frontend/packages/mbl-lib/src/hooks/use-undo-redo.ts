import React from "react";
import { useTemporal } from "../store/store";

export function useUndoRedo() {
  const temporal = useTemporal();
  const [undoCount, setUndoCount] = React.useState(0);
  const [redoCount, setRedoCount] = React.useState(0);

  // 监听撤销重做栈的变化
  React.useEffect(() => {
    // 初始化计数
    const initialState = temporal.getState();
    setUndoCount(initialState.undoStack.length);
    setRedoCount(initialState.redoStack.length);

    // 订阅temporal store的变化
    const unsubscribe = temporal.subscribe((state: any) => {
      setUndoCount(state.undoStack.length);
      setRedoCount(state.redoStack.length);
    });

    return unsubscribe;
  }, [temporal]);

  const undo = React.useCallback(() => {
    temporal.getState().undo();
  }, [temporal]);

  const redo = React.useCallback(() => {
    temporal.getState().redo();
  }, [temporal]);

  return {
    undoCount,
    redoCount,
    undo,
    redo,
  };
}
