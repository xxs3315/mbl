export type Position = "header" | "body" | "footer";

export function cloneContentMap(map: Map<any, any>) {
  return new Map(map);
}

// 细粒度版本，直接接受 content map
export function updateSelectedItemPropDirect<T extends keyof any>(
  options: {
    currentSelectedId: string;
    position: Position;
    currentPageIndex: number;
    contentMap: Map<string, any>;
    setCurrentPageAndContent: (
      pageIndex: number,
      content: Map<any, any>,
      position: Position,
    ) => void;
  },
  key: T,
  value: any,
) {
  const newMap = cloneContentMap(options.contentMap);
  const item = newMap.get(options.currentSelectedId);
  if (!item) return;
  newMap.set(options.currentSelectedId, { ...item, [key]: value });
  options.setCurrentPageAndContent(
    options.currentPageIndex,
    newMap as any,
    options.position,
  );
}

// 细粒度版本，直接接受 content map
export function updateSelectedItemPropsDirect<T extends Record<string, any>>(
  options: {
    currentSelectedId: string;
    position: Position;
    currentPageIndex: number;
    contentMap: Map<string, any>;
    setCurrentPageAndContent: (
      pageIndex: number,
      content: Map<any, any>,
      position: Position,
    ) => void;
  },
  updates: T,
) {
  const newMap = cloneContentMap(options.contentMap);
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
