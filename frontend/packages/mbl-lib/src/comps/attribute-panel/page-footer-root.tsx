import React from "react";
import { FC, memo } from "react";
import { Divider, NumberInput, Title, Grid } from "@mantine/core";
import { useContentsStoreContext } from "../../store/store";

export const PageFooterRoot: FC = memo(function PageFooterRoot() {
  const state = useContentsStoreContext((s) => s);
  const currentPageIndex = state.currentPageIndex;
  const currentPage = state.pages[currentPageIndex];

  const currentPageFooterMLeft = currentPage?.mLeftFooter;
  const currentPageFooterMRight = currentPage?.mRightFooter;
  const currentPageFooterMTop = currentPage?.mTopFooter;
  const currentPageFooterMBottom = currentPage?.mBottomFooter;

  const updatePageFooterMargin = state.updatePageFooterMargin;

  return (
    <>
      <Title order={4}>页面页脚设置</Title>
      <Divider my="xs" />
      <Grid gutter="xs" mt="xs">
        <Grid.Col span={6}>
          <NumberInput
            label="页面页脚左边距"
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
            label="页面页脚右边距"
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
            label="页面页脚上边距"
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
            label="页面页脚下边距"
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
