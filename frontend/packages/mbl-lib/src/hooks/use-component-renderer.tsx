import React from "react";
import { css } from "../styled-system/css";
import { Image as MantineImage } from "@mantine/core";
import { pt2px } from "@xxs3315/mbl-utils";
import { useDpi } from "../providers/dpi-provider";
import { TextareaWithComposition } from "../components";

export function useComponentRenderer(
  updateTextItemValue?: (
    itemId: string,
    newValue: string,
    position: "header" | "body" | "footer",
  ) => void,
  enablePluginSystem?: boolean,
  plugins?: Array<{ metadata: any; plugin: any }>,
  handlePluginPropsChange?: (
    itemId: string,
    newProps: any,
    position: "header" | "body" | "footer",
  ) => void,
) {
  const { dpi } = useDpi();

  const getComponent = React.useCallback(
    (props: any, position: "header" | "body" | "footer" = "body") => {
      switch (props.cat) {
        case "text":
          return (
            <TextareaWithComposition
              key={`${position}-item-${props.id}-target`}
              props={props}
              updateTextItemValue={(itemId: string, newValue: string) =>
                updateTextItemValue?.(itemId, newValue, position)
              }
            />
          );
        case "image":
          return (
            <div
              style={{
                marginTop: `${pt2px(props.pTop ?? 0, dpi)}px`,
                marginRight: `${pt2px(props.pRight ?? 0, dpi)}px`,
                marginBottom: `${pt2px(props.pBottom ?? 0, dpi)}px`,
                marginLeft: `${pt2px(props.pLeft ?? 0, dpi)}px`,
              }}
            >
              <MantineImage
                key={`${position}-item-${props.id}-target`}
                radius="xs"
                h={"auto"}
                fit="scale-down"
                src={props.value && props.value.length > 0 ? props.value : null}
                styles={{
                  root: {
                    width: `${pt2px(props.width ?? 0, dpi)}px`,
                    margin: `${
                      props.horizontal === "left"
                        ? "0 auto 0 0"
                        : props.horizontal === "right"
                          ? "0 0 0 auto"
                          : "0 auto"
                    }`,
                  },
                }}
              />
            </div>
          );
        case "page-break":
          return (
            <div
              key={`item-${props.id}-target`}
              className={css({
                display: "flex",
                height: "16px",
                width: "full",
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              <div
                className={css({
                  height: "8px",
                  width: "full",
                  backgroundColor: "red.300",
                })}
              />
            </div>
          );
        case "placeholder":
          return (
            <div
              style={{
                marginTop: `${pt2px(props.pTop ?? 0, dpi)}px`,
                marginRight: `${pt2px(props.pRight ?? 0, dpi)}px`,
                marginBottom: `${pt2px(props.pBottom ?? 0, dpi)}px`,
                marginLeft: `${pt2px(props.pLeft ?? 0, dpi)}px`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pt2px(props.width ?? 0, dpi)}px`,
                  height: `${pt2px(props.height ?? 0, dpi)}px`,
                  background: `${props.background}`,
                  margin: `${
                    props.horizontal === "left"
                      ? "0 auto 0 0"
                      : props.horizontal === "right"
                        ? "0 0 0 auto"
                        : "0 auto"
                  }`,
                }}
              />
            </div>
          );
        case "page-number":
          return (
            <TextareaWithComposition
              key={`${position}-item-${props.id}-target`}
              props={props}
              updateTextItemValue={(itemId: string, newValue: string) =>
                updateTextItemValue?.(itemId, newValue, position)
              }
            />
          );
        default:
          // 检查是否是插件项目
          if (props.pluginId && enablePluginSystem && plugins) {
            console.log("[Plugin] Rendering plugin component:", props.pluginId);

            // 查找对应的插件
            const pluginWrapper = plugins.find(
              (p) => p.metadata.id === props.pluginId,
            );
            if (pluginWrapper) {
              const plugin = pluginWrapper.plugin;

              // 调用插件的render方法
              if (plugin.render) {
                const pluginProps = {
                  id: props.id,
                  attrs: props,
                  onPropsChange: (newProps: any) => {
                    // 通过 handlePluginPropsChange 更新 store
                    handlePluginPropsChange?.(props.id, newProps, position);
                  },
                };

                return plugin.render(pluginProps);
              }
            }
          }

          return <span key={`${position}-item-${props.id}-target`} />;
      }
    },
    [
      updateTextItemValue,
      enablePluginSystem,
      handlePluginPropsChange,
      plugins,
      dpi,
    ],
  );

  return {
    getComponent,
  };
}
