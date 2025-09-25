<template>
  <div class="about-page">
    <el-container>
      <el-main style="overflow-x: hidden; padding: 0;">
        <!-- 页面标题 -->
        <div class="page-header">
          <div class="header-content">
            <h1 class="page-title">MixBoxLayout PDF Vue 应用</h1>
            <p class="page-subtitle">基于 Vue 3 + Element Plus + TypeScript 的现代化PDF布局设计工具</p>
          </div>
        </div>

        <!-- 主要特性 -->
        <el-row :gutter="20" class="features-section">
          <el-col :span="24" :md="8">
            <el-card class="feature-card" shadow="hover">
              <div class="feature-content">
                <div class="feature-icon" style="color: #409eff">
                  <el-icon :size="24"><PictureRounded /></el-icon>
                </div>
                <h3>可视化设计</h3>
                <p class="feature-description">
                  通过直观的拖拽操作，快速创建复杂的页面布局。支持多种组件类型，满足不同设计需求。
                </p>
              </div>
            </el-card>
          </el-col>

          <el-col :span="24" :md="8">
            <el-card class="feature-card" shadow="hover">
              <div class="feature-content">
                <div class="feature-icon" style="color: #67c23a">
                  <el-icon :size="24"><Monitor /></el-icon>
                </div>
                <h3>响应式布局</h3>
                <p class="feature-description">
                  自动适配不同屏幕尺寸，确保在各种设备上都能完美显示。支持移动端和桌面端优化。
                </p>
              </div>
            </el-card>
          </el-col>

          <el-col :span="24" :md="8">
            <el-card class="feature-card" shadow="hover">
              <div class="feature-content">
                <div class="feature-icon" style="color: #e6a23c">
                  <el-icon :size="24"><Operation /></el-icon>
                </div>
                <h3>插件系统</h3>
                <p class="feature-description">
                  强大的插件系统，支持自定义组件和功能扩展。轻松集成第三方组件库。
                </p>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 技术栈 -->
        <el-card class="tech-stack-card" shadow="never">
          <template #header>
            <div class="card-header">
              <h2>技术栈</h2>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="24" :md="12">
              <div class="tech-stack-content">
                <div class="tech-item">
                  <div class="tech-icon" style="color: #42b883">
                    <el-icon :size="20"><ChromeFilled /></el-icon>
                  </div>
                  <div class="tech-info">
                    <h4>Vue 3</h4>
                    <p class="tech-description">渐进式 JavaScript 框架，提供更好的性能和开发体验</p>
                  </div>
                </div>
                <div class="tech-item">
                  <div class="tech-icon" style="color: #409eff">
                    <el-icon :size="20"><Document /></el-icon>
                  </div>
                  <div class="tech-info">
                    <h4>TypeScript</h4>
                    <p class="tech-description">类型安全的 JavaScript，提供更好的开发体验</p>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="24" :md="12">
              <div class="tech-stack-content">
                <div class="tech-item">
                  <div class="tech-icon" style="color: #409eff">
                    <el-icon :size="20"><MagicStick /></el-icon>
                  </div>
                  <div class="tech-info">
                    <h4>Element Plus</h4>
                    <p class="tech-description">为开发者、设计师和产品经理准备的基于 Vue 3 的桌面端组件库</p>
                  </div>
                </div>
                <div class="tech-item">
                  <div class="tech-icon" style="color: #646cff">
                    <el-icon :size="20"><Box /></el-icon>
                  </div>
                  <div class="tech-info">
                    <h4>Vite</h4>
                    <p class="tech-description">快速的前端构建工具，提供极速的开发体验</p>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- 主要功能 -->
        <el-row :gutter="20" class="features-section">
          <el-col :span="24" :md="12">
            <el-card class="features-card" shadow="never">
              <template #header>
                <div class="card-header">
                  <h3>核心功能</h3>
                </div>
              </template>
              <ul class="features-list">
                <li class="feature-item">
                  <el-icon class="feature-check"><Check /></el-icon>
                  <span>可视化拖拽设计</span>
                </li>
                <li class="feature-item">
                  <el-icon class="feature-check"><Check /></el-icon>
                  <span>丰富的组件库</span>
                </li>
                <li class="feature-item">
                  <el-icon class="feature-check"><Check /></el-icon>
                  <span>实时预览功能</span>
                </li>
                <li class="feature-item">
                  <el-icon class="feature-check"><Check /></el-icon>
                  <span>响应式布局</span>
                </li>
                <li class="feature-item">
                  <el-icon class="feature-check"><Check /></el-icon>
                  <span>主题切换</span>
                </li>
                <li class="feature-item">
                  <el-icon class="feature-check"><Check /></el-icon>
                  <span>撤销/重做操作</span>
                </li>
              </ul>
            </el-card>
          </el-col>

          <el-col :span="24" :md="12">
            <el-card class="features-card" shadow="never">
              <template #header>
                <div class="card-header">
                  <h3>高级特性</h3>
                </div>
              </template>
              <ul class="features-list">
                <li class="feature-item">
                  <el-icon class="feature-check"><Check /></el-icon>
                  <span>多页面管理</span>
                </li>
                <li class="feature-item">
                  <el-icon class="feature-check"><Check /></el-icon>
                  <span>PDF 导出</span>
                </li>
                <li class="feature-item">
                  <el-icon class="feature-check"><Check /></el-icon>
                  <span>插件系统</span>
                </li>
                <li class="feature-item">
                  <el-icon class="feature-check"><Check /></el-icon>
                  <span>国际化支持</span>
                </li>
                <li class="feature-item">
                  <el-icon class="feature-check"><Check /></el-icon>
                  <span>数据绑定</span>
                </li>
                <li class="feature-item">
                  <el-icon class="feature-check"><Check /></el-icon>
                  <span>自定义主题</span>
                </li>
              </ul>
            </el-card>
          </el-col>
        </el-row>

        <!-- 项目信息 -->
        <el-card class="project-info-card" shadow="never">
          <template #header>
            <div class="card-header">
              <h2>项目信息</h2>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="24" :md="8">
              <div class="info-item">
                <el-tag type="primary" size="large">Vue 3</el-tag>
                <p class="info-description">基于最新的 Vue 3 框架构建</p>
              </div>
            </el-col>
            <el-col :span="24" :md="8">
              <div class="info-item">
                <el-tag type="success" size="large">TypeScript</el-tag>
                <p class="info-description">TypeScript 开发，类型安全</p>
              </div>
            </el-col>
            <el-col :span="24" :md="8">
              <div class="info-item">
                <el-tag type="warning" size="large">Element Plus</el-tag>
                <p class="info-description">使用 Element Plus 组件库</p>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- 操作按钮 -->
        <div class="actions-section">
          <el-space>
            <el-button type="primary" size="large" @click="goToDesigner">
              <el-icon><MagicStick /></el-icon>
              开始设计
            </el-button>
            <el-button type="info" size="large" @click="viewSource">
              <el-icon><Link /></el-icon>
              查看源码
            </el-button>
          </el-space>
        </div>

        <!-- 页脚信息 -->
        <div class="page-footer">
          <p class="footer-text">© 2024 MixBoxLayout Vue 应用. 基于 Vue 3 + Element Plus + TypeScript 构建.</p>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import {
  PictureRounded,
  Monitor,
  Operation,
  ChromeFilled,
  Document,
  MagicStick,
  Box,
  Check,
  Link
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDesigner = () => {
  router.push('/')
}

const viewSource = () => {
  window.open('https://github.com/your-username/mbl', '_blank')
}
</script>

<style scoped>
.about-page {
  padding: 15px;
  margin: 0 auto;
  height: 100%;
  overflow-y: auto;
}

.page-header {
  text-align: center;
  margin-bottom: 25px;
  padding: 15px 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 12px;
}

.page-subtitle {
  font-size: 1rem;
  color: #606266;
  margin: 0 auto;
}

.features-section {
  margin-bottom: 0;
}

.feature-card {
  height: 100%;
  border-radius: 8px;
}

.feature-content {
  text-align: center;
  padding: 15px;
}

.feature-icon {
  margin-bottom: 12px;
}

.feature-description {
  color: #606266;
  font-size: 0.85rem;
  line-height: 1.5;
}

.tech-stack-card,
.features-card,
.project-info-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-header {
  text-align: center;
}

.tech-stack-content {
  padding: 15px 0;
}

.tech-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 18px;
}

.tech-icon {
  margin-right: 12px;
  margin-top: 2px;
}

.tech-info h4 {
  margin-bottom: 6px;
  font-weight: 600;
}

.tech-description {
  color: #606266;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.feature-check {
  color: #67c23a;
  margin-right: 8px;
  font-size: 0.9rem;
}

.info-item {
  text-align: center;
  padding: 15px 0;
}

.info-description {
  color: #606266;
  margin-top: 10px;
  font-size: 0.85rem;
}

.actions-section {
  text-align: center;
  margin: 25px 0;
}

.page-footer {
  text-align: center;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.footer-text {
  color: #909399;
  font-size: 0.85rem;
  margin: 0;
}

@media (max-width: 768px) {
  .about-page {
    padding: 10px;
  }
  
  .page-title {
    font-size: 1.7rem;
  }
  
  .page-subtitle {
    font-size: 0.95rem;
  }
  
  .feature-content {
    padding: 12px;
  }
  
  .tech-item {
    margin-bottom: 15px;
  }
  
  .actions-section {
    margin: 20px 0;
  }
}
</style>