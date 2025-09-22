import React, { FC, memo } from "react";
import { Stack, Text } from "@mantine/core";
import { useI18n } from "@xxs3315/mbl-providers";

export const AttrBlank: FC = memo(function AttrBlank() {
  const { t } = useI18n();

  return (
    <>
      <Stack align="center">
        <Text size="xs" fw={500} mb={2} mt={4}>
          {t("attributePanel.mblLib.common.notAvailable")}
        </Text>
      </Stack>
    </>
  );
});
