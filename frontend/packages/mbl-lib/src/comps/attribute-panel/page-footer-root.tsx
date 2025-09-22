import React from "react";
import { FC, memo } from "react";
import { Divider, NumberInput, Title, Grid } from "@mantine/core";
import { useContentsStoreContext } from "../../store/store";
import { useI18n } from "@xxs3315/mbl-providers";

export const PageFooterRoot: FC = memo(function PageFooterRoot() {
  const { t } = useI18n();
  // 使用细粒度订阅，只订阅需要的状态
  const currentPageIndex = useContentsStoreContext((s) => s.currentPageIndex);
  const pages = useContentsStoreContext((s) => s.pages);
  const updatePageFooterMargin = useContentsStoreContext(
    (s) => s.updatePageFooterMargin,
  );

  const currentPage = pages[currentPageIndex];
  const currentPageFooterMLeft = currentPage?.mLeftFooter;
  const currentPageFooterMRight = currentPage?.mRightFooter;
  const currentPageFooterMTop = currentPage?.mTopFooter;
  const currentPageFooterMBottom = currentPage?.mBottomFooter;

  return (
    <>
      <Title order={4}>{t("pageFooter.title", { ns: "attributePanel" })}</Title>
      <Divider my="xs" />
      <Grid gutter="xs" mt="xs">
        <Grid.Col span={6}>
          <NumberInput
            label={t("pageFooter.leftMargin", {
              ns: "attributePanel",
            })}
            size="xs"
            value={currentPageFooterMLeft}
            onChange={(value) => {
              if (value !== null) {
                updatePageFooterMargin(
                  currentPageIndex,
                  "mLeftFooter",
                  Number(value),
                );
              }
            }}
            min={0}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label={t("pageFooter.rightMargin", {
              ns: "attributePanel",
            })}
            size="xs"
            value={currentPageFooterMRight}
            onChange={(value) => {
              if (value !== null) {
                updatePageFooterMargin(
                  currentPageIndex,
                  "mRightFooter",
                  Number(value),
                );
              }
            }}
            min={0}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label={t("pageFooter.topMargin", {
              ns: "attributePanel",
            })}
            size="xs"
            value={currentPageFooterMTop}
            onChange={(value) => {
              if (value !== null) {
                updatePageFooterMargin(
                  currentPageIndex,
                  "mTopFooter",
                  Number(value),
                );
              }
            }}
            min={0}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label={t("pageFooter.bottomMargin", {
              ns: "attributePanel",
            })}
            size="xs"
            value={currentPageFooterMBottom}
            onChange={(value) => {
              if (value !== null) {
                updatePageFooterMargin(
                  currentPageIndex,
                  "mBottomFooter",
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
