<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">仪表盘</h2>
    </div>

    <el-row :gutter="20" v-loading="loading">
      <el-col :xs="24" :sm="12" :lg="8" :xl="4" v-for="stat in statCards" :key="stat.label">
        <el-card shadow="hover" class="stat-card" style="margin-bottom: 20px">
          <div class="stat-content">
            <el-icon :size="36" :color="stat.color"><component :is="stat.icon" /></el-icon>
            <div>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :lg="14">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>最近项目</span>
              <el-button type="primary" link @click="$router.push('/projects')">查看全部</el-button>
            </div>
          </template>
          <el-table :data="recentProjects" stripe>
            <el-table-column prop="name" label="项目名称" min-width="160" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="PROJECT_STATUS_MAP[row.status]?.type" size="small">
                  {{ PROJECT_STATUS_MAP[row.status]?.label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="progress" label="进度" width="140">
              <template #default="{ row }">
                <el-progress :percentage="row.progress" :stroke-width="8" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="10">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>待办任务</span>
              <el-button type="primary" link @click="$router.push('/tasks')">查看全部</el-button>
            </div>
          </template>
          <div v-if="pendingTasks.length === 0" class="empty-tip">暂无待办任务</div>
          <div v-else class="task-list">
            <div v-for="task in pendingTasks" :key="task.id" class="task-item">
              <div class="task-info">
                <span class="task-title">{{ task.title }}</span>
                <el-tag :type="TASK_PRIORITY_MAP[task.priority]?.type" size="small">
                  {{ TASK_PRIORITY_MAP[task.priority]?.label }}
                </el-tag>
              </div>
              <span class="task-due">{{ task.dueDate || '无截止日期' }}</span>
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
import { PROJECT_STATUS_MAP, TASK_PRIORITY_MAP } from '@/constants'
import type { DashboardStats } from '@/types'

const projectStore = useProjectStore()
const taskStore = useTaskStore()
const loading = ref(false)
const stats = ref<DashboardStats | null>(null)

const statCards = computed(() => [
  { label: '项目总数', value: stats.value?.totalProjects ?? 0, icon: 'Folder', color: '#409eff' },
  { label: '进行中', value: stats.value?.activeProjects ?? 0, icon: 'Loading', color: '#67c23a' },
  { label: '任务总数', value: stats.value?.totalTasks ?? 0, icon: 'List', color: '#e6a23c' },
  { label: '已完成', value: stats.value?.completedTasks ?? 0, icon: 'CircleCheck', color: '#67c23a' },
  { label: '团队成员', value: stats.value?.teamMembers ?? 0, icon: 'User', color: '#909399' },
  { label: '逾期任务', value: stats.value?.overdueTasks ?? 0, icon: 'Warning', color: '#f56c6c' },
])

const recentProjects = computed(() => projectStore.projects.slice(0, 5))
const pendingTasks = computed(() =>
  taskStore.tasks.filter((t) => t.status === 'todo' || t.status === 'in_progress').slice(0, 6),
)

onMounted(async () => {
  loading.value = true
  try {
    const [statsRes] = await Promise.all([
      dashboardApi.getStats(),
      projectStore.fetchProjects({ page: 1, pageSize: 5 }),
      taskStore.fetchTasks({ page: 1, pageSize: 20 }),
    ])
    stats.value = statsRes.data
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.task-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-title {
  font-size: 14px;
  color: #303133;
}

.task-due {
  font-size: 12px;
  color: #909399;
}

.empty-tip {
  text-align: center;
  color: #909399;
  padding: 20px 0;
}
</style>
