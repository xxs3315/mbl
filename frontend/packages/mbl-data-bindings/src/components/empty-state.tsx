import React from "react";
import { Alert } from "@mantine/core";
import { AlertCircle } from "lucide-react";

export const EmptyState: React.FC = () => {
  return (
    <Alert
      icon={<AlertCircle size={12} />}
      title="暂无配置"
      color="blue"
      variant="light"
      styles={{
        root: { padding: "8px" },
        title: { fontSize: "12px" },
        message: { fontSize: "11px" },
      }}
    >
      点击右上角的"新增配置"按钮来添加数据绑定配置
    </Alert>
  );
};
