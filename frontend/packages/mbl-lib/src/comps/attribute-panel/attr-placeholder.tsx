import React, { FC, memo } from "react";
import { useContentsStoreContext } from "../../store/store";
import { useCurrentSelectedId } from "../../providers/current-selected-id-provider";
import { useSelectedItem } from "../../hooks/use-selected-item";
import {
  Divider,
  Title,
  NumberInput,
  Grid,
  ColorInput,
  Text,
  Stack,
  SegmentedControl,
  VisuallyHidden,
} from "@mantine/core";
import { updateSelectedItemPropDirect } from "../../utils/content-updaters";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

export const AttrPlaceholder: FC = memo(function AttrPlaceholder() {
  const { currentSelectedId } = useCurrentSelectedId();
  const { item: currentSelectedItem, position: currentSelectedItemPosition } =
    useSelectedItem();

  // 使用细粒度订阅，只订阅需要的状态
  const currentPageIndex = useContentsStoreContext((s) => s.currentPageIndex);
  const pages = useContentsStoreContext((s) => s.pages);
  const setCurrentPageAndContent = useContentsStoreContext(
    (s) => s.setCurrentPageAndContent,
  );
  const currentPageHeaderContent = useContentsStoreContext(
    (s) => s.currentPageHeaderContent,
  );
  const currentPageBodyContent = useContentsStoreContext(
    (s) => s.currentPageBodyContent,
  );
  const currentPageFooterContent = useContentsStoreContext(
    (s) => s.currentPageFooterContent,
  );

  const defaultPageRootBackgroundColor =
    pages[currentPageIndex].defaultPageRootBackgroundColor;

  // 获取对应的 content map
  const getContentMap = () => {
    if (currentSelectedItemPosition === "header")
      return currentPageHeaderContent;
    if (currentSelectedItemPosition === "footer")
      return currentPageFooterContent;
    return currentPageBodyContent;
  };

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
              updateSelectedItemPropDirect(
                {
                  currentSelectedId,
                  currentPageIndex,
                  position: currentSelectedItemPosition,
                  contentMap: getContentMap(),
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
              updateSelectedItemPropDirect(
                {
                  currentSelectedId,
                  currentPageIndex,
                  position: currentSelectedItemPosition,
                  contentMap: getContentMap(),
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
              updateSelectedItemPropDirect(
                {
                  currentSelectedId,
                  currentPageIndex,
                  position: currentSelectedItemPosition,
                  contentMap: getContentMap(),
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
              updateSelectedItemPropDirect(
                {
                  currentSelectedId,
                  currentPageIndex,
                  position: currentSelectedItemPosition,
                  contentMap: getContentMap(),
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
              updateSelectedItemPropDirect(
                {
                  currentSelectedId,
                  currentPageIndex,
                  position: currentSelectedItemPosition,
                  contentMap: getContentMap(),
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
              updateSelectedItemPropDirect(
                {
                  currentSelectedId,
                  currentPageIndex,
                  position: currentSelectedItemPosition,
                  contentMap: getContentMap(),
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
          updateSelectedItemPropDirect(
            {
              currentSelectedId,
              currentPageIndex,
              position: currentSelectedItemPosition,
              contentMap: getContentMap(),
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
              updateSelectedItemPropDirect(
                {
                  currentSelectedId,
                  currentPageIndex,
                  position: currentSelectedItemPosition,
                  contentMap: getContentMap(),
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
