import React from "react";

export function useResponsiveLayout(
  containerRef: React.RefObject<HTMLDivElement | null>,
  mainContentRef?: React.RefObject<HTMLDivElement | null>,
) {
  // 侧边栏显示状态 - 初始时在桌面端显示，移动端隐藏
  const [showPageSelector, setShowPageSelector] = React.useState(true);
  const [showLeftSidebar, setShowLeftSidebar] = React.useState(true);
  const [showRightSidebar, setShowRightSidebar] = React.useState(true);
  const [isMobileMode, setIsMobileMode] = React.useState(false);
  const [hasHorizontalScroll, setHasHorizontalScroll] = React.useState(false);

  // 检测主要显示区域是否有水平滚动
  const checkHorizontalScroll = React.useCallback(() => {
    if (!mainContentRef?.current) return false;

    const mainContent = mainContentRef.current;
    // 检查是否有水平滚动：scrollWidth > clientWidth
    const hasScroll = mainContent.scrollWidth > mainContent.clientWidth;
    setHasHorizontalScroll(hasScroll);

    return hasScroll;
  }, [mainContentRef]);

  // 页面初始时的一次性检查
  React.useEffect(() => {
    if (!containerRef.current) return;

    const handleInitialCheck = () => {
      if (containerRef.current) {
        const isMobile = containerRef.current.offsetWidth < 768;
        setIsMobileMode(isMobile);

        // 检测水平滚动
        const hasScroll = checkHorizontalScroll();

        if (isMobile || hasScroll) {
          // 小屏幕时或有水平滚动时隐藏侧边栏
          setShowPageSelector(false);
          setShowLeftSidebar(false);
          setShowRightSidebar(false);
        } else {
          // 桌面端且无水平滚动时显示侧边栏
          setShowPageSelector(true);
          setShowLeftSidebar(true);
          setShowRightSidebar(true);
        }
      }
    };

    // 延迟执行初始检查，确保DOM完全渲染
    const timer = setTimeout(handleInitialCheck, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [containerRef, mainContentRef, checkHorizontalScroll]);

  // 监听容器大小变化，仅用于移动端检测
  React.useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = () => {
      if (containerRef.current) {
        const isMobile = containerRef.current.offsetWidth < 768;
        setIsMobileMode(isMobile);

        // 只在移动端模式变化时调整侧边栏
        if (isMobile) {
          setShowPageSelector(false);
          setShowLeftSidebar(false);
          setShowRightSidebar(false);
        } else {
          // 桌面端时，保持初始检查的结果，不自动显示侧边栏
          // 用户可以通过手动操作来显示侧边栏
        }
      }
    };

    // 使用 ResizeObserver 监听容器大小变化
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

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
    hasHorizontalScroll,
    checkHorizontalScroll,
  };
}
