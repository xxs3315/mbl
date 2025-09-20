// JSON处理工具函数

// 验证JSON格式
export const validateJson = (
  jsonString: string,
): { valid: boolean; error?: string; data?: any } => {
  if (!jsonString.trim()) {
    return { valid: true, data: null };
  }

  try {
    const data = JSON.parse(jsonString);
    return { valid: true, data };
  } catch (error: any) {
    const message = error.message || "JSON格式错误";

    // 提供更友好的错误提示
    if (message.includes("Bad control character")) {
      return {
        valid: false,
        error: "JSON中包含未转义的换行符，请使用 \\n 代替换行",
      };
    } else if (message.includes("Unexpected token")) {
      return { valid: false, error: "JSON语法错误，请检查括号、引号等符号" };
    } else if (message.includes("Unexpected end")) {
      return { valid: false, error: "JSON不完整，请检查是否缺少括号或引号" };
    }

    return { valid: false, error: `JSON格式错误: ${message}` };
  }
};

// 格式化JSON
export const formatJson = (jsonString: string, indent: number = 2): string => {
  const result = validateJson(jsonString);
  if (!result.valid || !result.data) {
    return jsonString;
  }

  try {
    return JSON.stringify(result.data, null, indent);
  } catch {
    return jsonString;
  }
};

// 压缩JSON
export const minifyJson = (jsonString: string): string => {
  const result = validateJson(jsonString);
  if (!result.valid || !result.data) {
    return jsonString;
  }

  try {
    return JSON.stringify(result.data);
  } catch {
    return jsonString;
  }
};

// 获取JSON数据类型
export const getJsonDataType = (data: any): string => {
  if (data === null) return "null";
  if (Array.isArray(data)) return "array";
  return typeof data;
};

// 获取JSON结构信息
export const getJsonStructure = (
  data: any,
): {
  type: string;
  size: number;
  fields?: string[];
  isArray?: boolean;
  arrayLength?: number;
} => {
  const type = getJsonDataType(data);
  const size = JSON.stringify(data).length;

  if (type === "array") {
    return {
      type: "array",
      size,
      isArray: true,
      arrayLength: data.length,
      fields:
        data.length > 0 && typeof data[0] === "object"
          ? Object.keys(data[0])
          : undefined,
    };
  } else if (type === "object") {
    return {
      type: "object",
      size,
      fields: Object.keys(data),
    };
  }

  return { type, size };
};

// 提取JSON字段路径
export const extractJsonPaths = (data: any, prefix: string = ""): string[] => {
  const paths: string[] = [];

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const currentPath = `${prefix}[${index}]`;
      if (typeof item === "object" && item !== null) {
        paths.push(...extractJsonPaths(item, currentPath));
      } else {
        paths.push(currentPath);
      }
    });
  } else if (typeof data === "object" && data !== null) {
    Object.keys(data).forEach((key) => {
      const currentPath = prefix ? `${prefix}.${key}` : key;
      if (typeof data[key] === "object" && data[key] !== null) {
        paths.push(...extractJsonPaths(data[key], currentPath));
      } else {
        paths.push(currentPath);
      }
    });
  } else {
    paths.push(prefix);
  }

  return paths;
};

// 根据路径获取值
export const getValueByPath = (data: any, path: string): any => {
  try {
    return path.split(".").reduce((obj, key) => {
      if (key.includes("[") && key.includes("]")) {
        const arrayKey = key.substring(0, key.indexOf("["));
        const index = parseInt(
          key.substring(key.indexOf("[") + 1, key.indexOf("]")),
        );
        return obj[arrayKey][index];
      }
      return obj[key];
    }, data);
  } catch {
    return undefined;
  }
};

// 验证JSON Schema
export const validateJsonSchema = (
  data: any,
  schema: any,
): { valid: boolean; errors?: string[] } => {
  // 这里可以集成ajv库进行更强大的验证
  // 目前提供基础验证
  try {
    if (schema.type === "object" && typeof data !== "object") {
      return { valid: false, errors: ["Expected object type"] };
    }
    if (schema.type === "array" && !Array.isArray(data)) {
      return { valid: false, errors: ["Expected array type"] };
    }
    return { valid: true };
  } catch {
    return { valid: false, errors: ["Schema validation failed"] };
  }
};
