import React from "react";
import { css } from "../../styled-system/css";
import { toolPanelDataBindings } from "../../comps/tool-panel/data";
import { ItemTypes } from "@xxs3315/mbl-dnd";
import { Box } from "@xxs3315/mbl-dnd";
import "@xxs3315/mbl-dnd/box.css";
import { DotsSVG } from "../icons";

interface ControlBarDataSourcesProps {
  id: string;
}

export const ControlBarDataSources = React.memo<ControlBarDataSourcesProps>(
  ({ id }) => {
    return (
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "8px",
        })}
      >
        {toolPanelDataBindings.map((dataBinding) => (
          <div
            key={dataBinding.id}
            className={css({
              display: "flex",
              flexDirection: "column",
              border: "1px solid",
              borderColor: "gray.300",
              borderRadius: "4px",
              padding: "8px",
            })}
          >
            <div
              className={css({
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "4px",
              })}
            >
              <div
                className={css({
                  fontWeight: "bold",
                  fontSize: "sm",
                })}
              >
                {dataBinding.name}
              </div>
            </div>

            <div
              className={css({
                fontSize: "xs",
                color: "gray.600",
                marginBottom: "8px",
              })}
            >
              {dataBinding.description}
            </div>

            <div
              className={css({
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
              })}
            >
              {dataBinding.bindings.map((binding: any, index: number) => (
                <div
                  key={index}
                  className={css({
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid",
                    borderColor: "gray.400",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    fontSize: "xs",
                  })}
                >
                  <Box
                    name={binding.name}
                    type={dataBinding.type || ItemTypes.ELEMENT}
                    cat="data-binding-item"
                    isDropped={false}
                    bind={binding.bind}
                    shape={dataBinding.shape}
                    request={dataBinding.request}
                    value={dataBinding.value}
                    attrs={{
                      bind: binding.bind,
                      shape: dataBinding.shape,
                      request: dataBinding.request,
                      value: dataBinding.value,
                    }}
                  >
                    <div
                      className={css({
                        width: "12px",
                        height: "12px",
                        marginRight: "4px",
                        cursor: "grab",
                      })}
                    >
                      <DotsSVG />
                    </div>
                  </Box>
                  <span>{binding.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
);
