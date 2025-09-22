import React, { FC, memo } from "react";
import {
  Checkbox,
  Divider,
  Grid,
  NumberInput,
  Select,
  Text,
} from "@mantine/core";
import { Asterisk } from "lucide-react";
import { useContentsStoreContext } from "../../store/store";
import { updateSelectedItemPropDirect } from "../../utils/content-updaters";
import { useI18n } from "@xxs3315/mbl-providers";

interface AttrHboxColProps {
  id: string;
  index: number;
}

export const AttrHboxCol: FC<AttrHboxColProps> = memo(function AttrHboxCol({
  id,
  index,
}) {
  const { t } = useI18n();
  // 使用细粒度订阅，只订阅需要的状态
  const currentPageIndex = useContentsStoreContext((s) => s.currentPageIndex);
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

  // 直接通过 id 查找对应的列项
  let selectedItem = null;
  let selectedItemPosition = null;

  if (currentPageHeaderContent.has(id)) {
    selectedItem = currentPageHeaderContent.get(id);
    selectedItemPosition = "header";
  } else if (currentPageBodyContent.has(id)) {
    selectedItem = currentPageBodyContent.get(id);
    selectedItemPosition = "body";
  } else if (currentPageFooterContent.has(id)) {
    selectedItem = currentPageFooterContent.get(id);
    selectedItemPosition = "footer";
  }

  if (!selectedItem || !selectedItemPosition) {
    return null;
  }

  const updateColumnProp = (prop: string, value: any) => {
    // 直接更新列项本身，使用细粒度方法
    const contentMap =
      selectedItemPosition === "header"
        ? currentPageHeaderContent
        : selectedItemPosition === "footer"
          ? currentPageFooterContent
          : currentPageBodyContent;

    updateSelectedItemPropDirect(
      {
        currentSelectedId: id,
        position: selectedItemPosition as "header" | "body" | "footer",
        currentPageIndex,
        contentMap,
        setCurrentPageAndContent,
      },
      prop,
      value,
    );
  };

  return (
    <>
      <Grid gutter="xs">
        <Grid.Col span={12}>
          <Grid
            gutter="xs"
            styles={{
              root: { marginTop: "11px" },
            }}
          >
            <Grid.Col span={8}>
              <Text size="sm" fw={500} mb={2} mt={2}>
                {t("column", { ns: "common" })} {index + 1}
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Checkbox
                checked={selectedItem.wildStar || false}
                onChange={(event) => {
                  updateColumnProp("wildStar", event.currentTarget.checked);
                }}
                label={
                  <>
                    <Asterisk
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </>
                }
                variant="outline"
                radius="xs"
                size="xs"
                styles={{
                  root: { marginTop: "4px" },
                  label: {
                    paddingInlineStart: "4px",
                  },
                }}
              />
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={8}>
          <NumberInput
            disabled={selectedItem.wildStar}
            label={t("size", { ns: "common" })}
            size="xs"
            value={selectedItem.flexValue || 100}
            onChange={(value) => {
              updateColumnProp("flexValue", Number(value));
            }}
            min={6}
            max={288}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            disabled={selectedItem.wildStar}
            allowDeselect={false}
            size="xs"
            label={t("unit", { ns: "common" })}
            placeholder={t("selectValue", { ns: "common" })}
            data={[
              { value: "%", label: "%" },
              { value: "px", label: "pt" },
            ]}
            value={selectedItem.flexUnit || "%"}
            onChange={(value) => {
              updateColumnProp("flexUnit", value);
            }}
          />
        </Grid.Col>
      </Grid>
      <Divider my="xs" />
    </>
  );
});
