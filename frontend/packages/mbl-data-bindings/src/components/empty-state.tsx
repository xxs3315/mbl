import React from "react";
import { Alert } from "@mantine/core";
import { AlertCircle } from "lucide-react";
import { useI18n } from "@xxs3315/mbl-providers";

export const EmptyState: React.FC = () => {
  const { t } = useI18n();

  return (
    <Alert
      icon={<AlertCircle size={12} />}
      title={t("emptyState.title", { ns: "dataBinding" })}
      variant="light"
      styles={{
        root: { padding: "8px" },
        title: { fontSize: "12px" },
        message: { fontSize: "12px" },
        icon: { alignItems: "flex-start" },
      }}
    >
      {t("emptyState.message", { ns: "dataBinding" })}
    </Alert>
  );
};
