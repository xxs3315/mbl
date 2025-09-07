<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import MixBoxLayoutWrapper from './components/MixBoxLayoutWrapper.vue'

import { contents } from "@xxs3315/mbl-lib-example-data";
import "@xxs3315/mbl-lib/index.css";

// 响应式数据
const currentTheme = ref<'light' | 'dark'>('light');
const mixBoxRef = ref<InstanceType<typeof MixBoxLayoutWrapper>>();

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

</script>

<template>
  <div class="app-container">
    <!-- 头部区域 -->
    <header class="app-header">
      <div class="logo-section">
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
          <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
      </div>
      
      <!-- 控制按钮 -->
      <div class="controls">
        <button @click="toggleGlobalTheme" class="control-btn theme-btn">
          {{ currentTheme === 'light' ? '🌙' : '☀️' }} 全局主题 ({{ currentTheme }})
        </button>
        <button @click="resetGlobalContent" class="control-btn reset-btn">
          🔄 重置内容
        </button>
        <button @click="exportGlobalContent" class="control-btn export-btn">
          📤 导出内容
        </button>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="app-main">
      <HelloWorld msg="Vite + Vue + MixBoxLayout" />
      
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
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.logo-section {
  display: flex;
  gap: 1rem;
}

.logo {
  height: 3em;
  padding: 0.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.control-btn:hover {
  background: #f5f5f5;
  border-color: #bbb;
}

.theme-btn:hover {
  background: #e3f2fd;
  border-color: #2196f3;
}

.reset-btn:hover {
  background: #fff3e0;
  border-color: #ff9800;
}

.export-btn:hover {
  background: #e8f5e8;
  border-color: #4caf50;
}

.app-main {
  flex: 1;
  padding: 2rem;
}

/* 移除旧的mixbox-container样式，现在由MixBoxLayoutWrapper组件处理 */

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .app-main {
    padding: 1rem;
  }
  
  .logo {
    height: 2em;
  }
}
</style>
