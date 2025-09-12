import React, { FC, memo } from "react";
import {
  Divider,
  SegmentedControl,
  Stack,
  Text,
  Title,
  VisuallyHidden,
} from "@mantine/core";
import {
  AlignCenterHorizontal,
  AlignEndHorizontal,
  AlignStartHorizontal,
} from "lucide-react";
import { useSelectedItem } from "../../hooks/use-selected-item";
import { useContentsStoreContext } from "../../store/store";
import { useCurrentSelectedId } from "../../providers/current-selected-id-provider";
import { updateSelectedItemPropDirect } from "../../utils/content-updaters";
import { AttrHboxCol } from "./attr-hbox-col";

export const AttrHbox: FC = memo(function AttrHbox() {
  const { item: currentSelectedItem, position: currentSelectedItemPosition } =
    useSelectedItem();
  // 使用细粒度订阅，只订阅需要的状态
  const currentPageIndex = useContentsStoreContext((s) => s.currentPageIndex);
  const currentPageHeaderContent = useContentsStoreContext(
    (s) => s.currentPageHeaderContent,
  );
  const currentPageBodyContent = useContentsStoreContext(
    (s) => s.currentPageBodyContent,
  );
  const currentPageFooterContent = useContentsStoreContext(
    (s) => s.currentPageFooterContent,
  );
  const setCurrentPageAndContent = useContentsStoreContext(
    (s) => s.setCurrentPageAndContent,
  );
  const { currentSelectedId } = useCurrentSelectedId();

  // 获取对应的 content map
  const getContentMap = () => {
    if (currentSelectedItemPosition === "header")
      return currentPageHeaderContent;
    if (currentSelectedItemPosition === "footer")
      return currentPageFooterContent;
    return currentPageBodyContent;
  };

  if (
    !currentSelectedItem ||
    !currentSelectedItemPosition ||
    !currentSelectedId
  ) {
    return null;
  }

  return (
    <>
      <Title order={4}>水平容器属性</Title>
      <Divider my="xs" />

      {/* 渲染子列 */}
      {currentSelectedItem.children?.map((id: string, index: number) => {
        return <AttrHboxCol id={id} index={index} key={id + index} />;
      })}

      {/* 垂直对齐设置 */}
      <div>
        <Text size="xs" fw={500} mb={2} mt={4}>
          垂直对齐
        </Text>
        <Stack align="center">
          <SegmentedControl
            value={currentSelectedItem.vertical || "top"}
            onChange={(value) => {
              updateSelectedItemPropDirect(
                {
                  currentSelectedId,
                  position: currentSelectedItemPosition,
                  currentPageIndex,
                  contentMap: getContentMap(),
                  setCurrentPageAndContent,
                },
                "vertical",
                value,
              );
            }}
            data={[
              {
                value: "top",
                label: (
                  <>
                    <AlignStartHorizontal
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <VisuallyHidden>顶部</VisuallyHidden>
                  </>
                ),
              },
              {
                value: "middle",
                label: (
                  <>
                    <AlignCenterHorizontal
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <VisuallyHidden>中间</VisuallyHidden>
                  </>
                ),
              },
              {
                value: "bottom",
                label: (
                  <>
                    <AlignEndHorizontal
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <VisuallyHidden>底部</VisuallyHidden>
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
