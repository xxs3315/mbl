<template>
  <div class="app-sidebar" :class="{ collapsed }">
    <div class="sidebar-header" v-if="!collapsed">
      <h3>导航菜单</h3>
    </div>
    
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="collapsed"
      @select="handleMenuSelect"
    >
      <el-menu-item index="designer">
        <el-icon class="menu-icon"><Edit /></el-icon>
        <template #title v-if="!collapsed">设计器</template>
      </el-menu-item>
      
      <el-menu-item index="templates">
        <el-icon class="menu-icon"><Document /></el-icon>
        <template #title v-if="!collapsed">模板库</template>
      </el-menu-item>
      
      <el-menu-item index="components">
        <el-icon class="menu-icon"><Grid /></el-icon>
        <template #title v-if="!collapsed">组件库</template>
      </el-menu-item>
      
      <el-menu-item index="assets">
        <el-icon class="menu-icon"><Picture /></el-icon>
        <template #title v-if="!collapsed">资源管理</template>
      </el-menu-item>
      
      <el-sub-menu index="settings" v-if="!collapsed">
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
    
    <div class="sidebar-footer" v-if="!collapsed">
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
  Refresh
} from '@element-plus/icons-vue'

// Props
interface Props {
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})

// Emits
const emit = defineEmits<{
  reset: []
  export: []
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
}

.menu-icon {
  font-size: 16px !important;
  width: 16px !important;
  height: 16px !important;
}
</style>
