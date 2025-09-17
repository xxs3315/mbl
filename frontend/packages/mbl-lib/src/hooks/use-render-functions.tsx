import React from "react";
import { css } from "../styled-system/css";
import {
  DropLineRendererInjectedProps,
  GhostRendererMeta,
  PlaceholderRendererInjectedProps,
  PlaceholderRendererMeta,
  StackedGroupRendererInjectedProps,
  DragHandleComponent,
} from "@xxs3315/mbl-core";

export function useRenderFunctions(colors: any) {
  const renderDropLineElement = React.useCallback(
    (injectedProps: DropLineRendererInjectedProps) => {
      return (
        <div
          data-name={"drop"}
          ref={injectedProps.ref}
          className={css({
            position: "relative",
            height: "4px",
            zIndex: "30",
          })}
          style={{
            ...injectedProps.style,
            backgroundColor: colors.primary,
          }}
        >
          <div
            style={{
              content: '""',
              position: "absolute",
              top: "-2px",
              left: "-4px",
              height: "8px",
              width: "8px",
              borderRadius: "50%",
              backgroundColor: colors.primary,
            }}
          />
          <div
            style={{
              content: '""',
              position: "absolute",
              top: "-2px",
              right: "-4px",
              height: "8px",
              width: "8px",
              borderRadius: "50%",
              backgroundColor: colors.primary,
            }}
          />
        </div>
      );
    },
    [colors.primary],
  );

  const renderGhostElement = React.useCallback(
    ({ isGroup }: GhostRendererMeta<string>) => {
      return (
        <div
          data-name={"ghost"}
          className={css({
            height: "full",
            width: "full",
            transformOrigin: "32px 32px",
            opacity: "0.8",
            boxShadow: "lg",
            zIndex: "20",
            ...(isGroup
              ? {
                  borderRadius: "none",
                  border: "1px solid",
                  paddingX: "0",
                  paddingBottom: "0",
                }
              : {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  borderRadius: "none",
                  border: "1px solid",
                  borderColor: "gray.300",
                  backgroundColor: "white",
                  padding: "0",
                  fontWeight: "bold",
                  fontSize: "xs",
                  lineHeight: "tight",
                }),
          })}
          style={{
            borderColor: isGroup ? "#e5e7eb" : undefined, // gray.300 equivalent
            backgroundColor: isGroup ? "#f3f4f620" : undefined, // primaryLight with 20% opacity
            color: isGroup ? "#3b82f6" : undefined, // primary color
          }}
        >
          <DragHandleComponent className={css({ display: "none" })}>
            <span />
          </DragHandleComponent>
        </div>
      );
    },
    [],
  );

  const renderPlaceholderElement = React.useCallback(
    (
      injectedProps: PlaceholderRendererInjectedProps,
      { isGroup }: PlaceholderRendererMeta<string>,
    ) => (
      <div
        data-name={"placeholder"}
        className={css({
          height: "full",
          width: "full",
          transformOrigin: "32px 32px",
          boxShadow: "lg",
          zIndex: "20",
          borderStyle: "dashed",
          backgroundColor: "transparent",
          ...(isGroup
            ? {
                opacity: "0.4",
              }
            : {
                opacity: "0.8",
                color: "gray.300",
              }),
        })}
        style={{
          ...injectedProps.style,
          borderColor: isGroup ? "#3b82f6" : undefined, // primary color
          backgroundColor: isGroup ? "#f3f4f620" : undefined, // primaryLight with 20% opacity
        }}
      >
        <DragHandleComponent className={css({ display: "none" })}>
          <span />
        </DragHandleComponent>
      </div>
    ),
    [],
  );

  const renderStackedGroupElement = React.useCallback(
    (injectedProps: StackedGroupRendererInjectedProps) => (
      <div
        data-name={"stacked-group"}
        className={css({
          borderRadius: "none",
          border: "1px solid",
          paddingX: "0",
          paddingBottom: "0",
        })}
        style={{
          ...injectedProps.style,
          borderColor: colors.primaryLight,
          backgroundColor: `${colors.primaryLight}20`,
          boxShadow: `0 0 0 2px ${colors.primary}`,
        }}
      />
    ),
    [colors.primaryLight, colors.primary],
  );

  const renderHorizontalDropLineElement = React.useCallback(
    (injectedProps: DropLineRendererInjectedProps) => {
      return (
        <div
          data-name={"drop-horizontal"}
          ref={injectedProps.ref}
          className={css({
            position: "relative",
            height: "auto",
            width: "4px",
            zIndex: "30",
          })}
          style={{
            ...injectedProps.style,
            backgroundColor: colors.primary,
          }}
        >
          <div
            style={{
              content: '""',
              position: "absolute",
              top: "-4px",
              left: "-2px",
              height: "8px",
              width: "8px",
              borderRadius: "50%",
              backgroundColor: colors.primary,
            }}
          />
          <div
            style={{
              content: '""',
              position: "absolute",
              bottom: "-4px",
              left: "-2px",
              height: "8px",
              width: "8px",
              borderRadius: "50%",
              backgroundColor: colors.primary,
            }}
          />
        </div>
      );
    },
    [colors.primary],
  );

  const renderHorizontalGhostElement = React.useCallback(
    ({ isGroup }: GhostRendererMeta<string>) => {
      return (
        <div
          data-name={"ghost-horizontal"}
          className={css({
            height: "full",
            width: "full",
            transformOrigin: "32px center",
            opacity: "0.8",
            boxShadow: "lg",
            zIndex: "20",
            ...(isGroup
              ? {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  border: "1px solid",
                  padding: "0",
                  fontWeight: "bold",
                  fontSize: "xs",
                  lineHeight: "tight",
                }
              : {
                  display: "flex",
                  height: "full",
                  minWidth: "128px",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: "none",
                  border: "1px solid",
                  borderColor: "gray.300",
                  backgroundColor: "white",
                  paddingX: "16px",
                  paddingY: "8px",
                }),
          })}
          style={{
            borderColor: isGroup ? colors.primaryLight : undefined,
            backgroundColor: isGroup ? `${colors.primaryLight}20` : undefined,
            color: isGroup ? colors.primary : undefined,
          }}
        >
          <DragHandleComponent className={css({ display: "none" })}>
            <span />
          </DragHandleComponent>
        </div>
      );
    },
    [colors.primaryLight, colors.primary],
  );

  const renderHorizontalPlaceholderElement = React.useCallback(
    (injectedProps: PlaceholderRendererInjectedProps) => (
      <div
        data-name={"placeholder-horizontal"}
        className={css({
          display: "flex",
          height: "full",
          minWidth: "128px",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "none",
          border: "1px dashed",
          borderColor: "gray.300",
          backgroundColor: "transparent",
          color: "gray.300",
          paddingX: "16px",
          paddingY: "8px",
          position: "relative",
        })}
        style={{
          ...injectedProps.style,
          backgroundColor: `${colors.primaryLight}20`,
        }}
      >
        <DragHandleComponent className={css({ display: "none" })}>
          <span />
        </DragHandleComponent>
      </div>
    ),
    [colors.primaryLight],
  );

  const renderHorizontalStackedGroupElement = React.useCallback(
    (injectedProps: StackedGroupRendererInjectedProps) => (
      <div
        data-name={"stacked-group-horizontal"}
        className={css({
          display: "flex",
          width: "full",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          border: "1px solid",
          padding: "0",
          fontWeight: "bold",
          fontSize: "xs",
          lineHeight: "tight",
          minHeight: "full",
        })}
        style={{
          ...injectedProps.style,
          borderColor: colors.primaryLight,
          backgroundColor: `${colors.primaryLight}20`,
          color: colors.primary,
          boxShadow: `0 0 0 2px ${colors.primary}`,
        }}
      />
    ),
    [colors.primaryLight, colors.primary],
  );

  return {
    renderDropLineElement,
    renderGhostElement,
    renderPlaceholderElement,
    renderStackedGroupElement,
    renderHorizontalDropLineElement,
    renderHorizontalGhostElement,
    renderHorizontalPlaceholderElement,
    renderHorizontalStackedGroupElement,
  };
}
