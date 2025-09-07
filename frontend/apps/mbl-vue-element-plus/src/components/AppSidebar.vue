<template>
  <div class="app-sidebar" :class="{ collapsed, 'mobile-sidebar': isMobile }">
    <div class="sidebar-header" v-if="!collapsed || isMobile">
      <h3>导航菜单</h3>
      <!-- 移动端关闭按钮 -->
      <el-button 
        v-if="isMobile"
        :icon="Close"
        @click="handleCloseMobile"
        circle
        size="small"
        class="mobile-close-btn"
      />
    </div>
    
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="isMobile ? false : collapsed"
      @select="handleMenuSelect"
    >
      <el-menu-item index="designer">
        <el-icon class="menu-icon"><Edit /></el-icon>
        <template #title v-if="!collapsed || isMobile">设计器</template>
      </el-menu-item>
      
      <el-menu-item index="templates">
        <el-icon class="menu-icon"><Document /></el-icon>
        <template #title v-if="!collapsed || isMobile">模板库</template>
      </el-menu-item>
      
      <el-menu-item index="components">
        <el-icon class="menu-icon"><Grid /></el-icon>
        <template #title v-if="!collapsed || isMobile">组件库</template>
      </el-menu-item>
      
      <el-menu-item index="assets">
        <el-icon class="menu-icon"><Picture /></el-icon>
        <template #title v-if="!collapsed || isMobile">资源管理</template>
      </el-menu-item>
      
      <el-sub-menu index="settings" v-if="!collapsed || isMobile">
        <template #title>
          <el-icon class="menu-icon"><Setting /></el-icon>
          <span>设置</span>
        </template>
        <el-menu-item index="settings-theme">
          <el-icon class="menu-icon"><Orange /></el-icon>
          <span>主题设置</span>
        </el-menu-item>
        <el-menu-item index="settings-export">
          <el-icon class="menu-icon"><Download /></el-icon>
          <span>导出设置</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
    
    <div class="sidebar-footer" v-if="!collapsed || isMobile">
      <el-button 
        type="primary" 
        :icon="Refresh"
        @click="handleReset"
        size="small"
      >
        重置内容
      </el-button>
      <el-button 
        type="success" 
        :icon="Download"
        @click="handleExport"
        size="small"
      >
        导出内容
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Edit,
  Document,
  Grid,
  Picture,
  Setting,
  Orange,
  Download,
  Refresh,
  Close
} from '@element-plus/icons-vue'

// Props
interface Props {
  collapsed?: boolean
  isMobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  isMobile: false
})

// Emits
const emit = defineEmits<{
  reset: []
  export: []
  'close-mobile': []
}>()

// 当前激活的菜单
const activeMenu = ref('designer')

// 菜单选择处理
const handleMenuSelect = (index: string) => {
  activeMenu.value = index
  console.log('选择菜单:', index)
}

// 重置内容
const handleReset = () => {
  console.log('重置内容')
  emit('reset')
}

// 导出内容
const handleExport = () => {
  console.log('导出内容')
  emit('export')
}

// 关闭移动端侧边栏
const handleCloseMobile = () => {
  emit('close-mobile')
}
</script>

<style scoped>
.app-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color);
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-header h3 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 600;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--el-border-color);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-footer .el-button {
  width: 100%;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 32px !important;
  line-height: 1 !important;
  margin-left: 0 !important;
}

.sidebar-footer .el-button + .el-button {
  margin-left: 0 !important;
}

.sidebar-footer .el-button .el-icon {
  margin-right: 4px !important;
  vertical-align: middle !important;
}

.sidebar-footer .el-button span {
  vertical-align: middle !important;
  line-height: 1 !important;
}

.menu-icon {
  font-size: 16px !important;
  width: 16px !important;
  height: 16px !important;
}

/* 移动端样式 */
.mobile-close-btn {
  margin-left: auto;
}

.mobile-sidebar {
  /* 移动端侧边栏特殊样式 */
}
</style>
