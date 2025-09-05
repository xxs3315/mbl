import React from "react";
import { Textarea, TextareaProps } from "@mantine/core";

interface DebouncedTextareaProps extends Omit<TextareaProps, "onChange"> {
  onChange: (value: string) => void;
  debounceMs?: number;
}

export const DebouncedTextarea: React.FC<DebouncedTextareaProps> = ({
  value,
  onChange,
  debounceMs = 300,
  ...props
}) => {
  const [localValue, setLocalValue] = React.useState(value ?? "");
  const [isComposing, setIsComposing] = React.useState(false);
  const debounceTimeoutRef = React.useRef<number | null>(null);

  // 同步外部值变化到本地状态
  React.useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  // 防抖更新函数
  const debouncedUpdate = React.useCallback(
    (newValue: string) => {
      if (debounceTimeoutRef.current) {
        window.clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = window.setTimeout(() => {
        if (newValue !== value) {
          onChange(newValue);
        }
      }, debounceMs);
    },
    [onChange, value, debounceMs],
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
      const newValue = event.currentTarget.value;
      setLocalValue(newValue);
      // 输入法结束时立即更新
      if (newValue !== value) {
        onChange(newValue);
      }
    },
    [value, onChange],
  );

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.currentTarget.value;
      setLocalValue(newValue);

      // 只有在非输入法状态下才进行防抖更新
      if (!isComposing) {
        debouncedUpdate(newValue);
      }
    },
    [isComposing, debouncedUpdate],
  );

  return (
    <Textarea
      {...props}
      value={localValue}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
    />
  );
};
