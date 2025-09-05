import type { JSX } from "react";
import * as React from "react";
import {
  type DestinationMeta,
  type DragEndMeta,
  type DragStartMeta,
  type DropLineRendererInjectedProps,
  type GhostRendererMeta,
  ListContext,
  type PlaceholderRendererInjectedProps,
  type PlaceholderRendererMeta,
  type StackGroupMeta,
  type StackedGroupRendererInjectedProps,
  type StackedGroupRendererMeta,
} from "./list";
import type { IListContext } from "./list/context";
import type { Direction, ItemIdentifier, NodeMeta } from "./shared";

type Props<T extends ItemIdentifier> = {
  /**
   * A function to return an element used as a drop line.
   * A drop line is a line to display a destination position to users.
   */
  renderDropLine?: (
    injectedProps: DropLineRendererInjectedProps,
  ) => React.ReactNode;
  /**
   * A function to return an element used as a ghost.
   * A ghost is an element following a mouse pointer when dragging.
   */
  renderGhost?: (meta: GhostRendererMeta<T>) => React.ReactNode;
  /**
   * A function to return an element used as a placeholder.
   * A placeholder is an element remaining in place when dragging the element.
   */
  renderPlaceholder?: (
    injectedProps: PlaceholderRendererInjectedProps,
    meta: PlaceholderRendererMeta<T>,
  ) => JSX.Element;
  /** A function to render an item element when an empty group item is hovered by a dragged item. */
  renderStackedGroup?: (
    injectedProps: StackedGroupRendererInjectedProps,
    meta: StackedGroupRendererMeta<T>,
  ) => JSX.Element;
  /**
   * A spacing size (px) between items.
   * @default 8
   */
  itemSpacing?: number;
  /**
   * A threshold size (px) of stackable area for group items.
   * @default 8
   */
  stackableAreaThreshold?: number;
  /**
   * A direction to recognize a drop area.
   * Note that this will not change styles, so you have to apply styles such as being arranged side by side.
   * @default "vertical"
   */
  direction?: Direction;
  /** A cursor style when dragging. */
  draggingCursorStyle?: React.CSSProperties["cursor"];
  /**
   * Whether all items are not able to move, drag, and stack.
   * @default false
   */
  isDisabled?: boolean;
  /** A callback function after starting of dragging. */
  onDragStart?: (meta: DragStartMeta<T>) => void;
  /** A callback function after end of dragging. */
  onDragEnd: (meta: DragEndMeta<T>) => void;
  /** A callback function when an empty group item is hovered by a dragged item. */
  onStackGroup?: (meta: StackGroupMeta<T>) => void;
  /** A unique identifier for this list (as opposed to a nested list). If you don't supply this, one will be generated.*/
  identifier?: T;
  className?: string;
  children?: React.ReactNode;
  scale?: number;
  translate?: { x: number; y: number };
};

export const List = <T extends ItemIdentifier>(props: Props<T>) => {
  const listContext = React.useContext(ListContext);

  let draggingNodeMeta: NodeMeta<T> | undefined = listContext?.draggingNodeMeta;
  let setDraggingNodeMeta = listContext?.setDraggingNodeMeta;
  let stackedGroupIdentifier: T | undefined =
    listContext?.stackedGroupIdentifier;
  let setStackedGroupIdentifier = listContext?.setStackedGroupIdentifier;
  let hoveredNodeMetaRef = listContext?.hoveredNodeMetaRef;
  let destinationMetaRef = listContext?.destinationMetaRef;
  const [listIdentifier] = React.useState(
    props.identifier || `${Math.random()}`,
  );

  // children lists of this list
  const childrenLists = React.useRef<Set<IListContext>>(new Set());

  if (!setDraggingNodeMeta) {
    [draggingNodeMeta, setDraggingNodeMeta] = React.useState<NodeMeta<T>>();
  }
  if (!setStackedGroupIdentifier) {
    [stackedGroupIdentifier, setStackedGroupIdentifier] = React.useState<T>();
  }
  if (!hoveredNodeMetaRef) {
    hoveredNodeMetaRef = React.useRef<NodeMeta<T>>(undefined as never);
  }
  if (!destinationMetaRef) {
    destinationMetaRef = React.useRef<DestinationMeta<T>>(undefined as never);
  }

  const [isVisibleDropLineElement, setIsVisibleDropLineElement] =
    React.useState(false);

  const dropLineElementRef = React.useRef<HTMLDivElement>(undefined as never);
  const ghostWrapperElementRef = React.useRef<HTMLDivElement>(
    undefined as never,
  );

  const itemSpacing = props.itemSpacing ?? 2;
  const stackableAreaThreshold = props.stackableAreaThreshold ?? 8;
  const direction = props.direction ?? "vertical";
  const isDisabled = props.isDisabled ?? false;

  const dropLineElement = React.useMemo(() => {
    const displayLine =
      draggingNodeMeta &&
      isVisibleDropLineElement &&
      hoveredNodeMetaRef.current &&
      hoveredNodeMetaRef.current.listIdentifier === listIdentifier;

    const style: React.CSSProperties = {
      display: displayLine ? "block" : "none",
      position: "absolute",
      top: 0,
      left: 0,
      transform:
        direction === "vertical"
          ? `scale(${1 / (props.scale ?? 1)}) translate(0, -50%)`
          : `scale(${1 / (props.scale ?? 1)}) translate(-50%, 0)`,
      pointerEvents: "none",
    };

    return props.renderDropLine?.({ ref: dropLineElementRef, style });
  }, [
    props.renderDropLine,
    draggingNodeMeta,
    childrenLists,
    isVisibleDropLineElement,
    hoveredNodeMetaRef.current,
    direction,
  ]);

  const ghostElement = React.useMemo(() => {
    if (
      draggingNodeMeta === undefined ||
      draggingNodeMeta.listIdentifier !== listIdentifier
    )
      return;

    const { identifier, groupIdentifier, index, isGroup } = draggingNodeMeta;

    return props.renderGhost?.({
      identifier,
      groupIdentifier,
      index,
      isGroup,
      listIdentifier: draggingNodeMeta.listIdentifier,
    });
  }, [props.renderGhost, draggingNodeMeta]);

  const padding: [string, string] = ["0", "0"];
  /*if (direction === "vertical")*/ padding[0] = `${itemSpacing}px`;
  /*if (direction === "horizontal")*/ padding[1] = `${itemSpacing}px`;

  const rootList = listContext?.rootList || listContext;

  const resetDragState = () => {
    // Resets context values.
    setIsVisibleDropLineElement(false);
    listContext?.setIsVisibleDropLineElement(false);
    setDraggingNodeMeta(undefined);
    setStackedGroupIdentifier(undefined);
    hoveredNodeMetaRef.current = undefined;
    destinationMetaRef.current = undefined;

    // also go through all the children and reset their local state
    for (const child of childrenLists.current) {
      child.resetDragState();
    }
  };

  const thisListContext: IListContext = {
    itemSpacing,
    stackableAreaThreshold,
    draggingNodeMeta,
    setDraggingNodeMeta,
    dropLineElementRef,
    ghostWrapperElementRef,
    isVisibleDropLineElement,
    setIsVisibleDropLineElement,
    stackedGroupIdentifier,
    setStackedGroupIdentifier,
    listIdentifier,
    rootList,
    childrenLists,
    hoveredNodeMetaRef,
    destinationMetaRef,
    direction,
    isDisabled,
    renderPlaceholder: props.renderPlaceholder,
    renderStackedGroup: props.renderStackedGroup,
    draggingCursorStyle: props.draggingCursorStyle,
    resetDragState,
    onDragStart: props.onDragStart,
    onDragEnd: (meta: DragEndMeta<any>) => {
      rootList ? rootList.resetDragState() : resetDragState();
      props?.onDragEnd(meta);
    },
    onStackGroup: props.onStackGroup,
  };

  // add the children and the ancestor
  React.useEffect(() => {
    listContext?.childrenLists.current.add(thisListContext);

    return () => {
      listContext?.childrenLists.current.delete(thisListContext);
    };
  }, []);

  return (
    <ListContext.Provider value={thisListContext}>
      <div
        data-column-id={props.identifier}
        className={props.className}
        style={{ position: "relative", padding: 0 }}
      >
        {props.children}

        {dropLineElement}
        <div
          ref={ghostWrapperElementRef}
          style={{ position: "fixed", pointerEvents: "none", zIndex: 40 }}
        >
          {ghostElement}
        </div>
        {/*<div data-resize-handle></div>*/}
      </div>
    </ListContext.Provider>
  );
};
