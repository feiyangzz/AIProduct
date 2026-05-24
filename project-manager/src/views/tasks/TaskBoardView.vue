<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">任务看板</h2>
      <div class="header-actions">
        <el-select
          v-model="selectedProjectId"
          placeholder="筛选项目"
          clearable
          style="width: 200px"
          @change="loadTasks"
        >
          <el-option
            v-for="p in projectStore.projects"
            :key="p.id"
            :label="p.name"
            :value="p.id"
          />
        </el-select>
        <el-button type="primary" @click="openDialog()">
          <el-icon><Plus /></el-icon>
          新建任务
        </el-button>
      </div>
    </div>

    <div v-loading="taskStore.loading" class="kanban-board">
      <div
        v-for="status in TASK_STATUS_ORDER"
        :key="status"
        class="kanban-column"
      >
        <div class="column-header">
          <el-tag :type="TASK_STATUS_MAP[status].type" size="small">
            {{ TASK_STATUS_MAP[status].label }}
          </el-tag>
          <span class="column-count">{{ getTasksByStatus(status).length }}</span>
        </div>

        <div class="column-body">
          <div
            v-for="task in getTasksByStatus(status)"
            :key="task.id"
            class="task-card"
            @click="openDialog(task)"
          >
            <div class="task-title">{{ task.title }}</div>
            <div class="task-meta">
              <el-tag :type="TASK_PRIORITY_MAP[task.priority].type" size="small" effect="plain">
                {{ TASK_PRIORITY_MAP[task.priority].label }}
              </el-tag>
              <span class="task-project">{{ getProjectName(task.projectId) }}</span>
            </div>
            <div class="task-footer">
              <el-avatar v-if="task.assigneeId" :size="24" :src="getMemberAvatar(task.assigneeId)" />
              <span class="task-due">{{ task.dueDate }}</span>
              <el-button
                link
                type="danger"
                size="small"
                @click.stop="handleDelete(task.id)"
              >
                删除
              </el-button>
            </div>
          </div>
          <el-empty v-if="!getTasksByStatus(status).length" description="暂无任务" :image-size="60" />
        </div>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="editingId ? '编辑任务' : '新建任务'"
      width="520px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="任务标题" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="项目" prop="projectId">
          <el-select v-model="form.projectId" style="width: 100%">
            <el-option
              v-for="p in projectStore.projects"
              :key="p.id"
              :label="p.name"
              :value="p.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option
              v-for="(item, key) in TASK_STATUS_MAP"
              :key="key"
              :label="item.label"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="form.priority" style="width: 100%">
            <el-option
              v-for="(item, key) in TASK_PRIORITY_MAP"
              :key="key"
              :label="item.label"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="assigneeId">
          <el-select v-model="form.assigneeId" clearable style="width: 100%">
            <el-option v-for="m in members" :key="m.id" :label="m.name" :value="m.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期" prop="dueDate">
          <el-date-picker
            v-model="form.dueDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { useProjectStore } from '@/stores/project'
import { useTaskStore } from '@/stores/task'
import { teamApi } from '@/api'
import { TASK_PRIORITY_MAP, TASK_STATUS_MAP, TASK_STATUS_ORDER } from '@/constants'
import type { Task, TaskForm, TaskStatus, User } from '@/types'

const projectStore = useProjectStore()
const taskStore = useTaskStore()

const selectedProjectId = ref<number | undefined>()
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const members = ref<User[]>([])

const defaultForm = (): TaskForm => ({
  projectId: 1,
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assigneeId: null,
  dueDate: '',
})

const form = reactive(defaultForm())

const rules: FormRules = {
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
  projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  dueDate: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
}

function getTasksByStatus(status: TaskStatus) {
  return taskStore.tasks.filter((t) => t.status === status)
}

function getProjectName(projectId: number) {
  return projectStore.projects.find((p) => p.id === projectId)?.name ?? '-'
}

function getMemberAvatar(id: number) {
  return members.value.find((m) => m.id === id)?.avatar
}

function loadTasks() {
  taskStore.fetchTasks(selectedProjectId.value)
}

function openDialog(task?: Task) {
  Object.assign(form, defaultForm())
  editingId.value = task?.id ?? null
  if (task) {
    Object.assign(form, {
      projectId: task.projectId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId,
      dueDate: task.dueDate,
    })
  } else if (selectedProjectId.value) {
    form.projectId = selectedProjectId.value
  }
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    if (editingId.value) {
      await taskStore.updateTask(editingId.value, { ...form })
      ElMessage.success('任务已更新')
    } else {
      await taskStore.createTask({ ...form })
      ElMessage.success('任务已创建')
    }
    dialogVisible.value = false
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id: number) {
  await ElMessageBox.confirm('确定删除该任务？', '提示', { type: 'warning' })
  await taskStore.deleteTask(id)
  ElMessage.success('任务已删除')
}

onMounted(async () => {
  await Promise.all([
    projectStore.fetchProjects(),
    taskStore.fetchTasks(),
    teamApi.getMembers().then((res) => {
      if (res.code === 0) members.value = res.data
    }),
  ])
})
</script>

<style scoped>
.header-actions {
  display: flex;
  gap: 12px;
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  min-height: calc(100vh - 180px);
}

.kanban-column {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px;
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 4px;
}

.column-count {
  font-size: 13px;
  color: #909399;
}

.column-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 200px;
}

.task-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgb(0 0 0 / 6%);
  transition: box-shadow 0.2s;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.task-project {
  font-size: 12px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-due {
  flex: 1;
  font-size: 12px;
  color: #c0c4cc;
}

@media (max-width: 1200px) {
  .kanban-board {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
