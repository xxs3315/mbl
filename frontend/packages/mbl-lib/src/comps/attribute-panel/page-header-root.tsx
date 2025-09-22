import React from "react";
import { FC, memo } from "react";
import { Divider, NumberInput, Title, Grid } from "@mantine/core";
import { useContentsStoreContext } from "../../store/store";
import { useI18n } from "@xxs3315/mbl-providers";

export const PageHeaderRoot: FC = memo(function PageHeaderRoot() {
  const { t } = useI18n();
  // 使用细粒度订阅，只订阅需要的状态
  const currentPageIndex = useContentsStoreContext((s) => s.currentPageIndex);
  const pages = useContentsStoreContext((s) => s.pages);
  const updatePageHeaderMargin = useContentsStoreContext(
    (s) => s.updatePageHeaderMargin,
  );

  const currentPage = pages[currentPageIndex];

  const currentPageHeaderMLeft = currentPage?.mLeftHeader;
  const currentPageHeaderMRight = currentPage?.mRightHeader;
  const currentPageHeaderMTop = currentPage?.mTopHeader;
  const currentPageHeaderMBottom = currentPage?.mBottomHeader;

  return (
    <>
      <Title order={4}>{t("pageHeader.title", { ns: "attributePanel" })}</Title>
      <Divider my="xs" />
      <Grid gutter="xs" mt="xs">
        <Grid.Col span={6}>
          <NumberInput
            label={t("pageHeader.leftMargin", {
              ns: "attributePanel",
            })}
            size="xs"
            value={currentPageHeaderMLeft}
            onChange={(value) => {
              if (value !== null) {
                updatePageHeaderMargin(
                  currentPageIndex,
                  "mLeftHeader",
                  Number(value),
                );
              }
            }}
            min={0}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label={t("pageHeader.rightMargin", {
              ns: "attributePanel",
            })}
            size="xs"
            value={currentPageHeaderMRight}
            onChange={(value) => {
              if (value !== null) {
                updatePageHeaderMargin(
                  currentPageIndex,
                  "mRightHeader",
                  Number(value),
                );
              }
            }}
            min={0}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label={t("pageHeader.topMargin", {
              ns: "attributePanel",
            })}
            size="xs"
            value={currentPageHeaderMTop}
            onChange={(value) => {
              if (value !== null) {
                updatePageHeaderMargin(
                  currentPageIndex,
                  "mTopHeader",
                  Number(value),
                );
              }
            }}
            min={0}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label={t("pageHeader.bottomMargin", {
              ns: "attributePanel",
            })}
            size="xs"
            value={currentPageHeaderMBottom}
            onChange={(value) => {
              if (value !== null) {
                updatePageHeaderMargin(
                  currentPageIndex,
                  "mBottomHeader",
                  Number(value),
                );
              }
            }}
            min={0}
          />
        </Grid.Col>
      </Grid>
    </>
  );
});
