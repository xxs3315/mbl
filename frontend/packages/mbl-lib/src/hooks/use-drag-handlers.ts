import React from "react";
import { DragEndMeta } from "@xxs3315/mbl-core";
import { cloneDeep } from "lodash-es";
import arrayMove from "array-move";
import { nanoid } from "nanoid";
import { PageItem } from "@xxs3315/mbl-typings";
import {
  PAGE_BODY_ROOT_ID,
  PAGE_FOOTER_ROOT_ID,
  PAGE_HEADER_ROOT_ID,
} from "../constants";

export function useDragHandlers(
  currentPageHeaderContent: Map<string, any>,
  currentPageBodyContent: Map<string, any>,
  currentPageFooterContent: Map<string, any>,
  currentPage: any,
  currentPageIndex: number,
  setCurrentPageAndContent: (
    pageIndex: number,
    content: Map<string, PageItem>,
    position: "header" | "body" | "footer",
  ) => void,
  setCurrentSelectedId: (id: string) => void,
  plugins?: Array<{ metadata: any; plugin: any }>,
  enablePluginSystem?: boolean,
) {
  const findItemsRecursive = React.useCallback(
    (id: string, position: string) => {
      let childIds: string[] = [];
      const newMap = cloneDeep(
        new Map(
          position === "header"
            ? currentPageHeaderContent.entries()
            : position === "footer"
              ? currentPageFooterContent.entries()
              : currentPageBodyContent.entries(),
        ),
      );
      const item = newMap.get(id);
      if (item && item.children) {
        item.children.map((childId: string) => {
          childIds.push(childId);
          childIds = childIds.concat(findItemsRecursive(childId, position));
        });
      }
      return childIds;
    },
    [
      currentPageHeaderContent,
      currentPageBodyContent,
      currentPageFooterContent,
    ],
  );

  // 定义工具函数
  const copyItem = React.useCallback(
    (id: string, type: string) => {
      // console.log("copy item", id);
      const newMap = cloneDeep(
        new Map(
          type === "header"
            ? currentPageHeaderContent.entries()
            : type === "footer"
              ? currentPageFooterContent.entries()
              : currentPageBodyContent.entries(),
        ),
      );
      const item = newMap.get(id);
      if (item === undefined) return;
      let childIds = [id];
      childIds = childIds.concat(findItemsRecursive(id, type));

      // 复制左右的childIds
      const copyTargetIds: Record<string, string> = {};
      childIds.map((cid) => {
        copyTargetIds[cid] = nanoid(12);
      });
      //寻找所有的childIds对应的Item，将其中的id children替换成新的id
      const copyTargets: PageItem[] = [];
      childIds.map((cid) => {
        const t = cloneDeep(newMap.get(cid));
        if (t) {
          t.id = copyTargetIds[cid];
          const newChildren: string[] = [];
          t.children?.map((ccid: any) => {
            newChildren.push(copyTargetIds[ccid]);
          });
          t.children = newChildren;
          copyTargets.push(t);
        }
      });

      // 全局查找id在何处，并在其后追加对应的新id
      newMap.forEach((mapItem: any) => {
        if (mapItem.children && mapItem.children.indexOf(id) >= 0) {
          mapItem.children.splice(
            mapItem.children.indexOf(id),
            0,
            copyTargetIds[id],
          );
        }
      });

      // 将复制的新items加入到map中
      copyTargets.forEach((target) => {
        newMap.set(target.id, target);
      });

      // 同步到 store
      if (currentPage && setCurrentPageAndContent) {
        setCurrentPageAndContent(currentPageIndex, newMap, type as any);
      }
    },
    [
      currentPageHeaderContent,
      currentPageBodyContent,
      currentPageFooterContent,
      findItemsRecursive,
      currentPage,
      currentPageIndex,
      setCurrentPageAndContent,
    ],
  );

  const deleteItem = React.useCallback(
    (id: string, type: string) => {
      const newMap = cloneDeep(
        new Map(
          type === "header"
            ? currentPageHeaderContent.entries()
            : type === "footer"
              ? currentPageFooterContent.entries()
              : currentPageBodyContent.entries(),
        ),
      );
      const item = newMap.get(id);
      if (item === undefined) return;
      let childIds = [id];
      childIds = childIds.concat(findItemsRecursive(id, type));

      // 全局查找id在何处，并删除
      newMap.forEach((mapItem: any) => {
        if (mapItem.children && mapItem.children.indexOf(id) >= 0) {
          mapItem.children.splice(mapItem.children.indexOf(id), 1);
        }
      });

      // 从map中删除
      childIds.forEach((target) => {
        newMap.delete(target);
      });

      // 同步到 store
      if (currentPage && setCurrentPageAndContent) {
        setCurrentPageAndContent(
          currentPageIndex,
          newMap as Map<string, PageItem>,
          type as any,
        );
      }
    },
    [
      currentPageHeaderContent,
      currentPageBodyContent,
      currentPageFooterContent,
      findItemsRecursive,
      currentPage,
      currentPageIndex,
      setCurrentPageAndContent,
    ],
  );

  const onDragEnd = React.useCallback(
    (
      meta: DragEndMeta<string>,
      position: "header" | "body" | "footer" = "body",
    ) => {
      if (
        meta.groupIdentifier === meta.nextGroupIdentifier &&
        meta.index === meta.nextIndex
      )
        return;

      let contentMap;
      let rootId;

      switch (position) {
        case "header":
          contentMap = currentPageHeaderContent;
          rootId = PAGE_HEADER_ROOT_ID;
          break;
        case "footer":
          contentMap = currentPageFooterContent;
          rootId = PAGE_FOOTER_ROOT_ID;
          break;
        case "body":
        default:
          contentMap = currentPageBodyContent;
          rootId = PAGE_BODY_ROOT_ID;
          break;
      }

      const newMap = cloneDeep(new Map(contentMap.entries()));
      const item = newMap.get(meta.identifier);
      if (item === undefined) return;
      const groupItem = newMap.get(meta.groupIdentifier ?? rootId);
      if (groupItem === undefined) return;
      if (groupItem.children === undefined) return;

      if (meta.groupIdentifier === meta.nextGroupIdentifier) {
        const nextIndex = meta.nextIndex ?? groupItem.children?.length ?? 0;
        (groupItem as any).children = arrayMove(
          groupItem.children,
          meta.index,
          nextIndex,
        );
      } else {
        if ((item as any).cat === "page-break") return; // 禁止在组间移动分页符
        const nextGroupItem = newMap.get(meta.nextGroupIdentifier ?? rootId);
        if (nextGroupItem === undefined) return;
        if (nextGroupItem.children === undefined) return;

        (groupItem as any).children.splice(meta.index, 1);
        if (meta.nextIndex === undefined) {
          // Inserts an item to a group which has no items.
          (nextGroupItem as any).children.push(meta.identifier);
        } else {
          // Insets an item to a group.
          (nextGroupItem as any).children.splice(
            meta.nextIndex,
            0,
            (item as any).id,
          );
        }
      }

      // store 变化
      if (currentPage && setCurrentPageAndContent) {
        setCurrentPageAndContent(
          currentPageIndex,
          newMap as Map<string, any>,
          position,
        );

        // 注意：拖拽后路径缓存会自动失效，因为缓存键包含了内容结构信息
        // 当内容结构变化时，新的缓存键会生成，确保 popover 显示正确的层级关系
      }
    },
    [
      PAGE_HEADER_ROOT_ID,
      PAGE_BODY_ROOT_ID,
      PAGE_FOOTER_ROOT_ID,
      currentPageHeaderContent,
      currentPageBodyContent,
      currentPageFooterContent,
      currentPage,
      currentPageIndex,
      setCurrentPageAndContent,
    ],
  );

  const onDndDropEnd = React.useCallback(
    (dropItem: any, position: "header" | "footer" | "body", id: string) => {
      let contentMap;
      switch (position) {
        case "header":
          contentMap = currentPageHeaderContent;
          break;
        case "footer":
          contentMap = currentPageFooterContent;
          break;
        case "body":
        default:
          contentMap = currentPageBodyContent;
          break;
      }

      // 找到对应的target
      const newMap = cloneDeep(new Map(contentMap.entries()));
      const target = newMap.get(id);
      if (target === undefined) return;

      const newId = nanoid(12);
      if (target.direction) {
        // 目标是group，则添加进children
        if (target.children) {
          const arr = target.children.concat();
          arr.push(newId);
          target.children = arr;
        } else {
          target.children = [newId];
        }
        const v: any = {
          id: newId,
          title: `${dropItem.cat}-${newId}`,
          children: undefined,
          cat: dropItem.cat,
        };
        if (dropItem.cat === "container") {
          // 若drag的是container
          v["direction"] = dropItem.attrs.direction;
          v["children"] = [];
          v["wildStar"] = dropItem.attrs.wildStar;
          v["canShrink"] = dropItem.attrs.canShrink;
          v["canGrow"] = dropItem.attrs.canGrow;
          v["flexValue"] = dropItem.attrs.flexValue;
          v["flexUnit"] = dropItem.attrs.flexUnit;
          v["horizontal"] = dropItem.attrs.horizontal;
          v["vertical"] = dropItem.attrs.vertical;
        }
        if (dropItem.cat === "placeholder") {
          // 若drag的是text
          v["width"] = dropItem.attrs.width;
          v["height"] = dropItem.attrs.height;
          v["horizontal"] = dropItem.attrs.horizontal;
          v["vertical"] = dropItem.attrs.vertical;
          v["wildStar"] = dropItem.attrs.wildStar;
          v["canShrink"] = dropItem.attrs.canShrink;
          v["canGrow"] = dropItem.attrs.canGrow;
          v["flexValue"] = dropItem.attrs.flexValue;
          v["flexUnit"] = dropItem.attrs.flexUnit;
          v["background"] = dropItem.attrs.background;
        }
        if (dropItem.cat === "text") {
          // 若drag的是text
          v["value"] = dropItem.attrs.value ?? "";
          v["width"] = dropItem.attrs.width;
          v["height"] = dropItem.attrs.height;
          v["horizontal"] = dropItem.attrs.horizontal;
          v["vertical"] = dropItem.attrs.vertical;
          v["font"] = dropItem.attrs.font;
          v["fontSize"] = dropItem.attrs.fontSize;
          v["fontColor"] = dropItem.attrs.fontColor;
          v["wildStar"] = dropItem.attrs.wildStar;
          v["canShrink"] = dropItem.attrs.canShrink;
          v["canGrow"] = dropItem.attrs.canGrow;
          v["flexValue"] = dropItem.attrs.flexValue;
          v["flexUnit"] = dropItem.attrs.flexUnit;
          v["pLeft"] = dropItem.attrs.pLeft;
          v["pRight"] = dropItem.attrs.pRight;
          v["pTop"] = dropItem.attrs.pTop;
          v["pBottom"] = dropItem.attrs.pBottom;
        }
        if (dropItem.cat === "image") {
          // 若drag的是image
          v["value"] = dropItem.attrs.value;
          v["width"] = dropItem.attrs.width;
          v["height"] = dropItem.attrs.height;
          v["horizontal"] = dropItem.attrs.horizontal;
          v["vertical"] = dropItem.attrs.vertical;
          v["wildStar"] = dropItem.attrs.wildStar;
          v["canShrink"] = dropItem.attrs.canShrink;
          v["canGrow"] = dropItem.attrs.canGrow;
          v["flexValue"] = dropItem.attrs.flexValue;
          v["flexUnit"] = dropItem.attrs.flexUnit;
        }
        if (dropItem.cat === "table") {
          // 若drag的是table
          v["value"] = dropItem.attrs.value;
          v["columns"] = dropItem.attrs.columns;
          v["bindings"] = dropItem.attrs.bindings;
          v["horizontal"] = dropItem.attrs.horizontal;
          v["vertical"] = dropItem.attrs.vertical;
          v["vertical"] = dropItem.attrs.vertical;
          v["wildStar"] = dropItem.attrs.wildStar;
          v["canShrink"] = dropItem.attrs.canShrink;
          v["canGrow"] = dropItem.attrs.canGrow;
          v["flexValue"] = dropItem.attrs.flexValue;
          v["flexUnit"] = dropItem.attrs.flexUnit;
        }
        if (dropItem.cat === "page-number") {
          // 若drag的是text
          v["value"] = dropItem.attrs.value;
          v["width"] = dropItem.attrs.width;
          v["height"] = dropItem.attrs.height;
          v["horizontal"] = dropItem.attrs.horizontal;
          v["vertical"] = dropItem.attrs.vertical;
          v["font"] = dropItem.attrs.font;
          v["fontSize"] = dropItem.attrs.fontSize;
          v["fontColor"] = dropItem.attrs.fontColor;
          v["wildStar"] = dropItem.attrs.wildStar;
          v["canShrink"] = dropItem.attrs.canShrink;
          v["canGrow"] = dropItem.attrs.canGrow;
          v["flexValue"] = dropItem.attrs.flexValue;
          v["flexUnit"] = dropItem.attrs.flexUnit;
          v["pLeft"] = dropItem.attrs.pLeft;
          v["pRight"] = dropItem.attrs.pRight;
          v["pTop"] = dropItem.attrs.pTop;
          v["pBottom"] = dropItem.attrs.pBottom;
        }

        // 处理插件项目
        if (dropItem.attrs?.pluginId && enablePluginSystem && plugins) {
          // console.log(
          //   "[Plugin] Processing plugin drop:",
          //   dropItem.attrs.pluginId,
          // );

          // 查找对应的插件
          const pluginWrapper = plugins.find(
            (p) => p.metadata.id === dropItem.attrs.pluginId,
          );
          if (pluginWrapper) {
            const plugin = pluginWrapper.plugin;

            // 调用插件的processDragData方法
            if (plugin.processDragData) {
              const processedData = plugin.processDragData(dropItem);
              // console.log("[Plugin] Processed drag data:", processedData);

              // 将处理后的数据合并到v对象中
              Object.assign(v, processedData.attrs);
              v["pluginId"] = dropItem.attrs.pluginId;
            } else {
              // 如果没有processDragData方法，直接使用默认配置
              Object.assign(v, dropItem.attrs);
              v["pluginId"] = dropItem.attrs.pluginId;
            }
          }
        }

        // console.log("new item", newId, v);
        newMap.set(newId, v);
      } else {
        // 是item, 则视drag的元素改变配置 TODO
        // console.log("drop to element: ", id);
      }

      // store 变化
      if (currentPage && setCurrentPageAndContent) {
        setCurrentPageAndContent(
          currentPageIndex,
          newMap as Map<string, any>,
          position,
        );
        setCurrentSelectedId(newId);
      }
    },
    [
      currentPageHeaderContent,
      currentPageBodyContent,
      currentPageFooterContent,
      currentPage,
      currentPageIndex,
      setCurrentPageAndContent,
      setCurrentSelectedId,
    ],
  );

  return {
    copyItem,
    deleteItem,
    onDragEnd,
    onDndDropEnd,
  };
}
