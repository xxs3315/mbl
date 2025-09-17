import React from "react";

export function useResponsiveLayout(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  // 侧边栏显示状态 - 初始时在桌面端显示，移动端隐藏
  const [showPageSelector, setShowPageSelector] = React.useState(true);
  const [showLeftSidebar, setShowLeftSidebar] = React.useState(true);
  const [showRightSidebar, setShowRightSidebar] = React.useState(true);
  const [isMobileMode, setIsMobileMode] = React.useState(false);

  // 监听容器大小变化，在小屏幕上隐藏侧边栏
  React.useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = () => {
      if (containerRef.current) {
        const isMobile = containerRef.current.offsetWidth < 768;
        setIsMobileMode(isMobile);

        if (isMobile) {
          // 小屏幕时隐藏侧边栏
          setShowPageSelector(false);
          setShowLeftSidebar(false);
          setShowRightSidebar(false);
        } else {
          // 桌面端时显示侧边栏（如果之前被隐藏了）
          setShowPageSelector(true);
          setShowLeftSidebar(true);
          setShowRightSidebar(true);
        }
      }
    };

    // 使用 ResizeObserver 监听容器大小变化
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // 初始检查
    handleResize();

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return {
    showPageSelector,
    setShowPageSelector,
    showLeftSidebar,
    setShowLeftSidebar,
    showRightSidebar,
    setShowRightSidebar,
    isMobileMode,
  };
}
