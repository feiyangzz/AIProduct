<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">团队成员</h2>
    </div>

    <el-row :gutter="20" v-loading="loading">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="member in members" :key="member.id">
        <el-card shadow="hover" class="member-card">
          <div class="member-avatar">
            <el-avatar :size="64">{{ member.name.charAt(0) }}</el-avatar>
          </div>
          <div class="member-info">
            <h3>{{ member.name }}</h3>
            <p class="member-email">{{ member.email }}</p>
            <el-tag :type="roleTagType(member.role)" size="small">
              {{ USER_ROLE_MAP[member.role] }}
            </el-tag>
          </div>
          <div class="member-stats">
            <div class="stat">
              <span class="stat-num">{{ getTaskCount(member.id) }}</span>
              <span class="stat-text">任务</span>
            </div>
            <div class="stat">
              <span class="stat-num">{{ getProjectCount(member.id) }}</span>
              <span class="stat-text">项目</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { memberApi, projectApi, taskApi } from '@/api'
import { USER_ROLE_MAP } from '@/constants'
import type { Project, Task, User } from '@/types'

const loading = ref(false)
const members = ref<User[]>([])
const tasks = ref<Task[]>([])
const projects = ref<Project[]>([])

function roleTagType(role: string) {
  const map: Record<string, '' | 'success' | 'warning' | 'danger'> = {
    admin: 'danger',
    manager: 'warning',
    member: '',
  }
  return map[role] ?? ''
}

function getTaskCount(memberId: number) {
  return tasks.value.filter((t) => t.assigneeId === memberId).length
}

function getProjectCount(memberId: number) {
  return projects.value.filter((p) => p.memberIds.includes(memberId)).length
}

onMounted(async () => {
  loading.value = true
  try {
    const [memberRes, taskRes, projectRes] = await Promise.all([
      memberApi.getList(),
      taskApi.getList({ page: 1, pageSize: 100 }),
      projectApi.getList({ page: 1, pageSize: 100 }),
    ])
    members.value = memberRes.data
    tasks.value = taskRes.data.list
    projects.value = projectRes.data.list
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.member-card {
  margin-bottom: 20px;
  text-align: center;
}

.member-avatar {
  margin-bottom: 12px;
}

.member-info h3 {
  font-size: 16px;
  color: #303133;
  margin-bottom: 4px;
}

.member-email {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.member-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-text {
  font-size: 12px;
  color: #909399;
}
</style>
