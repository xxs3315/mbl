import React from "react";
import { Modal, Stack, Text, Group, Button } from "@mantine/core";
import { useI18n } from "@xxs3315/mbl-providers";

interface DeleteModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  opened,
  onClose,
  onConfirm,
}) => {
  const { t } = useI18n();
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("deleteModal.title", { ns: "dataBinding" })}
      centered
      size="sm"
    >
      <Stack gap="xs">
        <Text size="sm">{t("deleteModal.message", { ns: "dataBinding" })}</Text>
        <Text size="xs" c="dimmed">
          {t("deleteModal.warning", { ns: "dataBinding" })}
        </Text>
        <Group justify="flex-end" gap="xs">
          <Button size="xs" variant="light" onClick={onClose}>
            {t("deleteModal.cancel", { ns: "dataBinding" })}
          </Button>
          <Button size="xs" color="red" onClick={onConfirm}>
            {t("deleteModal.confirmDelete", { ns: "dataBinding" })}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
