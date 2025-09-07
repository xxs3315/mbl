<template>
  <slot />
</template>

<script setup lang="ts">
import { provide, ref, watch, onMounted } from 'vue'
import { getCurrentTheme, saveTheme, applyTheme, type ThemeVariant } from '../theme'

// 主题状态
const currentTheme = ref<ThemeVariant>(getCurrentTheme())

// 主题切换函数
const setTheme = (theme: ThemeVariant) => {
  currentTheme.value = theme
  saveTheme(theme)
  applyTheme(theme)
}

// 监听主题变化
watch(currentTheme, (newTheme) => {
  applyTheme(newTheme)
}, { immediate: true })

// 组件挂载时应用主题
onMounted(() => {
  applyTheme(currentTheme.value)
})

// 提供主题上下文
provide('theme', {
  currentTheme,
  setTheme
})
</script>
