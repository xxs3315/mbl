<template>
  <div class="app-header">
    <div class="header-left">
      <el-button 
        :icon="collapsed ? Expand : Fold"
        @click="toggleSidebar"
        circle
        size="small"
        class="sidebar-toggle"
      />
      <div class="logo-section">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
        <img :src="vueLogo" class="logo vue" alt="Vue logo" />
        <span class="app-title">MixBoxLayout Vue</span>
      </div>
    </div>
    
    <div class="header-center">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>设计器</el-breadcrumb-item>
        <el-breadcrumb-item>当前项目</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="header-right">
      <ThemeSwitcher />
      
      <el-dropdown trigger="click">
        <el-button :icon="User" circle />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-icon class="dropdown-icon"><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon class="dropdown-icon"><Setting /></el-icon>
              系统设置
            </el-dropdown-item>
            <el-dropdown-item divided>
              <el-icon class="dropdown-icon"><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Expand,
  Fold,
  User,
  Setting,
  SwitchButton
} from '@element-plus/icons-vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import vueLogo from '../assets/vue.svg'

// Props
interface Props {
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})

// Emits
const emit = defineEmits<{
  'toggle-sidebar': []
}>()

// 切换侧边栏
const toggleSidebar = () => {
  emit('toggle-sidebar')
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 16px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-toggle {
  margin-right: 8px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo {
  height: 24px;
  width: 24px;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.app-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-left: 8px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    padding: 0 12px;
  }
  
  .header-center {
    display: none;
  }
  
  .app-title {
    display: none;
  }
  
  .logo-section {
    gap: 4px;
  }
}

.dropdown-icon {
  font-size: 16px !important;
  width: 16px !important;
  height: 16px !important;
}
</style>
