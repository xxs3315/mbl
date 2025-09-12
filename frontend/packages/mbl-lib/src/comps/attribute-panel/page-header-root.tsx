import React from "react";
import { FC, memo } from "react";
import { Divider, NumberInput, Title, Grid } from "@mantine/core";
import { useContentsStoreContext } from "../../store/store";

export const PageHeaderRoot: FC = memo(function PageHeaderRoot() {
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
      <Title order={4}>页面页眉设置</Title>
      <Divider my="xs" />
      <Grid gutter="xs" mt="xs">
        <Grid.Col span={6}>
          <NumberInput
            label="页面页眉左边距"
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
            label="页面页眉右边距"
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
            label="页面页眉上边距"
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
            label="页面页眉下边距"
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
