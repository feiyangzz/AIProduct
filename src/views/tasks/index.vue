<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">任务管理</h2>
      <el-button type="primary" :icon="Plus" @click="openDialog()">新建任务</el-button>
    </div>

    <el-card shadow="never">
      <div class="filter-bar">
        <el-select v-model="filterProjectId" placeholder="全部项目" clearable style="width: 200px" @change="handleSearch">
          <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="全部状态" clearable style="width: 140px" @change="handleSearch">
          <el-option v-for="(item, key) in TASK_STATUS_MAP" :key="key" :label="item.label" :value="key" />
        </el-select>
        <el-input
          v-model="keyword"
          placeholder="搜索任务..."
          :prefix-icon="Search"
          clearable
          style="width: 220px"
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>

      <el-table v-loading="taskStore.loading" :data="taskStore.tasks" stripe>
        <el-table-column prop="title" label="任务名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="projectId" label="所属项目" width="160">
          <template #default="{ row }">
            {{ getProjectName(row.projectId) }}
          </template>
        </el-table-column>
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
        <el-table-column prop="assigneeId" label="负责人" width="100">
          <template #default="{ row }">
            {{ getMemberName(row.assigneeId) }}
          </template>
        </el-table-column>
        <el-table-column prop="dueDate" label="截止日期" width="120" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDialog(row)">编辑</el-button>
            <el-popconfirm title="确定删除？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="taskStore.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @change="fetchData"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑任务' : '新建任务'" width="520px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属项目" prop="projectId">
          <el-select v-model="form.projectId" placeholder="选择项目" style="width: 100%">
            <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option v-for="(item, key) in TASK_STATUS_MAP" :key="key" :label="item.label" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="form.priority" style="width: 100%">
            <el-option v-for="(item, key) in TASK_PRIORITY_MAP" :key="key" :label="item.label" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="assigneeId">
          <el-select v-model="form.assigneeId" clearable placeholder="选择负责人" style="width: 100%">
            <el-option v-for="m in members" :key="m.id" :label="m.name" :value="m.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期" prop="dueDate">
          <el-date-picker v-model="form.dueDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
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
import { Plus, Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { memberApi } from '@/api'
import { useProjectStore } from '@/stores/project'
import { useTaskStore } from '@/stores/task'
import { TASK_PRIORITY_MAP, TASK_STATUS_MAP } from '@/constants'
import type { Task, TaskPriority, TaskStatus, User } from '@/types'

const projectStore = useProjectStore()
const taskStore = useTaskStore()

const page = ref(1)
const pageSize = ref(10)
const keyword = ref('')
const filterProjectId = ref<number | undefined>()
const filterStatus = ref<string | undefined>()
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const projects = ref(projectStore.projects)
const members = ref<User[]>([])

const form = reactive({
  projectId: undefined as number | undefined,
  title: '',
  description: '',
  status: 'todo' as TaskStatus,
  priority: 'medium' as TaskPriority,
  assigneeId: undefined as number | undefined,
  dueDate: '',
})

const rules: FormRules = {
  projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
}

function getProjectName(id: number) {
  return projects.value.find((p) => p.id === id)?.name ?? '-'
}

function getMemberName(id?: number) {
  if (!id) return '-'
  return members.value.find((m) => m.id === id)?.name ?? '-'
}

function fetchData() {
  taskStore.fetchTasks({
    page: page.value,
    pageSize: pageSize.value,
    keyword: keyword.value,
    projectId: filterProjectId.value,
    status: filterStatus.value,
  })
}

function handleSearch() {
  page.value = 1
  fetchData()
}

function openDialog(task?: Task) {
  editingId.value = task?.id ?? null
  form.projectId = task?.projectId
  form.title = task?.title ?? ''
  form.description = task?.description ?? ''
  form.status = task?.status ?? 'todo'
  form.priority = task?.priority ?? 'medium'
  form.assigneeId = task?.assigneeId
  form.dueDate = task?.dueDate ?? ''
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const payload = {
      projectId: form.projectId!,
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      assigneeId: form.assigneeId,
      dueDate: form.dueDate || undefined,
    }
    if (editingId.value) {
      await taskStore.updateTask(editingId.value, payload)
      ElMessage.success('更新成功')
    } else {
      await taskStore.createTask(payload)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchData()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id: number) {
  await taskStore.deleteTask(id)
  ElMessage.success('删除成功')
  fetchData()
}

onMounted(async () => {
  await projectStore.fetchProjects({ page: 1, pageSize: 100 })
  projects.value = projectStore.projects
  const res = await memberApi.getList()
  members.value = res.data
  fetchData()
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
