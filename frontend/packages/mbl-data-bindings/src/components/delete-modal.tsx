import React from "react";
import { Modal, Stack, Text, Group, Button } from "@mantine/core";

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
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="确认删除"
      centered
      size="sm"
      withinPortal={false}
    >
      <Stack gap="xs">
        <Text size="sm">确定要删除这个数据绑定配置吗？</Text>
        <Text size="xs" c="dimmed">
          此操作无法撤销，删除后配置将永久丢失。
        </Text>
        <Group justify="flex-end" gap="xs">
          <Button size="xs" variant="light" onClick={onClose}>
            取消
          </Button>
          <Button size="xs" color="red" onClick={onConfirm}>
            确认删除
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
