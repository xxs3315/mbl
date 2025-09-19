import React from "react";
import { Textarea } from "@mantine/core";
import { pt2px } from "@xxs3315/mbl-utils";
import { useDpi } from "@xxs3315/mbl-providers";
import { useCurrentSelectedId } from "@xxs3315/mbl-providers";

interface TextareaWithCompositionProps {
  props: any;
  updateTextItemValue: (itemId: string, newValue: string) => void;
}

export const TextareaWithComposition = React.memo<TextareaWithCompositionProps>(
  ({ props, updateTextItemValue }) => {
    const { dpi } = useDpi();
    const { setCurrentSelectedId } = useCurrentSelectedId();

    const [localValue, setLocalValue] = React.useState(props.value ?? "");
    const [isComposing, setIsComposing] = React.useState(false);
    const debounceTimeoutRef = React.useRef<number | null>(null);

    // 同步外部值变化到本地状态
    React.useEffect(() => {
      setLocalValue(props.value ?? "");
    }, [props.value]);

    // 防抖更新函数
    const debouncedUpdate = React.useCallback(
      (value: string) => {
        if (debounceTimeoutRef.current) {
          window.clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = window.setTimeout(() => {
          if (updateTextItemValue && value !== props.value) {
            updateTextItemValue(props.id, value);
          }
        }, 300); // 300ms 防抖延迟
      },
      [updateTextItemValue, props.id, props.value],
    );

    // 清理定时器
    React.useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          window.clearTimeout(debounceTimeoutRef.current);
        }
      };
    }, []);

    const handleCompositionStart = React.useCallback(() => {
      setIsComposing(true);
    }, []);

    const handleCompositionEnd = React.useCallback(
      (event: React.CompositionEvent<HTMLTextAreaElement>) => {
        setIsComposing(false);
        const value = event.currentTarget.value;
        setLocalValue(value);
        // 输入法结束时立即更新
        if (updateTextItemValue && value !== props.value) {
          updateTextItemValue(props.id, value);
        }
      },
      [props.id, props.value, updateTextItemValue],
    );

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.currentTarget.value;
        setLocalValue(value);

        // 只有在非输入法状态下才进行防抖更新
        if (!isComposing) {
          debouncedUpdate(value);
        }
      },
      [isComposing, debouncedUpdate],
    );

    // 缓存样式对象以避免重复创建
    const textareaStyles = React.useMemo(
      () => ({
        root: {
          paddingTop: `${props.pTop ?? 0}px`,
          paddingRight: `${props.pRight ?? 0}px`,
          paddingBottom: `${props.pBottom ?? 0}px`,
          paddingLeft: `${props.pLeft ?? 0}px`,
        },
        input: {
          textIndent: props.indent ? "2em" : 0,
          fontSize: pt2px(props.fontSize ?? 0, dpi),
          fontWeight: props.bold ? "bolder" : "normal",
          color: props.fontColor,
          background: props.background,
          textAlign: props.horizontal,
          border: "none",
          padding: 0,
          "--input-height": "16px",
          borderRadius: 0,
        },
      }),
      [
        props.pTop,
        props.pRight,
        props.pBottom,
        props.pLeft,
        props.indent,
        props.fontSize,
        props.bold,
        props.fontColor,
        props.background,
        props.horizontal,
        dpi,
      ],
    );

    return (
      <Textarea
        autosize
        size="xs"
        radius="xs"
        value={localValue}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        styles={textareaStyles}
        onFocus={() => {
          setTimeout(() => setCurrentSelectedId(props.id), 100);
        }}
      />
    );
  },
);
