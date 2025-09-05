import { FC, memo } from "react";
import { useContentsStoreContext } from "../../store/store";
import { useCurrentSelectedId } from "../../providers/current-selected-id-provider";
import { useSelectedItem } from "../../hooks/use-selected-item";
import {
  Checkbox,
  ColorInput,
  Divider,
  NumberInput,
  Title,
  Grid,
  Text,
  Stack,
  SegmentedControl,
  VisuallyHidden,
} from "@mantine/core";
import React from "react";
import { updateSelectedItemProp } from "../../utils/content-updaters";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

export const AttrText: FC = memo(function AttrText() {
  const { currentSelectedId, setCurrentSelectedId } = useCurrentSelectedId();
  const { item: currentSelectedItem, position: currentSelectedItemPosition } =
    useSelectedItem();

  const state = useContentsStoreContext((s) => s);
  const currentPageIndex = state.currentPageIndex;
  const defaultPageRootFontSize =
    state.pages[currentPageIndex].defaultPageRootFontSize;
  const defaultPageRootFontColor =
    state.pages[currentPageIndex].defaultPageRootFontColor;
  const defaultPageRootBackgroundColor =
    state.pages[currentPageIndex].defaultPageRootBackgroundColor;
  const setCurrentPageAndContent = state.setCurrentPageAndContent;

  // 如果当前选中的元素在当前页面中不存在，清除选中状态
  React.useEffect(() => {
    if (currentSelectedId && !currentSelectedItem) {
      setCurrentSelectedId("");
    }
  }, [currentSelectedId, currentSelectedItem, setCurrentSelectedId]);

  return (
    <>
      <Title order={4}>文本属性</Title>
      <Divider my="xs" />

      <Checkbox
        size="xs"
        fw={500}
        label="粗体"
        checked={currentSelectedItem?.bold ?? false}
        onChange={(event) => {
          if (!currentSelectedId || !currentSelectedItemPosition) return;
          updateSelectedItemProp(
            {
              currentSelectedId,
              currentPageIndex,
              position: currentSelectedItemPosition,
              state,
              setCurrentPageAndContent,
            },
            "bold",
            event.currentTarget.checked,
          );
        }}
      />

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

      <NumberInput
        label="字体大小"
        mt="xs"
        size="xs"
        value={currentSelectedItem?.fontSize || defaultPageRootFontSize}
        onChange={(value) => {
          if (!currentSelectedId || !currentSelectedItemPosition) return;
          const num = typeof value === "number" ? value : Number(value) || 0;
          updateSelectedItemProp(
            {
              currentSelectedId,
              currentPageIndex,
              position: currentSelectedItemPosition,
              state,
              setCurrentPageAndContent,
            },
            "fontSize",
            num,
          );
        }}
        min={6}
        max={288}
      />

      <ColorInput
        label="文字颜色"
        mt="xs"
        size="xs"
        format="hex"
        disallowInput
        swatches={[
          "#000000",
          "#868e96",
          "#fa5252",
          "#e64980",
          "#be4bdb",
          "#7950f2",
          "#4c6ef5",
          "#228be6",
          "#15aabf",
          "#12b886",
          "#40c057",
          "#82c91e",
          "#fab005",
          "#fd7e14",
        ]}
        value={currentSelectedItem?.fontColor || defaultPageRootFontColor}
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
            "fontColor",
            value,
          );
        }}
      />

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

      <div>
        <Text size="xs" fw={500} mb={2} mt="xs">
          水平对齐
        </Text>
        <Stack align="center">
          <SegmentedControl
            value={currentSelectedItem?.horizontal || "center"}
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
                "horizontal",
                value,
              );
            }}
            data={[
              {
                value: "left",
                label: (
                  <>
                    <AlignLeft
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <VisuallyHidden>左对齐</VisuallyHidden>
                  </>
                ),
              },
              {
                value: "center",
                label: (
                  <>
                    <AlignCenter
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <VisuallyHidden>居中</VisuallyHidden>
                  </>
                ),
              },
              {
                value: "right",
                label: (
                  <>
                    <AlignRight
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <VisuallyHidden>右对齐</VisuallyHidden>
                  </>
                ),
              },
            ]}
          />
        </Stack>
      </div>
    </>
  );
});
