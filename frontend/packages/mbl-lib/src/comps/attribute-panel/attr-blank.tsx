import React, { FC, memo } from "react";
import { Stack, Text } from "@mantine/core";

export const AttrBlank: FC = memo(function AttrBlank() {
  return (
    <>
      <Stack align="center">
        <Text size="xs" fw={500} mb={2} mt={4}>
          {"------ n/a ------"}
        </Text>
      </Stack>
    </>
  );
});
