import { FC, memo } from "react";
import { useContentsStoreContext } from "../../store/store";
import { useCurrentSelectedId } from "../../providers/current-selected-id-provider";
import { useSelectedItem } from "../../hooks/use-selected-item";
import { useI18n } from "../../providers/i18n-provider";
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
import { updateSelectedItemPropDirect } from "../../utils/content-updaters";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

export const AttrText: FC = memo(function AttrText() {
  const { currentSelectedId, setCurrentSelectedId } = useCurrentSelectedId();
  const { item: currentSelectedItem, position: currentSelectedItemPosition } =
    useSelectedItem();
  const { t } = useI18n();

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

  const defaultPageRootFontSize =
    pages[currentPageIndex].defaultPageRootFontSize;
  const defaultPageRootFontColor =
    pages[currentPageIndex].defaultPageRootFontColor;
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

  // 如果当前选中的元素在当前页面中不存在，清除选中状态
  React.useEffect(() => {
    if (currentSelectedId && !currentSelectedItem) {
      setCurrentSelectedId("");
    }
  }, [currentSelectedId, currentSelectedItem, setCurrentSelectedId]);

  return (
    <>
      <Title order={4}>{t("attributePanel.text.title")}</Title>
      <Divider my="xs" />

      <Checkbox
        size="xs"
        fw={500}
        label={t("attributePanel.text.bold")}
        checked={currentSelectedItem?.bold ?? false}
        onChange={(event) => {
          if (!currentSelectedId || !currentSelectedItemPosition) return;
          updateSelectedItemPropDirect(
            {
              currentSelectedId,
              currentPageIndex,
              position: currentSelectedItemPosition,
              contentMap: getContentMap(),
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
            label={t("attributePanel.text.leftPadding")}
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
            label={t("attributePanel.text.rightPadding")}
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
            label={t("attributePanel.text.topPadding")}
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
            label={t("attributePanel.text.bottomPadding")}
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

      <NumberInput
        label={t("attributePanel.text.fontSize")}
        mt="xs"
        size="xs"
        value={currentSelectedItem?.fontSize || defaultPageRootFontSize}
        onChange={(value) => {
          if (!currentSelectedId || !currentSelectedItemPosition) return;
          const num = typeof value === "number" ? value : Number(value) || 0;
          updateSelectedItemPropDirect(
            {
              currentSelectedId,
              currentPageIndex,
              position: currentSelectedItemPosition,
              contentMap: getContentMap(),
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
        label={t("attributePanel.text.fontColor")}
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
          updateSelectedItemPropDirect(
            {
              currentSelectedId,
              currentPageIndex,
              position: currentSelectedItemPosition,
              contentMap: getContentMap(),
              setCurrentPageAndContent,
            },
            "fontColor",
            value,
          );
        }}
      />

      <ColorInput
        label={t("attributePanel.text.backgroundColor")}
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
          {t("attributePanel.text.horizontalAlign")}
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
                    <VisuallyHidden>
                      {t("attributePanel.text.leftAlign")}
                    </VisuallyHidden>
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
                    <VisuallyHidden>
                      {t("attributePanel.text.centerAlign")}
                    </VisuallyHidden>
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
                    <VisuallyHidden>
                      {t("attributePanel.text.rightAlign")}
                    </VisuallyHidden>
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
