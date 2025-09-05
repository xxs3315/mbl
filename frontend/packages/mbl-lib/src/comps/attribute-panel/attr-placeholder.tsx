import React, { FC, memo } from "react";
import { useContentsStoreContext } from "../../store/store";
import { useCurrentSelectedId } from "../../providers/current-selected-id-provider";
import { useSelectedItem } from "../../hooks/use-selected-item";
import { Divider, Title, NumberInput, Grid, ColorInput } from "@mantine/core";
import { updateSelectedItemProp } from "../../utils/content-updaters";

export const AttrPlaceholder: FC = memo(function AttrPlaceholder() {
  const { currentSelectedId } = useCurrentSelectedId();
  const { item: currentSelectedItem, position: currentSelectedItemPosition } =
    useSelectedItem();

  const state = useContentsStoreContext((s) => s);
  const currentPageIndex = state.currentPageIndex;
  const defaultPageRootBackgroundColor =
    state.pages[currentPageIndex].defaultPageRootBackgroundColor;
  const setCurrentPageAndContent = state.setCurrentPageAndContent;

  return (
    <>
      <Title order={4}>占位属性</Title>
      <Divider my="xs" />

      <Grid gutter="xs" mt="xs">
        <Grid.Col span={6}>
          <NumberInput
            min={0}
            label="宽度"
            size="xs"
            value={currentSelectedItem?.width ?? 0}
            onChange={(value) => {
              if (!currentSelectedId || !currentSelectedItemPosition) return;
              const num =
                typeof value === "number" ? value : Number(value) || 0;
              updateSelectedItemProp(
                {
                  currentSelectedId,
                  currentPageIndex,
                  position: currentSelectedItemPosition,
                  state,
                  setCurrentPageAndContent,
                },
                "width",
                num,
              );
            }}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            min={0}
            label="高度"
            size="xs"
            value={currentSelectedItem?.height ?? 0}
            onChange={(value) => {
              if (!currentSelectedId || !currentSelectedItemPosition) return;
              const num =
                typeof value === "number" ? value : Number(value) || 0;
              updateSelectedItemProp(
                {
                  currentSelectedId,
                  currentPageIndex,
                  position: currentSelectedItemPosition,
                  state,
                  setCurrentPageAndContent,
                },
                "height",
                num,
              );
            }}
          />
        </Grid.Col>
      </Grid>

      <Grid gutter="xs" mt="xs">
        <Grid.Col span={6}>
          <NumberInput
            min={0}
            label="左内边距"
            size="xs"
            value={currentSelectedItem?.pLeft ?? 0}
            onChange={(value) => {
              if (!currentSelectedId || !currentSelectedItemPosition) return;
              const num =
                typeof value === "number" ? value : Number(value) || 0;
              updateSelectedItemProp(
                {
                  currentSelectedId,
                  currentPageIndex,
                  position: currentSelectedItemPosition,
                  state,
                  setCurrentPageAndContent,
                },
                "pLeft",
                num,
              );
            }}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            min={0}
            label="右内边距"
            size="xs"
            value={currentSelectedItem?.pRight ?? 0}
            onChange={(value) => {
              if (!currentSelectedId || !currentSelectedItemPosition) return;
              const num =
                typeof value === "number" ? value : Number(value) || 0;
              updateSelectedItemProp(
                {
                  currentSelectedId,
                  currentPageIndex,
                  position: currentSelectedItemPosition,
                  state,
                  setCurrentPageAndContent,
                },
                "pRight",
                num,
              );
            }}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            min={0}
            label="上内边距"
            size="xs"
            value={currentSelectedItem?.pTop ?? 0}
            onChange={(value) => {
              if (!currentSelectedId || !currentSelectedItemPosition) return;
              const num =
                typeof value === "number" ? value : Number(value) || 0;
              updateSelectedItemProp(
                {
                  currentSelectedId,
                  currentPageIndex,
                  position: currentSelectedItemPosition,
                  state,
                  setCurrentPageAndContent,
                },
                "pTop",
                num,
              );
            }}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            min={0}
            label="下内边距"
            size="xs"
            value={currentSelectedItem?.pBottom ?? 0}
            onChange={(value) => {
              if (!currentSelectedId || !currentSelectedItemPosition) return;
              const num =
                typeof value === "number" ? value : Number(value) || 0;
              updateSelectedItemProp(
                {
                  currentSelectedId,
                  currentPageIndex,
                  position: currentSelectedItemPosition,
                  state,
                  setCurrentPageAndContent,
                },
                "pBottom",
                num,
              );
            }}
          />
        </Grid.Col>
      </Grid>

      <ColorInput
        label="背景颜色"
        mt="xs"
        size="xs"
        format="hex"
        disallowInput
        swatches={[
          "#00000000",
          "#868e96",
          "#fa5252",
          "#e64980",
          "#be4bdb",
          "#4c6ef5",
          "#228be6",
          "#15aabf",
          "#12b886",
          "#40c057",
          "#82c91e",
          "#fab005",
          "#fd7e14",
          "#ffffff",
        ]}
        value={
          currentSelectedItem?.background || defaultPageRootBackgroundColor
        }
        onChange={(value) => {
          if (!currentSelectedId || !currentSelectedItemPosition) return;
          updateSelectedItemProp(
            {
              currentSelectedId,
              currentPageIndex,
              position: currentSelectedItemPosition,
              state,
              setCurrentPageAndContent,
            },
            "background",
            value,
          );
        }}
      />
    </>
  );
});
