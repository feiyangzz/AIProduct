<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">团队成员</h2>
    </div>

    <div v-loading="loading" class="team-grid">
      <el-card v-for="member in members" :key="member.id" shadow="hover" class="member-card">
        <div class="member-avatar">
          <el-avatar :size="64" :src="member.avatar" />
        </div>
        <div class="member-info">
          <h3>{{ member.name }}</h3>
          <p class="member-role">{{ member.role }}</p>
          <p class="member-email">
            <el-icon><Message /></el-icon>
            {{ member.email }}
          </p>
          <p class="member-username">@{{ member.username }}</p>
        </div>
        <div class="member-stats">
          <div class="stat-item">
            <span class="stat-num">{{ getTaskCount(member.id) }}</span>
            <span class="stat-text">负责任务</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">{{ getProjectCount(member.id) }}</span>
            <span class="stat-text">参与项目</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { teamApi } from '@/api'
import { useProjectStore } from '@/stores/project'
import { useTaskStore } from '@/stores/task'
import type { User } from '@/types'

const projectStore = useProjectStore()
const taskStore = useTaskStore()

const members = ref<User[]>([])
const loading = ref(false)

function getTaskCount(userId: number) {
  return taskStore.tasks.filter((t) => t.assigneeId === userId).length
}

function getProjectCount(userId: number) {
  return projectStore.projects.filter((p) => p.memberIds.includes(userId)).length
}

onMounted(async () => {
  loading.value = true
  try {
    const [teamData] = await Promise.all([
      teamApi.getMembers(),
      projectStore.fetchProjects(),
      taskStore.fetchTasks(),
    ])
    members.value = teamData
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.member-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
}

.member-avatar {
  margin-bottom: 16px;
}

.member-info {
  text-align: center;
  margin-bottom: 16px;
}

.member-info h3 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 4px;
}

.member-role {
  font-size: 14px;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.member-email {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}

.member-username {
  font-size: 12px;
  color: #c0c4cc;
}

.member-stats {
  display: flex;
  gap: 32px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  width: 100%;
  justify-content: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
}

.stat-text {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
