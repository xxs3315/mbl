import { FC, memo } from "react";
import { useContentsStoreContext } from "../../store/store";
import { Divider, NumberInput, Title, Grid } from "@mantine/core";
import React from "react";
import { useI18n } from "@xxs3315/mbl-providers";

export const PageBodyRoot: FC = memo(function PageBodyRoot() {
  const { t } = useI18n();
  // 使用细粒度订阅，只订阅需要的状态
  const currentPageIndex = useContentsStoreContext((s) => s.currentPageIndex);
  const pages = useContentsStoreContext((s) => s.pages);
  const updatePageBodyMargin = useContentsStoreContext(
    (s) => s.updatePageBodyMargin,
  );

  const currentPage = pages[currentPageIndex];
  const currentPageBodyMTop = currentPage?.mTopBody;
  const currentPageBodyMRight = currentPage?.mRightBody;
  const currentPageBodyMBottom = currentPage?.mBottomBody;
  const currentPageBodyMLeft = currentPage?.mLeftBody;

  return (
    <>
      <Title order={4}>{t("pageBody.title", { ns: "attributePanel" })}</Title>
      <Divider my="xs" />

      <Grid gutter="xs" mt="xs">
        <Grid.Col span={6}>
          <NumberInput
            label={t("pageBody.leftMargin", {
              ns: "attributePanel",
            })}
            size="xs"
            value={currentPageBodyMLeft}
            onChange={(value) => {
              if (value !== null) {
                updatePageBodyMargin(
                  currentPageIndex,
                  "mLeftBody",
                  Number(value),
                );
              }
            }}
            min={0}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label={t("pageBody.rightMargin", {
              ns: "attributePanel",
            })}
            size="xs"
            value={currentPageBodyMRight}
            onChange={(value) => {
              if (value !== null) {
                updatePageBodyMargin(
                  currentPageIndex,
                  "mRightBody",
                  Number(value),
                );
              }
            }}
            min={0}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label={t("pageBody.topMargin", {
              ns: "attributePanel",
            })}
            size="xs"
            value={currentPageBodyMTop}
            onChange={(value) => {
              if (value !== null) {
                updatePageBodyMargin(
                  currentPageIndex,
                  "mTopBody",
                  Number(value),
                );
              }
            }}
            min={0}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label={t("pageBody.bottomMargin", {
              ns: "attributePanel",
            })}
            size="xs"
            value={currentPageBodyMBottom}
            onChange={(value) => {
              if (value !== null) {
                updatePageBodyMargin(
                  currentPageIndex,
                  "mBottomBody",
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
