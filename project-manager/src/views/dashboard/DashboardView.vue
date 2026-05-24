<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">仪表盘</h2>
    </div>

    <div class="card-grid" v-loading="loading">
      <el-card v-for="item in statCards" :key="item.label" shadow="hover" class="stat-card">
        <div class="stat-icon" :style="{ background: item.bg }">
          <el-icon :size="24" color="#fff"><component :is="item.icon" /></el-icon>
        </div>
        <div class="stat-value">{{ item.value }}</div>
        <div class="stat-label">{{ item.label }}</div>
      </el-card>
    </div>

    <el-row :gutter="16" style="margin-top: 20px">
      <el-col :span="14">
        <el-card shadow="never">
          <template #header>
            <span>最近项目</span>
          </template>
          <el-table :data="recentProjects" stripe>
            <el-table-column prop="name" label="项目名称" min-width="160" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }: { row: Project }">
                <el-tag :type="PROJECT_STATUS_MAP[row.status].type" size="small">
                  {{ PROJECT_STATUS_MAP[row.status].label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="progress" label="进度" width="160">
              <template #default="{ row }">
                <el-progress :percentage="row.progress" :stroke-width="8" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card shadow="never">
          <template #header>
            <span>任务状态分布</span>
          </template>
          <div class="task-stats">
            <div v-for="item in taskStatusStats" :key="item.status" class="task-stat-item">
              <div class="task-stat-bar">
                <div
                  class="task-stat-fill"
                  :style="{ width: item.percent + '%', background: item.color }"
                />
              </div>
              <div class="task-stat-info">
                <span>{{ item.label }}</span>
                <span>{{ item.count }} ({{ item.percent }}%)</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { dashboardApi } from '@/api'
import { useProjectStore } from '@/stores/project'
import { useTaskStore } from '@/stores/task'
import { PROJECT_STATUS_MAP, TASK_STATUS_MAP, TASK_STATUS_ORDER } from '@/constants'
import type { DashboardStats, Project } from '@/types'

const projectStore = useProjectStore()
const taskStore = useTaskStore()
const loading = ref(false)
const stats = ref<DashboardStats | null>(null)

const statCards = computed(() => [
  {
    label: '项目总数',
    value: stats.value?.totalProjects ?? 0,
    icon: 'Folder',
    bg: 'linear-gradient(135deg, #667eea, #764ba2)',
  },
  {
    label: '进行中项目',
    value: stats.value?.activeProjects ?? 0,
    icon: 'Loading',
    bg: 'linear-gradient(135deg, #f093fb, #f5576c)',
  },
  {
    label: '任务总数',
    value: stats.value?.totalTasks ?? 0,
    icon: 'List',
    bg: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  },
  {
    label: '已完成任务',
    value: stats.value?.completedTasks ?? 0,
    icon: 'CircleCheck',
    bg: 'linear-gradient(135deg, #43e97b, #38f9d7)',
  },
])

const recentProjects = computed(() => projectStore.projects.slice(0, 5))

const taskStatusStats = computed(() => {
  const total = taskStore.tasks.length || 1
  return TASK_STATUS_ORDER.map((status) => {
    const count = taskStore.tasks.filter((t) => t.status === status).length
    return {
      status,
      label: TASK_STATUS_MAP[status].label,
      color: TASK_STATUS_MAP[status].color,
      count,
      percent: Math.round((count / total) * 100),
    }
  })
})

onMounted(async () => {
  loading.value = true
  try {
    const [statsData] = await Promise.all([
      dashboardApi.getStats(),
      projectStore.fetchProjects(),
      taskStore.fetchTasks(),
    ])
    stats.value = statsData
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.stat-card :deep(.el-card__body) {
  position: relative;
  padding: 20px;
}

.stat-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
}

.task-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-stat-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.task-stat-bar {
  height: 8px;
  background: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
}

.task-stat-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.task-stat-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #606266;
}
</style>
