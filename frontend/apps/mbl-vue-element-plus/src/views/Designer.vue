<template>
  <div class="designer-page">
    <MixBoxLayoutWrapper 
      ref="mixBoxRef"
      id="vue-mixbox-layout"
      title="MixBoxLayout 设计器"
      :initial-content="contents"
      :theme="currentTheme"
      height="100%"
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
  themeContext.setTheme(theme)
  console.log('主题已切换为:', theme)
}

// 处理内容更新
const handleContentUpdate = (content: any) => {
  console.log('内容已更新:', content)
}

// 暴露方法给父组件使用
defineExpose({
  toggleTheme: () => {
    if (mixBoxRef.value) {
      mixBoxRef.value.toggleTheme()
    }
  },
  resetContent: () => {
    if (mixBoxRef.value) {
      mixBoxRef.value.resetContent()
    }
  },
  exportContent: () => {
    if (mixBoxRef.value) {
      mixBoxRef.value.exportContent()
    }
  }
})
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