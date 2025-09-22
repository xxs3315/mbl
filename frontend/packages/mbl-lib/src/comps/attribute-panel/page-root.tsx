import React from "react";
import { FC, memo } from "react";
import { Divider, Select, Title } from "@mantine/core";
import { useContentsStoreContext } from "../../store/store";
import type { PageRectangle, PageOrientation } from "@xxs3315/mbl-typings";
import { DebouncedTextarea } from "../../utils/debounced-textarea";
import { useI18n } from "@xxs3315/mbl-providers";

export const PageRoot: FC = memo(function PageRoot() {
  const { t } = useI18n();
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
      <Title order={4}>
        {t("attributePanel.mblLib.attributePanel.pageRoot.title")}
      </Title>
      <Divider my="xs" />
      <DebouncedTextarea
        size="xs"
        radius="xs"
        label={t("attributePanel.mblLib.attributePanel.pageRoot.pageName")}
        placeholder={t(
          "attributePanel.mblLib.attributePanel.pageRoot.pageNamePlaceholder",
        )}
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
        label={t("attributePanel.mblLib.attributePanel.pageRoot.pageType")}
        placeholder={t(
          "attributePanel.mblLib.attributePanel.pageRoot.pageTypePlaceholder",
        )}
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
        label={t(
          "attributePanel.mblLib.attributePanel.pageRoot.pageOrientation",
        )}
        placeholder={t(
          "attributePanel.mblLib.attributePanel.pageRoot.pageOrientationPlaceholder",
        )}
        allowDeselect={false}
        data={[
          {
            value: "portrait",
            label: t("attributePanel.mblLib.common.portrait"),
          },
          {
            value: "landscape",
            label: t("attributePanel.mblLib.common.landscape"),
          },
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
