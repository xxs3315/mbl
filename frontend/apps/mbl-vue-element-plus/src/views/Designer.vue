<template>
  <div class="designer-page">
    <MixBoxLayoutWrapper 
      ref="mixBoxRef"
      id="vue-mixbox-layout"
      title="MixBoxLayout 设计器"
      :initial-content="contents"
      :theme="currentTheme.value"
      height="100%"
      :base-url="appBaseUrl"
      @theme-change="handleThemeChange"
      @content-update="handleContentUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import MixBoxLayoutWrapper from '../components/MixBoxLayoutWrapper.vue'
import { contents } from "@xxs3315/mbl-lib-example-data"
import "@xxs3315/mbl-lib/index.css"
import type { ThemeVariant } from '../theme'

const appBaseUrl = import.meta.env.VITE_APP_BASE_URL;
console.log("appBaseUrl", appBaseUrl);

// 注入主题上下文
const themeContext = inject('theme') as {
  currentTheme: { value: ThemeVariant }
  setTheme: (theme: ThemeVariant) => void
}

const { currentTheme } = themeContext

// 响应式数据
const mixBoxRef = ref<InstanceType<typeof MixBoxLayoutWrapper>>()

// 组件挂载后的处理
onMounted(() => {
  console.log('Designer 页面已挂载，MixBoxLayout组件已准备就绪')
})

// 处理主题变化
const handleThemeChange = (theme: ThemeVariant) => {
  themeContext.setTheme(theme);
  console.log('主题已切换为:', theme);
}

// 处理内容更新
const handleContentUpdate = (content: any) => {
  console.log('内容已更新:', content)
}

// 暴露方法给父组件使用
defineExpose({
  toggleTheme: () => {
    // 直接调用主题上下文的切换方法
    const themes: ('blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal')[] = ['blue', 'green', 'purple', 'orange', 'red', 'teal'];
    const currentIndex = themes.indexOf(currentTheme.value);
    const nextIndex = (currentIndex + 1) % themes.length;
    themeContext.setTheme(themes[nextIndex]);
  },
  resetContent: () => {
    if (mixBoxRef.value) {
      mixBoxRef.value.resetContent();
    }
  },
  exportContent: () => {
    if (mixBoxRef.value) {
      mixBoxRef.value.exportContent();
    }
  }
});
</script>

<style scoped>
.designer-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>