import React from "react";
import {
  Hash,
  Type,
  Calendar,
  Mail,
  User,
  FileText,
  Link,
  Image,
  Database,
} from "lucide-react";
import { JsonField, FieldIconInfo } from "./types";

/**
 * 根据字段名和类型获取图标信息
 */
export const getFieldIcon = (name: string, type: string): FieldIconInfo => {
  const lowerName = name.toLowerCase();

  // 根据字段名推断图标
  if (lowerName.includes("id") || lowerName.includes("key")) {
    return { icon: <Hash size={12} />, color: "blue" };
  } else if (lowerName.includes("name") || lowerName.includes("title")) {
    return { icon: <Type size={12} />, color: "green" };
  } else if (lowerName.includes("date") || lowerName.includes("time")) {
    return { icon: <Calendar size={12} />, color: "orange" };
  } else if (lowerName.includes("email") || lowerName.includes("mail")) {
    return { icon: <Mail size={12} />, color: "cyan" };
  } else if (lowerName.includes("user") || lowerName.includes("author")) {
    return { icon: <User size={12} />, color: "purple" };
  } else if (
    lowerName.includes("content") ||
    lowerName.includes("body") ||
    lowerName.includes("description")
  ) {
    return { icon: <FileText size={12} />, color: "teal" };
  } else if (lowerName.includes("url") || lowerName.includes("link")) {
    return { icon: <Link size={12} />, color: "indigo" };
  } else if (
    lowerName.includes("image") ||
    lowerName.includes("photo") ||
    lowerName.includes("avatar")
  ) {
    return { icon: <Image size={12} />, color: "pink" };
  }

  // 根据类型推断图标
  switch (type) {
    case "string":
      return { icon: <Type size={12} />, color: "green" };
    case "number":
    case "integer":
      return { icon: <Hash size={12} />, color: "blue" };
    case "boolean":
      return { icon: <Database size={12} />, color: "gray" };
    case "array":
      return { icon: <Database size={12} />, color: "violet" };
    case "object":
      return { icon: <Database size={12} />, color: "dark" };
    default:
      return { icon: <Type size={12} />, color: "gray" };
  }
};

/**
 * 递归解析对象结构，生成全路径字段
 */
export const extractFieldsRecursively = (
  obj: any,
  prefix: string = "",
): JsonField[] => {
  const fields: JsonField[] = [];

  if (typeof obj !== "object" || obj === null) {
    return fields;
  }

  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    const valueType = Array.isArray(value) ? "array" : typeof value;

    // 如果是对象类型，递归解析其子字段
    if (valueType === "object" && value !== null) {
      const { icon, color } = getFieldIcon(key, valueType);
      fields.push({
        name: fullPath,
        type: valueType,
        icon,
        color,
      });
      fields.push(...extractFieldsRecursively(value, fullPath));
    } else {
      // 只添加非object类型的字段
      if (valueType !== "object") {
        const { icon, color } = getFieldIcon(key, valueType);
        fields.push({
          name: fullPath,
          type: valueType,
          icon,
          color,
        });
      }
    }
  }

  return fields;
};

/**
 * 解析JSON结构，提取可绑定的字段
 */
export const parseJsonStructure = (jsonString: string): JsonField[] => {
  if (!jsonString.trim()) return [];

  try {
    const data = JSON.parse(jsonString);

    // 处理数组情况 - 取第一个元素的结构
    let targetData = data;
    if (Array.isArray(data) && data.length > 0) {
      targetData = data[0];
    }

    // 如果不是对象，返回空数组
    if (typeof targetData !== "object" || targetData === null) {
      return [];
    }

    // 递归提取所有字段
    return extractFieldsRecursively(targetData);
  } catch (error) {
    console.warn("Failed to parse JSON structure:", error);
    return [];
  }
};
