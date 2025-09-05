import { Store } from "@xxs3315/mbl-typings";

export type Position = "header" | "body" | "footer";

export function getContentMapByPosition(state: Store, position: Position) {
  if (position === "header") return state.currentPageHeaderContent;
  if (position === "footer") return state.currentPageFooterContent;
  return state.currentPageBodyContent;
}

export function cloneContentMap(map: Map<any, any>) {
  return new Map(map);
}

export function updateSelectedItemProp<T extends keyof any>(
  options: {
    currentSelectedId: string;
    position: Position;
    currentPageIndex: number;
    state: Store;
    setCurrentPageAndContent: (
      pageIndex: number,
      content: Map<any, any>,
      position: Position,
    ) => void;
  },
  key: T,
  value: any,
) {
  const sourceMap = getContentMapByPosition(options.state, options.position);
  const newMap = cloneContentMap(sourceMap);
  const item = newMap.get(options.currentSelectedId);
  if (!item) return;
  newMap.set(options.currentSelectedId, { ...item, [key]: value });
  options.setCurrentPageAndContent(
    options.currentPageIndex,
    newMap as any,
    options.position,
  );
}

export function updateSelectedItemProps<T extends Record<string, any>>(
  options: {
    currentSelectedId: string;
    position: Position;
    currentPageIndex: number;
    state: Store;
    setCurrentPageAndContent: (
      pageIndex: number,
      content: Map<any, any>,
      position: Position,
    ) => void;
  },
  updates: T,
) {
  const sourceMap = getContentMapByPosition(options.state, options.position);
  const newMap = cloneContentMap(sourceMap);
  const item = newMap.get(options.currentSelectedId);
  if (!item) return;

  // 批量更新所有属性
  const updatedItem = { ...item, ...updates };
  newMap.set(options.currentSelectedId, updatedItem);

  options.setCurrentPageAndContent(
    options.currentPageIndex,
    newMap as any,
    options.position,
  );
}
