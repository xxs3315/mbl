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
      title={t("attributePanel.dataBinding.deleteModal.title")}
      centered
      size="sm"
    >
      <Stack gap="xs">
        <Text size="sm">
          {t("attributePanel.dataBinding.deleteModal.message")}
        </Text>
        <Text size="xs" c="dimmed">
          {t("attributePanel.dataBinding.deleteModal.warning")}
        </Text>
        <Group justify="flex-end" gap="xs">
          <Button size="xs" variant="light" onClick={onClose}>
            {t("attributePanel.dataBinding.deleteModal.cancel")}
          </Button>
          <Button size="xs" color="red" onClick={onConfirm}>
            {t("attributePanel.dataBinding.deleteModal.confirmDelete")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
