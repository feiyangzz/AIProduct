<template>
  <div class="page-container" v-loading="loading">
    <div class="page-header">
      <div class="header-left">
        <el-button :icon="ArrowLeft" @click="$router.push('/projects')">返回</el-button>
        <h2 class="page-title">{{ project?.name || '项目详情' }}</h2>
      </div>
      <el-tag v-if="project" :type="PROJECT_STATUS_MAP[project.status]?.type">
        {{ PROJECT_STATUS_MAP[project.status]?.label }}
      </el-tag>
    </div>

    <el-row :gutter="20" v-if="project">
      <el-col :span="16">
        <el-card shadow="never" style="margin-bottom: 20px">
          <template #header>项目信息</template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="项目名称">{{ project.name }}</el-descriptions-item>
            <el-descriptions-item label="进度">
              <el-progress :percentage="project.progress" style="width: 200px" />
            </el-descriptions-item>
            <el-descriptions-item label="开始日期">{{ project.startDate }}</el-descriptions-item>
            <el-descriptions-item label="结束日期">{{ project.endDate }}</el-descriptions-item>
            <el-descriptions-item label="描述" :span="2">{{ project.description }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>项目任务 ({{ tasks.length }})</span>
              <el-button type="primary" size="small" :icon="Plus" @click="openTaskDialog()">
                添加任务
              </el-button>
            </div>
          </template>
          <el-table :data="tasks" stripe>
            <el-table-column prop="title" label="任务名称" min-width="160" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="TASK_STATUS_MAP[row.status]?.type" size="small">
                  {{ TASK_STATUS_MAP[row.status]?.label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="priority" label="优先级" width="90">
              <template #default="{ row }">
                <el-tag :type="TASK_PRIORITY_MAP[row.priority]?.type" size="small">
                  {{ TASK_PRIORITY_MAP[row.priority]?.label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="dueDate" label="截止日期" width="120" />
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button type="primary" link @click="openTaskDialog(row)">编辑</el-button>
                <el-popconfirm title="确定删除？" @confirm="handleDeleteTask(row.id)">
                  <template #reference>
                    <el-button type="danger" link>删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never">
          <template #header>团队成员</template>
          <div v-for="member in projectMembers" :key="member.id" class="member-item">
            <el-avatar :size="36">{{ member.name.charAt(0) }}</el-avatar>
            <div>
              <div class="member-name">{{ member.name }}</div>
              <div class="member-role">{{ USER_ROLE_MAP[member.role] }}</div>
            </div>
          </div>
          <el-empty v-if="projectMembers.length === 0" description="暂无成员" />
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="taskDialogVisible" :title="editingTaskId ? '编辑任务' : '添加任务'" width="520px">
      <el-form ref="taskFormRef" :model="taskForm" :rules="taskRules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="taskForm.title" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="taskForm.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="taskForm.status" style="width: 100%">
            <el-option v-for="(item, key) in TASK_STATUS_MAP" :key="key" :label="item.label" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="taskForm.priority" style="width: 100%">
            <el-option v-for="(item, key) in TASK_PRIORITY_MAP" :key="key" :label="item.label" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="assigneeId">
          <el-select v-model="taskForm.assigneeId" clearable placeholder="选择负责人" style="width: 100%">
            <el-option v-for="m in projectMembers" :key="m.id" :label="m.name" :value="m.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期" prop="dueDate">
          <el-date-picker v-model="taskForm.dueDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="taskDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="taskSubmitting" @click="handleTaskSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { memberApi } from '@/api'
import { useProjectStore } from '@/stores/project'
import { useTaskStore } from '@/stores/task'
import {
  PROJECT_STATUS_MAP,
  TASK_PRIORITY_MAP,
  TASK_STATUS_MAP,
  USER_ROLE_MAP,
} from '@/constants'
import type { Project, Task, TaskPriority, TaskStatus, User } from '@/types'

const route = useRoute()
const projectStore = useProjectStore()
const taskStore = useTaskStore()

const loading = ref(false)
const project = ref<Project | null>(null)
const tasks = ref<Task[]>([])
const allMembers = ref<User[]>([])
const taskDialogVisible = ref(false)
const editingTaskId = ref<number | null>(null)
const taskSubmitting = ref(false)
const taskFormRef = ref<FormInstance>()

const taskForm = reactive({
  title: '',
  description: '',
  status: 'todo' as TaskStatus,
  priority: 'medium' as TaskPriority,
  assigneeId: undefined as number | undefined,
  dueDate: '',
})

const taskRules: FormRules = {
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
}

const projectMembers = computed(() =>
  allMembers.value.filter((m) => project.value?.memberIds.includes(m.id)),
)

const projectId = computed(() => Number(route.params.id))

async function loadData() {
  loading.value = true
  try {
    project.value = await projectStore.fetchProject(projectId.value)
    await taskStore.fetchTasks({ page: 1, pageSize: 100, projectId: projectId.value })
    tasks.value = taskStore.tasks
  } finally {
    loading.value = false
  }
}

function openTaskDialog(task?: Task) {
  editingTaskId.value = task?.id ?? null
  taskForm.title = task?.title ?? ''
  taskForm.description = task?.description ?? ''
  taskForm.status = task?.status ?? 'todo'
  taskForm.priority = task?.priority ?? 'medium'
  taskForm.assigneeId = task?.assigneeId
  taskForm.dueDate = task?.dueDate ?? ''
  taskDialogVisible.value = true
}

async function handleTaskSubmit() {
  const valid = await taskFormRef.value?.validate().catch(() => false)
  if (!valid) return

  taskSubmitting.value = true
  try {
    const payload = {
      projectId: projectId.value,
      title: taskForm.title,
      description: taskForm.description,
      status: taskForm.status,
      priority: taskForm.priority,
      assigneeId: taskForm.assigneeId,
      dueDate: taskForm.dueDate || undefined,
    }
    if (editingTaskId.value) {
      await taskStore.updateTask(editingTaskId.value, payload)
      ElMessage.success('更新成功')
    } else {
      await taskStore.createTask(payload)
      ElMessage.success('创建成功')
    }
    taskDialogVisible.value = false
    await taskStore.fetchTasks({ page: 1, pageSize: 100, projectId: projectId.value })
    tasks.value = taskStore.tasks
  } finally {
    taskSubmitting.value = false
  }
}

async function handleDeleteTask(id: number) {
  await taskStore.deleteTask(id)
  ElMessage.success('删除成功')
  tasks.value = tasks.value.filter((t) => t.id !== id)
}

onMounted(async () => {
  const res = await memberApi.getList()
  allMembers.value = res.data
  await loadData()
})
</script>

<style scoped>
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.member-item:last-child {
  border-bottom: none;
}

.member-name {
  font-size: 14px;
  color: #303133;
}

.member-role {
  font-size: 12px;
  color: #909399;
}
</style>
