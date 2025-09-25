<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { ElContainer, ElAside, ElMain } from 'element-plus'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import ThemeProvider from './providers/ThemeProvider.vue'
import LocaleProvider from './providers/LocaleProvider.vue'

// 路由
const route = useRoute()

// 响应式数据
const sidebarCollapsed = ref(false);
const isMobile = ref(false);
const mobileSidebarVisible = ref(false);

// 动态高度计算
const windowHeight = ref(window.innerHeight);
const headerHeight = 60; // 固定头部高度
const mainContentHeight = computed(() => {
  return `${windowHeight.value - headerHeight}px`;
});

// 窗口大小变化处理
const handleResize = () => {
  windowHeight.value = window.innerHeight;
  // 检测是否为移动端 (sm breakpoint: 640px)
  isMobile.value = window.innerWidth < 640;
  
  // 如果是移动端，默认隐藏侧边栏
  if (isMobile.value) {
    mobileSidebarVisible.value = false;
  }
};

// 组件挂载后的处理
onMounted(() => {
  console.log('Vue应用已挂载');
  window.addEventListener('resize', handleResize);
  // 初始化时检测屏幕尺寸
  handleResize();
});

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 全局控制方法
const resetGlobalContent = () => {
  console.log('重置内容')
}

const exportGlobalContent = () => {
  console.log('导出内容')
}

// 切换侧边栏
const toggleSidebar = () => {
  if (isMobile.value) {
    // 移动端：切换侧边栏显示/隐藏
    mobileSidebarVisible.value = !mobileSidebarVisible.value;
  } else {
    // 桌面端：切换侧边栏折叠/展开
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }
};

// 关闭移动端侧边栏
const closeMobileSidebar = () => {
  mobileSidebarVisible.value = false;
};

// 侧边栏在所有页面都显示
const showSidebar = computed(() => {
  return true
});

</script>

<template>
  <LocaleProvider>
    <ThemeProvider>
      <ElContainer class="app-container" direction="vertical">
        <!-- 头部区域 -->
        <AppHeader 
          :collapsed="sidebarCollapsed" 
          :is-mobile="isMobile"
          :mobile-sidebar-visible="mobileSidebarVisible"
          @toggle-sidebar="toggleSidebar" 
        />
        
        <ElContainer>
          <!-- 移动端遮罩层 -->
          <div 
            v-if="isMobile && mobileSidebarVisible" 
            class="mobile-overlay"
            @click="closeMobileSidebar"
          ></div>
          
          <!-- 侧边栏 - 在所有页面都显示 -->
          <ElAside 
            :width="isMobile ? '280px' : (sidebarCollapsed ? '64px' : '280px')"
            class="app-aside"
            :class="{ 
              'mobile-visible': isMobile && mobileSidebarVisible,
              'mobile-hidden': isMobile && !mobileSidebarVisible
            }"
          >
            <AppSidebar 
              :collapsed="isMobile ? false : sidebarCollapsed"
              :is-mobile="isMobile"
              @reset="resetGlobalContent"
              @export="exportGlobalContent"
              @close-mobile="closeMobileSidebar"
            />
          </ElAside>
          
          <!-- 主要内容区域 -->
          <ElMain class="app-main" :style="{ height: mainContentHeight }">
            <div class="main-content" :style="{ height: mainContentHeight }">
              <!-- 路由视图 -->
              <router-view />
            </div>
          </ElMain>
        </ElContainer>
      </ElContainer>
    </ThemeProvider>
  </LocaleProvider>
</template>

<style scoped>
.app-container {
  height: 100vh;
}

.app-aside {
  transition: width 0.3s ease;
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color);
}

.app-main {
  background-color: var(--el-bg-color-page);
  padding: 0;
  overflow: hidden;
  width: 100%;
  min-width: 0;
}

.main-content {
  width: 100%;
  min-width: 0;
  padding: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 移动端遮罩层 */
.mobile-overlay {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
}

/* 响应式设计 - sm breakpoint (640px) */
@media (max-width: 640px) {
  .app-aside {
    position: fixed;
    top: 60px;
    left: 0;
    height: calc(100vh - 60px);
    z-index: 1000;
    width: 280px !important;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .app-aside.mobile-visible {
    transform: translateX(0);
  }
  
  .app-aside.mobile-hidden {
    transform: translateX(-100%);
  }
  
  .main-content {
    padding: 12px;
  }
}
</style>
