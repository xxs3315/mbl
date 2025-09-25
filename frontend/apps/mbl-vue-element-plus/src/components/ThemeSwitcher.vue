<template>
  <el-dropdown trigger="click" @command="handleThemeChange">
    <el-button type="primary" :icon="Orange" circle />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item 
          v-for="(config, themeKey) in themeVariants" 
          :key="themeKey"
          :command="themeKey"
          :class="{ 'is-active': currentTheme === themeKey as any }"
        >
          <div class="theme-item">
            <div 
              class="theme-color" 
              :style="{ backgroundColor: config.primaryColor }"
            />
            <div 
              class="theme-bar"
              :style="{ backgroundColor: config.primaryColor }"
            />
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { Orange } from '@element-plus/icons-vue'
import { themeVariants, type ThemeVariant } from '../theme'

// 注入主题上下文
const themeContext = inject('theme') as {
  currentTheme: { value: ThemeVariant }
  setTheme: (theme: ThemeVariant) => void
}

const { currentTheme, setTheme } = themeContext

// 处理主题切换
const handleThemeChange = (theme: ThemeVariant) => {
  setTheme(theme)
}
</script>

<style scoped>
.theme-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 148px
}

.theme-color {
  width: 20px;
  height: 16px;
  border-radius: 50%;
}

.theme-bar {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.is-active .theme-color {
  border-color: var(--el-color-primary);
}

.is-active {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>