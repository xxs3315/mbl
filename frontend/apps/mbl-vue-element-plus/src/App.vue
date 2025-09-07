<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElContainer, ElAside, ElMain } from 'element-plus'
import HelloWorld from './components/HelloWorld.vue'
import MixBoxLayoutWrapper from './components/MixBoxLayoutWrapper.vue'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import ThemeProvider from './providers/ThemeProvider.vue'

import { contents } from "@xxs3315/mbl-lib-example-data";
import "@xxs3315/mbl-lib/index.css";

// 响应式数据
const currentTheme = ref<'light' | 'dark'>('light');
const mixBoxRef = ref<InstanceType<typeof MixBoxLayoutWrapper>>();
const sidebarCollapsed = ref(false);

// 组件挂载后的处理
onMounted(() => {
  console.log('Vue应用已挂载，MixBoxLayout组件已准备就绪');
});

// 处理主题变化
const handleThemeChange = (theme: 'light' | 'dark') => {
  currentTheme.value = theme;
  console.log('主题已切换为:', theme);
};

// 处理内容更新
const handleContentUpdate = (content: any) => {
  console.log('内容已更新:', content);
};

// 全局控制方法
const toggleGlobalTheme = () => {
  if (mixBoxRef.value) {
    mixBoxRef.value.toggleTheme();
  }
};

const resetGlobalContent = () => {
  if (mixBoxRef.value) {
    mixBoxRef.value.resetContent();
  }
};

const exportGlobalContent = () => {
  if (mixBoxRef.value) {
    mixBoxRef.value.exportContent();
  }
};

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

</script>

<template>
  <ThemeProvider>
    <ElContainer class="app-container" direction="vertical">
      <!-- 头部区域 -->
      <AppHeader :collapsed="sidebarCollapsed" @toggle-sidebar="toggleSidebar" />
      
      <ElContainer>
        <!-- 侧边栏 -->
        <ElAside 
          :width="sidebarCollapsed ? '64px' : '280px'"
          class="app-aside"
        >
          <AppSidebar 
            :collapsed="sidebarCollapsed"
            @reset="resetGlobalContent"
            @export="exportGlobalContent"
          />
        </ElAside>
        
        <!-- 主要内容区域 -->
        <ElMain class="app-main">
          <div class="main-content">

            
            <!-- MixBoxLayout组件容器 -->
            <MixBoxLayoutWrapper 
              ref="mixBoxRef"
              id="vue-mixbox-layout"
              title="MixBoxLayout 组件 (通过 veaury 集成)"
              :initial-content="contents"
              :theme="currentTheme"
              height="600px"
              @theme-change="handleThemeChange"
              @content-update="handleContentUpdate"
            />
          </div>
        </ElMain>
      </ElContainer>
    </ElContainer>
  </ThemeProvider>
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
}

.main-content {
  height: 100%;
  padding: 16px;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-aside {
    position: fixed;
    top: 60px;
    left: 0;
    height: calc(100vh - 60px);
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .app-aside:not(.collapsed) {
    transform: translateX(0);
  }
  
  .main-content {
    padding: 12px;
  }
}
</style>
