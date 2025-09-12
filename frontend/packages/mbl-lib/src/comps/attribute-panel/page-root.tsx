import React from "react";
import { FC, memo } from "react";
import { Divider, Select, Title } from "@mantine/core";
import { useContentsStoreContext } from "../../store/store";
import type { PageRectangle, PageOrientation } from "@xxs3315/mbl-typings";
import { DebouncedTextarea } from "../../utils/debounced-textarea";

export const PageRoot: FC = memo(function PageRoot() {
  // 使用细粒度订阅，只订阅需要的状态
  const currentPageIndex = useContentsStoreContext((s) => s.currentPageIndex);
  const pages = useContentsStoreContext((s) => s.pages);
  const updatePageName = useContentsStoreContext((s) => s.updatePageName);
  const updatePageRectangle = useContentsStoreContext(
    (s) => s.updatePageRectangle,
  );
  const updatePageOrientation = useContentsStoreContext(
    (s) => s.updatePageOrientation,
  );

  const currentPage = pages[currentPageIndex];
  const currentPageTitle = currentPage?.name;
  const currentPageRectangle = currentPage?.rectangle;
  const currentPageOrientation = currentPage?.orientation;

  return (
    <>
      <Title order={4}>页面根设置</Title>
      <Divider my="xs" />
      <DebouncedTextarea
        size="xs"
        radius="xs"
        label="页面名称"
        placeholder="请输入页面名称"
        autosize
        minRows={2}
        maxRows={6}
        resize="vertical"
        value={currentPageTitle ?? ""}
        onChange={(value) => {
          if (value !== (currentPageTitle || "")) {
            updatePageName(currentPageIndex, value);
          }
        }}
        debounceMs={300}
      />
      <Select
        mt="xs"
        size="xs"
        label="页面类型"
        placeholder="请选择页面类型"
        allowDeselect={false}
        data={[
          { value: "LETTER", label: "LETTER" },
          { value: "TABLOID", label: "TABLOID" },
          { value: "LEGAL", label: "LEGAL" },
          { value: "A0", label: "A0" },
          { value: "A1", label: "A1" },
          { value: "A2", label: "A2" },
          { value: "A3", label: "A3" },
          { value: "A4", label: "A4" },
          { value: "A5", label: "A5" },
          { value: "A6", label: "A6" },
        ]}
        value={currentPageRectangle}
        onChange={(value) => {
          if (value) {
            updatePageRectangle(currentPageIndex, value as PageRectangle);
          }
        }}
      />
      <Select
        mt="xs"
        size="xs"
        label="页面方向"
        placeholder="请选择页面方向"
        allowDeselect={false}
        data={[
          { value: "portrait", label: "纵向" },
          { value: "landscape", label: "横向" },
        ]}
        value={currentPageOrientation}
        onChange={(value) => {
          if (value) {
            updatePageOrientation(currentPageIndex, value as PageOrientation);
          }
        }}
      />
    </>
  );
});
