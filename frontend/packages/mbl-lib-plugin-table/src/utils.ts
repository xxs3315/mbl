import { pt2px } from "@xxs3315/mbl-utils";

// 工具函数：将 columns 数组转换为 Map
export const columnsToMap = (columns: any[]) => {
  return new Map(columns);
};

// 获取 flex 样式
export const getFlexStyle = (item: any) => {
  const flexValue = item.wildStar
    ? "1"
    : `${item.canGrow ? "1" : "0"} ${item.canShrink ? "1" : "0"} ${item.flexUnit === "%" ? item.flexValue : item.flexValue}${item.flexUnit}`;
  return { flex: flexValue };
};

// 获取垂直对齐样式
export const getVerticalStyle = (vertical?: string) => {
  if (vertical === "top")
    return {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginTop: 0,
    };
  if (vertical === "bottom")
    return {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-end",
      marginTop: 0,
    };
  return {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 0,
  };
};

// 生成随机ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * 重新生成表格内部所有ID的映射关系
 *
 * 功能说明：
 * 1. 为每个table实例生成唯一的内部ID，避免多个table实例之间的ID冲突
 * 2. 保留关键的根节点ID（table-root, table-root-column-binding）以维持表格结构
 * 3. 保持columns和bindingColumns之间的ID对应关系
 * 4. 更新所有children引用以指向新的ID
 *
 * @param columns - 表格列数据数组，格式：[id, data][]
 * @param bindingColumns - 表格绑定列数据数组，格式：[id, data][]
 * @returns 包含重新生成ID后的columns、bindingColumns和ID映射表
 */
export const regenerateTableIds = (columns: any[], bindingColumns: any[]) => {
  console.log("[Table ID Regeneration] 开始重新生成表格ID...");
  console.log("[Table ID Regeneration] 原始columns数量:", columns.length);
  console.log(
    "[Table ID Regeneration] 原始bindingColumns数量:",
    bindingColumns.length,
  );

  // 创建ID映射表：旧ID -> 新ID
  const idMapping = new Map<string, string>();

  // 第一步：为所有columns生成新ID，但保留特殊的根节点ID
  const newColumns = columns.map(([oldId, data]) => {
    // 保留特殊的根节点ID，这是表格结构的入口点
    if (oldId === "table-root") {
      console.log("[Table ID Regeneration] 保留根节点ID:", oldId);
      idMapping.set(oldId, oldId);
      return [oldId, { ...data, id: oldId }];
    }

    // 为其他节点生成新的唯一ID
    const newId = generateId();
    console.log(`[Table ID Regeneration] 重新生成ID: ${oldId} -> ${newId}`);
    idMapping.set(oldId, newId);
    return [newId, { ...data, id: newId }];
  });

  // 第二步：更新columns中的children引用，确保所有子节点引用都指向新的ID
  const newColumnsWithUpdatedChildren = newColumns.map(([id, data]) => {
    if (data.children && Array.isArray(data.children)) {
      const newChildren = data.children.map((childId: string) => {
        const newChildId = idMapping.get(childId) || childId;
        if (newChildId !== childId) {
          console.log(
            `[Table ID Regeneration] 更新children引用: ${childId} -> ${newChildId}`,
          );
        }
        return newChildId;
      });
      return [id, { ...data, children: newChildren }];
    }
    return [id, data];
  });

  // 第三步：为bindingColumns生成新ID，保持与columns的对应关系
  const newBindingColumns = bindingColumns.map(([oldId, data]) => {
    // 保留特殊的根节点ID
    if (oldId === "table-root-column-binding") {
      console.log("[Table ID Regeneration] 保留绑定根节点ID:", oldId);
      idMapping.set(oldId, oldId);
      return [oldId, { ...data, id: oldId }];
    }

    // 检查是否是column-binding类型的ID
    if (oldId.endsWith("-column-binding")) {
      // 提取对应的column ID（去掉'-column-binding'后缀）
      const originalColumnId = oldId.replace("-column-binding", "");
      const newColumnId = idMapping.get(originalColumnId);

      if (newColumnId) {
        // 使用新的column ID + '-column-binding'后缀，保持对应关系
        const newBindingId = `${newColumnId}-column-binding`;
        console.log(
          `[Table ID Regeneration] 保持绑定对应关系: ${oldId} -> ${newBindingId}`,
        );
        idMapping.set(oldId, newBindingId);
        return [newBindingId, { ...data, id: newBindingId }];
      }
    }

    // 如果不是column-binding类型，或者找不到对应的column ID，则生成新的ID
    const newId = generateId();
    console.log(`[Table ID Regeneration] 重新生成绑定ID: ${oldId} -> ${newId}`);
    idMapping.set(oldId, newId);
    return [newId, { ...data, id: newId }];
  });

  // 第四步：更新bindingColumns中的children引用
  const newBindingColumnsWithUpdatedChildren = newBindingColumns.map(
    ([id, data]) => {
      if (data.children && Array.isArray(data.children)) {
        const newChildren = data.children.map((childId: string) => {
          const newChildId = idMapping.get(childId) || childId;
          if (newChildId !== childId) {
            console.log(
              `[Table ID Regeneration] 更新绑定children引用: ${childId} -> ${newChildId}`,
            );
          }
          return newChildId;
        });
        return [id, { ...data, children: newChildren }];
      }
      return [id, data];
    },
  );

  console.log("[Table ID Regeneration] ID重新生成完成");
  console.log(
    "[Table ID Regeneration] 新columns数量:",
    newColumnsWithUpdatedChildren.length,
  );
  console.log(
    "[Table ID Regeneration] 新bindingColumns数量:",
    newBindingColumnsWithUpdatedChildren.length,
  );
  console.log("[Table ID Regeneration] ID映射表大小:", idMapping.size);

  return {
    columns: newColumnsWithUpdatedChildren,
    bindingColumns: newBindingColumnsWithUpdatedChildren,
    idMapping,
  };
};

// 获取内边距样式
export const getPaddingStyle = (
  pTop: number,
  pRight: number,
  pBottom: number,
  pLeft: number,
  dpi: number,
) => ({
  paddingTop: `${pt2px(pTop ?? 0, dpi)}px`,
  paddingRight: `${pt2px(pRight ?? 0, dpi)}px`,
  paddingBottom: `${pt2px(pBottom ?? 0, dpi)}px`,
  paddingLeft: `${pt2px(pLeft ?? 0, dpi)}px`,
});
