<template>
  <div class="mixbox-wrapper">
    <div class="mixbox-content" :style="{ height: height }">
      <VueMixBoxLayout 
        v-bind="mixBoxProps"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { applyReactInVue } from 'veaury'
import { MixBoxLayout } from "@xxs3315/mbl-lib";
import { contents } from "@xxs3315/mbl-lib-example-data";
import { tablePlugin } from "@xxs3315/mbl-lib-plugin-table";

// Props定义
interface Props {
  id?: string;
  title?: string;
  initialContent?: any;
  theme?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal';
  width?: string | number;
  height?: string | number;
  baseUrl?: string;
  imageUploadPath?: string;
  imageDownloadPath?: string;
  pdfGeneratePath?: string;
  plugins?: Array<{ metadata: any; plugin: any }>;
  enablePluginSystem?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  id: 'mixbox-layout',
  title: 'MixBoxLayout 组件',
  initialContent: () => contents,
  theme: 'blue',
  width: '100%',
  height: '600px',
  baseUrl: undefined,
  imageUploadPath: undefined,
  imageDownloadPath: undefined,
  pdfGeneratePath: undefined,
  plugins: () => [{
    metadata: tablePlugin.metadata,
    plugin: tablePlugin,
  }],
  enablePluginSystem: true
});

// Emits定义
const emit = defineEmits<{
  'content-update': [content: any];
  'theme-change': [theme: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal'];
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
  contents: currentContent.value,
  onContentChange: handleContentUpdate,  // 添加 onContentChange 回调
  theme: currentTheme.value,
  baseUrl: props.baseUrl || "http://localhost:28080",
  imageUploadPath: props.imageUploadPath || "/api/images/upload",
  pdfGeneratePath: props.imageUploadPath || "/api/pdf/generate",
  plugins: props.plugins,
  enablePluginSystem: props.enablePluginSystem
}));

// 方法
const toggleTheme = () => {
  // 循环切换颜色主题
  const themes: ('blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal')[] = ['blue', 'green', 'purple', 'orange', 'red', 'teal'];
  const currentIndex = themes.indexOf(currentTheme.value);
  const nextIndex = (currentIndex + 1) % themes.length;
  currentTheme.value = themes[nextIndex];
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
  console.log('MixBoxLayoutWrapper 接收到内容变化:', newContent);
  // 由于vue双向绑定的原因，这里不能修改currentContent.value，如果改变了，MixBoxLayout内部会new出新的store，导致state出问题。
  // 这里可以视作，拿到了最新修改后的contents
  // currentContent.value = newContent;
  emit('content-update', newContent);
};

// 监听props变化
watch(() => props.theme, (newTheme) => {
  console.log('MixBoxLayoutWrapper 接收到主题变化:', newTheme);
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
  height: 100%;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
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
  flex: 1;
  min-height: 0;
  min-width: 0;
  height: 100%;
  width: 100%;
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
