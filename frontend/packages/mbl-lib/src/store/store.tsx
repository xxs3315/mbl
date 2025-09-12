import { zustandPatchUndo } from "@xxs3315/mbl-state";
import React from "react";
import { createStore } from "zustand";
import type { StoreApi } from "zustand";
import {
  ContentData,
  Store,
  StorePageData,
  PageItem,
  PageRectangle,
} from "@xxs3315/mbl-typings";
import { defaultContents } from "./default-data";
import { type StorageValue, persist } from "zustand/middleware";

export const createContentsStore = (
  id: string,
  initialData?: ContentData,
): StoreApi<Store> & { temporal: any } => {
  const baseData = initialData || defaultContents;

  // 处理 pages 中每个页面的 content 数据，转换为 Map 格式
  const mapData = {
    config: baseData.config,
    pages: baseData.pages.map(
      (page): StorePageData => ({
        ...page,
        pageHeaderContent: new Map(page.pageHeaderContent),
        pageBodyContent: new Map(page.pageBodyContent),
        pageFooterContent: new Map(page.pageFooterContent),
      }),
    ),
  };

  // 边界检查：确保 currentPageIndex 在有效范围内
  const initialPageIndex = baseData.currentPageIndex ?? 0;
  const validPageIndex = Math.max(
    0,
    Math.min(initialPageIndex, mapData.pages.length - 1),
  );

  // 获取默认的页面内容
  const getDefaultPageHeaderContent = (): Map<string, PageItem> =>
    new Map([
      [
        "page-header-root",
        {
          id: "page-header-root",
          title: "",
          children: [],
          cat: "container",
          direction: "vertical" as const,
        },
      ],
    ]);

  const getDefaultPageBodyContent = (): Map<string, PageItem> =>
    new Map([
      [
        "page-body-root",
        {
          id: "page-body-root",
          title: "",
          children: [],
          cat: "container",
          direction: "vertical" as const,
        },
      ],
    ]);

  const getDefaultPageFooterContent = (): Map<string, PageItem> =>
    new Map([
      [
        "page-footer-root",
        {
          id: "page-footer-root",
          title: "",
          children: [],
          cat: "container",
          direction: "vertical" as const,
        },
      ],
    ]);

  const store = createStore<Store>()(
    persist(
      zustandPatchUndo(
        (set, _get, _store) =>
          ({
            ...mapData,
            currentPageIndex: validPageIndex,
            currentPageHeaderContent:
              mapData.pages[validPageIndex]?.pageHeaderContent ||
              getDefaultPageHeaderContent(),
            currentPageBodyContent:
              mapData.pages[validPageIndex]?.pageBodyContent ||
              getDefaultPageBodyContent(),
            currentPageFooterContent:
              mapData.pages[validPageIndex]?.pageFooterContent ||
              getDefaultPageFooterContent(),
            setCurrentPageIndex: (index: number) => {
              set((state) => {
                // 边界检查：确保索引在有效范围内
                const validIndex = Math.max(
                  0,
                  Math.min(index, state.pages.length - 1),
                );
                state.currentPageIndex = validIndex;
                // 同时更新 currentPageBodyContent
                if (state.pages[validIndex]) {
                  state.currentPageHeaderContent =
                    state.pages[validIndex].pageHeaderContent;
                  state.currentPageBodyContent =
                    state.pages[validIndex].pageBodyContent;
                  state.currentPageFooterContent =
                    state.pages[validIndex].pageFooterContent;
                } else {
                  // 如果页面不存在，使用默认内容
                  state.currentPageHeaderContent =
                    getDefaultPageHeaderContent();
                  state.currentPageBodyContent = getDefaultPageBodyContent();
                  state.currentPageFooterContent =
                    getDefaultPageFooterContent();
                }
              });
            },
            setCurrentPageAndContent: (
              pageIndex: number,
              content: Map<PageItem["id"], PageItem>,
              position: "header" | "body" | "footer",
            ) => {
              set((state) => {
                // 边界检查：确保索引在有效范围内
                const validIndex = Math.max(
                  0,
                  Math.min(pageIndex, state.pages.length - 1),
                );
                state.currentPageIndex = validIndex;
                if (position === "header") {
                  state.currentPageHeaderContent = content;
                } else if (position === "footer") {
                  state.currentPageFooterContent = content;
                } else if (position === "body") {
                  state.currentPageBodyContent = content;
                }
                // 同时更新对应页面的 pageBodyContent
                if (state.pages[validIndex]) {
                  if (position === "header") {
                    state.pages[validIndex].pageHeaderContent = content;
                  } else if (position === "footer") {
                    state.pages[validIndex].pageFooterContent = content;
                  } else if (position === "body") {
                    state.pages[validIndex].pageBodyContent = content;
                  }
                }
              });
            },
            updateTextItemValue: (
              itemId: string,
              newValue: string,
              position: "header" | "body" | "footer" = "body",
            ) => {
              set((state) => {
                let currentContentMap;
                let pageContentMap;

                switch (position) {
                  case "header":
                    currentContentMap = state.currentPageHeaderContent;
                    pageContentMap =
                      state.pages[state.currentPageIndex]?.pageHeaderContent;
                    break;
                  case "footer":
                    currentContentMap = state.currentPageFooterContent;
                    pageContentMap =
                      state.pages[state.currentPageIndex]?.pageFooterContent;
                    break;
                  case "body":
                  default:
                    currentContentMap = state.currentPageBodyContent;
                    pageContentMap =
                      state.pages[state.currentPageIndex]?.pageBodyContent;
                    break;
                }

                // 检查值是否真的发生了变化，避免不必要的更新
                const currentItem = currentContentMap.get(itemId);
                if (currentItem && currentItem.value === newValue) {
                  return state; // 值没有变化，直接返回原状态
                }

                // 更新当前页面的内容
                if (currentItem) {
                  currentItem.value = newValue;
                }

                // 同时更新对应页面的内容
                if (pageContentMap) {
                  const pageItem = pageContentMap.get(itemId);
                  if (pageItem && pageItem.value !== newValue) {
                    pageItem.value = newValue;
                  }
                }
              });
            },
            updatePluginItemProps: (
              itemId: string,
              newProps: any,
              position: "header" | "body" | "footer" = "body",
            ) => {
              set((state) => {
                let currentContentMap;
                let pageContentMap;

                switch (position) {
                  case "header":
                    currentContentMap = state.currentPageHeaderContent;
                    pageContentMap =
                      state.pages[state.currentPageIndex]?.pageHeaderContent;
                    break;
                  case "footer":
                    currentContentMap = state.currentPageFooterContent;
                    pageContentMap =
                      state.pages[state.currentPageIndex]?.pageFooterContent;
                    break;
                  case "body":
                  default:
                    currentContentMap = state.currentPageBodyContent;
                    pageContentMap =
                      state.pages[state.currentPageIndex]?.pageBodyContent;
                    break;
                }

                // 获取当前项目
                const currentItem = currentContentMap.get(itemId);
                if (!currentItem) {
                  return state; // 项目不存在，直接返回原状态
                }

                // 检查是否有实际变化，避免不必要的更新
                let hasChanges = false;
                for (const [key, value] of Object.entries(newProps)) {
                  if ((currentItem as any)[key] !== value) {
                    hasChanges = true;
                    break;
                  }
                }

                if (!hasChanges) {
                  return state; // 没有变化，直接返回原状态
                }

                // 直接修改现有对象的属性，不创建新对象
                Object.assign(currentItem, newProps);

                // 同时更新对应页面的内容
                if (pageContentMap) {
                  const pageItem = pageContentMap.get(itemId);
                  if (pageItem) {
                    Object.assign(pageItem, newProps);
                  }
                }
              });
            },
            updatePageName: (pageIndex: number, name: string) => {
              set((state) => {
                if (state.pages[pageIndex]) {
                  state.pages[pageIndex].name = name;
                }
              });
            },
            updatePageRectangle: (
              pageIndex: number,
              rectangle: PageRectangle,
            ) => {
              set((state) => {
                if (state.pages[pageIndex]) {
                  state.pages[pageIndex].rectangle = rectangle;
                }
              });
            },
            updatePageOrientation: (
              pageIndex: number,
              orientation: "landscape" | "portrait",
            ) => {
              set((state) => {
                if (state.pages[pageIndex]) {
                  state.pages[pageIndex].orientation = orientation;
                }
              });
            },
            updatePageBodyMargin: (
              pageIndex: number,
              paddingType:
                | "mLeftBody"
                | "mRightBody"
                | "mTopBody"
                | "mBottomBody",
              value: number,
            ) => {
              set((state) => {
                if (state.pages[pageIndex]) {
                  state.pages[pageIndex][paddingType] = value;
                }
              });
            },
            updatePageHeaderMargin: (
              pageIndex: number,
              marginType:
                | "mLeftHeader"
                | "mRightHeader"
                | "mTopHeader"
                | "mBottomHeader",
              value: number,
            ) => {
              set((state) => {
                if (state.pages[pageIndex]) {
                  state.pages[pageIndex][marginType] = value;
                }
              });
            },
            updatePageFooterMargin: (
              pageIndex: number,
              marginType:
                | "mLeftFooter"
                | "mRightFooter"
                | "mTopFooter"
                | "mBottomFooter",
              value: number,
            ) => {
              set((state) => {
                if (state.pages[pageIndex]) {
                  state.pages[pageIndex][marginType] = value;
                }
              });
            },
          }) as Store,
      ),
      {
        name: "mbl-store-" + id,
        storage: {
          getItem: (name: string) => {
            const str = localStorage.getItem(name);
            if (str) {
              const existingValue = JSON.parse(str);
              const state = existingValue.state;

              // 将 Array 格式的页面内容转换为 Map 格式
              if (state.pages && Array.isArray(state.pages)) {
                state.pages = state.pages.map((page: any) => ({
                  ...page,
                  pageHeaderContent: new Map(page.pageHeaderContent || []),
                  pageBodyContent: new Map(page.pageBodyContent || []),
                  pageFooterContent: new Map(page.pageFooterContent || []),
                }));
              }

              // 从 Array 格式转换为 Map 格式
              if (
                state.currentPageHeaderContent &&
                Array.isArray(state.currentPageHeaderContent)
              ) {
                state.currentPageHeaderContent = new Map(
                  state.currentPageHeaderContent,
                );
              }

              if (
                state.currentPageBodyContent &&
                Array.isArray(state.currentPageBodyContent)
              ) {
                state.currentPageBodyContent = new Map(
                  state.currentPageBodyContent,
                );
              }

              if (
                state.currentPageFooterContent &&
                Array.isArray(state.currentPageFooterContent)
              ) {
                state.currentPageFooterContent = new Map(
                  state.currentPageFooterContent,
                );
              }

              return {
                ...existingValue,
                state,
              };
            }
            // localStorage没有数据时，返回 initialData || defaultContents
            if (mapData) {
              return {
                state: {
                  ...mapData,
                },
              };
            }
            return null;
          },
          setItem: (name: string, newValue: StorageValue<Store>) => {
            // 将 Map 格式的页面内容转换为 Array 格式以便 JSON 序列化
            const serializableState = {
              ...newValue.state,
              pages: newValue.state.pages.map((page: any) => ({
                ...page,
                pageHeaderContent: Array.from(page.pageHeaderContent.entries()),
                pageBodyContent: Array.from(page.pageBodyContent.entries()),
                pageFooterContent: Array.from(page.pageFooterContent.entries()),
              })),
              // 从 Map 格式转换为 Array 格式
              currentPageHeaderContent: Array.from(
                newValue.state.currentPageHeaderContent.entries(),
              ),
              currentPageBodyContent: Array.from(
                newValue.state.currentPageBodyContent.entries(),
              ),
              currentPageFooterContent: Array.from(
                newValue.state.currentPageFooterContent.entries(),
              ),
            };

            const str = JSON.stringify({
              ...newValue,
              state: serializableState,
            });
            localStorage.setItem(name, str);
          },
          removeItem: (name: string) => localStorage.removeItem(name),
        },
      },
    ),
  );

  return store;
};

// context方案
export const ContentsStoreContext = React.createContext<
  (StoreApi<Store> & { temporal: any }) | null
>(null);

// 通用hook，获取当前context store并订阅
export function useContentsStoreContext<T>(selector: (state: Store) => T): T {
  const store = React.useContext(ContentsStoreContext);
  if (!store)
    throw new Error(
      "usePageStoreContext must be used within PageStoreContext.Provider",
    );

  // 特殊处理temporal字段
  if (selector.toString().includes("temporal")) {
    return store.temporal.getState() as T;
  }

  // 如果选择器返回的是函数，直接返回，不需要订阅状态变化
  const result = selector(store.getState());
  if (typeof result === "function") {
    return result;
  }

  // 使用useRef来缓存选择器，避免不必要的重新订阅
  const selectorRef = React.useRef(selector);
  const stateRef = React.useRef<T>(result);

  // 只有当选择器真正改变时才更新引用
  if (selectorRef.current !== selector) {
    selectorRef.current = selector;
    stateRef.current = result;
  }

  const [state, setState] = React.useState(() => stateRef.current);

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newState = selectorRef.current(store.getState());
      // 只有当状态真正改变时才更新
      if (newState !== stateRef.current) {
        stateRef.current = newState;
        setState(newState);
      }
    });
    return unsubscribe;
  }, [store]);

  return state;
}

// 专门用于访问temporal方法的hook
export function useTemporal() {
  const store = React.useContext(ContentsStoreContext);
  if (!store)
    throw new Error(
      "useTemporal must be used within PageStoreContext.Provider",
    );

  return store.temporal;
}
