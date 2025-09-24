<template>
  <slot />
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import { detectBrowserLocale, type SupportedLocale } from '../utils/locale-detector'

// 语言状态
const currentLocale = ref<SupportedLocale>('zh-CN')

// 语言切换方法
const setLocale = (locale: SupportedLocale) => {
  currentLocale.value = locale
  localStorage.setItem('app-locale', locale)
  console.log('Vue LocaleProvider: 语言已切换为', locale)
}

// 初始化语言设置
const initializeLocale = () => {
  // 从 localStorage 读取保存的语言环境
  const savedLocale = localStorage.getItem('app-locale') as SupportedLocale
  const validLocales: SupportedLocale[] = ['zh-CN', 'en-US']

  // 如果有保存的语言设置，使用保存的设置
  if (savedLocale && validLocales.includes(savedLocale)) {
    currentLocale.value = savedLocale
    console.log('Vue LocaleProvider: 使用保存的语言设置', savedLocale)
  } else {
    // 否则自动检测浏览器语言
    const detectedLocale = detectBrowserLocale()
    currentLocale.value = detectedLocale
    console.log('Vue LocaleProvider: 自动检测到语言', detectedLocale)
  }
}

// 提供语言上下文
provide('locale', {
  currentLocale,
  setLocale
})

// 组件挂载时初始化
onMounted(() => {
  initializeLocale()
})
</script>
