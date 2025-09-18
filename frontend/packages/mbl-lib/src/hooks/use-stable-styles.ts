import React from "react";
import { pt2px } from "@xxs3315/mbl-utils";
import { useDpi } from "../providers/dpi-provider";
import { ItemTypes } from "@xxs3315/mbl-dnd";

export function useStableStyles() {
  const { dpi } = useDpi();

  const stableAcceptArrays = React.useMemo(
    () => ({
      containerAndElement: [ItemTypes.CONTAINER, ItemTypes.ELEMENT],
      containerElementPageHeader: [
        ItemTypes.CONTAINER,
        ItemTypes.ELEMENT,
        ItemTypes.PAGE_HEADER_ELEMENT,
      ],
      containerElementPageBody: [
        ItemTypes.CONTAINER,
        ItemTypes.ELEMENT,
        ItemTypes.PAGE_BODY_ELEMENT,
      ],
      containerElementPageFooter: [
        ItemTypes.CONTAINER,
        ItemTypes.ELEMENT,
        ItemTypes.PAGE_FOOTER_ELEMENT,
      ],
    }),
    [],
  );

  // 预定义稳定的样式对象
  const stableMoreStyles = React.useMemo(
    () => ({
      marginTop0: { marginTop: 0 },
      marginTop0Full: {
        marginTop: 0,
        padding: 0,
        width: "100%",
        height: "100%",
        minHeight: "24px",
      },
      flexStart: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginTop: 0,
      },
      flexCenter: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 0,
      },
      flexEnd: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        marginTop: 0,
      },
    }),
    [],
  );

  // 根据 vertical 属性获取稳定的样式对象
  const getVerticalStyle = React.useMemo(() => {
    return (vertical?: string) => {
      if (vertical === "top") return stableMoreStyles.flexStart;
      if (vertical === "bottom") return stableMoreStyles.flexEnd;
      return stableMoreStyles.flexCenter;
    };
  }, [stableMoreStyles]);

  const getFlexStyle = React.useMemo(() => {
    return (item: any) => {
      const flexValue = item.wildStar
        ? "1"
        : `${item.canGrow ? "1" : "0"} ${item.canShrink ? "1" : "0"} ${item.flexUnit === "%" ? item.flexValue : pt2px(item.flexValue ?? 0, dpi)}${item.flexUnit}`;
      return { flex: flexValue };
    };
  }, [dpi]);

  return {
    stableAcceptArrays,
    stableMoreStyles,
    getVerticalStyle,
    getFlexStyle,
  };
}
