import React, { FC, memo } from "react";
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
import { useI18n } from "@xxs3315/mbl-providers";
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "./icons";

interface AttrColumnProps {
  selectedColumn: any;
  onColumnChange: (columnId: string, field: string, value: any) => void;
}

export const AttrColumn: FC<AttrColumnProps> = memo(function AttrColumn({
  selectedColumn,
  onColumnChange,
}) {
  const { t } = useI18n();

  if (!selectedColumn) {
    return null;
  }

  const handlePropChange = (field: string, value: any) => {
    onColumnChange(selectedColumn.id, field, value);
  };

  return (
    <>
      <Title order={4}>{t("text.title", { ns: "attributePanel" })}</Title>
      <Divider my="xs" />

      <Checkbox
        size="xs"
        fw={500}
        label={t("text.bold", { ns: "attributePanel" })}
        checked={selectedColumn?.bold ?? false}
        onChange={(event) =>
          handlePropChange("bold", event.currentTarget.checked)
        }
      />

      <Grid gutter="xs" mt="xs">
        <Grid.Col span={6}>
          <NumberInput
            min={0}
            label={t("text.leftPadding", {
              ns: "attributePanel",
            })}
            size="xs"
            value={selectedColumn?.pLeft ?? 0}
            onChange={(value) => handlePropChange("pLeft", Number(value) || 0)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            min={0}
            label={t("text.rightPadding", {
              ns: "attributePanel",
            })}
            size="xs"
            value={selectedColumn?.pRight ?? 0}
            onChange={(value) => handlePropChange("pRight", Number(value) || 0)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            min={0}
            label={t("text.topPadding", {
              ns: "attributePanel",
            })}
            size="xs"
            value={selectedColumn?.pTop ?? 0}
            onChange={(value) => handlePropChange("pTop", Number(value) || 0)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            min={0}
            label={t("text.bottomPadding", {
              ns: "attributePanel",
            })}
            size="xs"
            value={selectedColumn?.pBottom ?? 0}
            onChange={(value) =>
              handlePropChange("pBottom", Number(value) || 0)
            }
          />
        </Grid.Col>
      </Grid>

      <NumberInput
        label={t("text.fontSize", { ns: "attributePanel" })}
        mt="xs"
        size="xs"
        value={selectedColumn?.fontSize || 10}
        onChange={(value) => handlePropChange("fontSize", Number(value) || 0)}
        min={6}
        max={288}
      />

      <ColorInput
        label={t("text.fontColor", { ns: "attributePanel" })}
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
        value={selectedColumn?.fontColor || "#000000"}
        onChange={(value) => handlePropChange("fontColor", value)}
      />

      <ColorInput
        label={t("text.backgroundColor", {
          ns: "attributePanel",
        })}
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
        value={selectedColumn?.background || "#00000000"}
        onChange={(value) => handlePropChange("background", value)}
      />

      <div>
        <Text size="xs" fw={500} mb={2} mt="xs">
          {t("text.horizontalAlign", { ns: "attributePanel" })}
        </Text>
        <Stack align="center">
          <SegmentedControl
            value={selectedColumn?.horizontal || "center"}
            onChange={(value) => handlePropChange("horizontal", value)}
            data={[
              {
                value: "left",
                label: (
                  <>
                    <AlignLeftIcon />
                    <VisuallyHidden>
                      {t("text.leftAlign", { ns: "attributePanel" })}
                    </VisuallyHidden>
                  </>
                ),
              },
              {
                value: "center",
                label: (
                  <>
                    <AlignCenterIcon />
                    <VisuallyHidden>
                      {t("text.centerAlign", { ns: "attributePanel" })}
                    </VisuallyHidden>
                  </>
                ),
              },
              {
                value: "right",
                label: (
                  <>
                    <AlignRightIcon />
                    <VisuallyHidden>
                      {t("text.rightAlign", { ns: "attributePanel" })}
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
