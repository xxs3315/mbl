<template>
  <div class="mixbox-wrapper">
    <div class="mixbox-header">
      <h3>{{ title }}</h3>
      <div class="mixbox-controls">
        <button @click="toggleTheme" class="control-btn theme-btn">
          {{ currentTheme === 'light' ? '🌙' : '☀️' }} {{ currentTheme }}
        </button>
        <button @click="resetContent" class="control-btn reset-btn">
          🔄 重置
        </button>
        <button @click="exportContent" class="control-btn export-btn">
          📤 导出
        </button>
      </div>
    </div>
    
    <div class="mixbox-content" :style="{ height: height }">
      <VueMixBoxLayout 
        v-bind="mixBoxProps"
        @update:content="handleContentUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { applyReactInVue } from 'veaury'
import { MixBoxLayout } from "@xxs3315/mbl-lib";
import { contents } from "@xxs3315/mbl-lib-example-data";

// Props定义
interface Props {
  id?: string;
  title?: string;
  initialContent?: any;
  theme?: 'light' | 'dark';
  width?: string | number;
  height?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  id: 'mixbox-layout',
  title: 'MixBoxLayout 组件',
  initialContent: () => contents,
  theme: 'light',
  width: '100%',
  height: '600px'
});

// Emits定义
const emit = defineEmits<{
  'content-update': [content: any];
  'theme-change': [theme: 'light' | 'dark'];
}>();

// 使用veaury包装React组件
const VueMixBoxLayout = applyReactInVue(MixBoxLayout, {
  useInjectPropsFromWrapper: true,
  useInjectSlotsFromWrapper: true,
});

// 响应式状态
const currentTheme = ref(props.theme);
const currentContent = ref(props.initialContent);

// 计算属性
const mixBoxProps = computed(() => ({
  id: props.id,
  content: currentContent.value,
  theme: currentTheme.value,
  width: props.width,
  height: props.height
}));

// 方法
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
  emit('theme-change', currentTheme.value);
};

const resetContent = () => {
  currentContent.value = props.initialContent;
  emit('content-update', currentContent.value);
};

const exportContent = () => {
  const dataStr = JSON.stringify(currentContent.value, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mixbox-content-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const handleContentUpdate = (newContent: any) => {
  currentContent.value = newContent;
  emit('content-update', newContent);
};

// 监听props变化
watch(() => props.theme, (newTheme) => {
  currentTheme.value = newTheme;
});

watch(() => props.initialContent, (newContent) => {
  currentContent.value = newContent;
});

// 组件挂载
onMounted(() => {
  console.log('MixBoxLayoutWrapper 组件已挂载');
});

// 暴露方法给父组件
defineExpose({
  toggleTheme,
  resetContent,
  exportContent,
  currentTheme,
  currentContent
});
</script>

<style scoped>
.mixbox-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mixbox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.mixbox-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.mixbox-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.control-btn:hover {
  background: #f5f5f5;
  border-color: #bbb;
}

.theme-btn:hover {
  background: #e3f2fd;
  border-color: #2196f3;
}

.reset-btn:hover {
  background: #fff3e0;
  border-color: #ff9800;
}

.export-btn:hover {
  background: #e8f5e8;
  border-color: #4caf50;
}

.mixbox-content {
  overflow: hidden;
  position: relative;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mixbox-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .mixbox-controls {
    justify-content: center;
  }
  
  .control-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
