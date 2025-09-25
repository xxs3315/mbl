<template>
  <div class="app-sidebar" :class="{ collapsed, 'mobile-sidebar': isMobile }" :style="{padding: collapsed ? 0 : '16px'}">
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="isMobile ? false : collapsed"
      @select="handleMenuSelect"
    >
      <el-menu-item index="designer">
        <el-icon class="menu-icon"><Edit /></el-icon>
        <template #title v-if="!collapsed || isMobile">MBL Designer</template>
      </el-menu-item>
      
      <el-menu-item index="about">
        <el-icon class="menu-icon"><Document /></el-icon>
        <template #title v-if="!collapsed || isMobile">About</template>
      </el-menu-item>
    </el-menu>
    
    <div class="sidebar-footer" v-if="!collapsed || isMobile">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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

// 路由
const route = useRoute()
const router = useRouter()

// 菜单路由映射
const menuRoutes: Record<string, string> = {
  'designer': '/',
  'about': '/about',
}

// 当前激活的菜单
const activeMenu = computed(() => {
  const currentRoute = route.meta?.menuKey as string
  return currentRoute || 'designer'
})

// 菜单选择处理
const handleMenuSelect = (index: string) => {
  const targetRoute = menuRoutes[index]
  if (targetRoute) {
    router.push(targetRoute)
  }
  console.log('选择菜单:', index, '跳转到:', targetRoute)
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
