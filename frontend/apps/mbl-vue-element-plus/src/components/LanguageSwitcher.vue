<template>
  <el-dropdown @command="handleCommand" trigger="click">
    <el-button type="text" class="language-switcher">
      <el-icon><Flag /></el-icon>
      <span class="language-text">{{ currentLocaleText }}</span>
      <el-icon class="el-icon--right"><ArrowDown /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item 
          command="zh-CN" 
          :class="{ 'is-active': currentLocale === 'zh-CN' as any }"
        >
          <span class="flag">🇨🇳</span>
          中文
        </el-dropdown-item>
        <el-dropdown-item 
          command="en-US" 
          :class="{ 'is-active': currentLocale === 'en-US' as any }"
        >
          <span class="flag">🇺🇸</span>
          English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, ElIcon } from 'element-plus'
import { Flag, ArrowDown } from '@element-plus/icons-vue'
import type { SupportedLocale } from '../utils/locale-detector'
import { useLocale } from '../composables/useLocale'

// 使用语言 composable
const { currentLocale, setLocale } = useLocale()

// 当前语言显示文本
const currentLocaleText = computed(() => {
  return currentLocale.value === 'zh-CN' ? '中文' : 'English'
})

// 处理语言切换
const handleCommand = (command: string) => {
  const locale = command as SupportedLocale
  setLocale(locale)
  console.log('Vue LanguageSwitcher: 语言切换为', locale)
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background: var(--el-bg-color);
  color: var(--el-text-color-primary);
  transition: all 0.3s ease;
}

.language-switcher:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.language-text {
  font-size: 14px;
  font-weight: 500;
}

.flag {
  margin-right: 8px;
  font-size: 16px;
}

.is-active {
  color: var(--el-color-primary);
  font-weight: 600;
}

.is-active::after {
  content: '✓';
  margin-left: 8px;
  color: var(--el-color-primary);
}
</style>
