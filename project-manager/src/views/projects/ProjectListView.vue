<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">项目管理</h2>
      <el-button type="primary" @click="openDialog()">
        <el-icon><Plus /></el-icon>
        新建项目
      </el-button>
    </div>

    <el-card shadow="never">
      <div class="toolbar">
        <el-input
          v-model="keyword"
          placeholder="搜索项目名称..."
          prefix-icon="Search"
          clearable
          style="width: 260px"
        />
        <el-select v-model="statusFilter" placeholder="状态筛选" clearable style="width: 140px">
          <el-option
            v-for="(item, key) in PROJECT_STATUS_MAP"
            :key="key"
            :label="item.label"
            :value="key"
          />
        </el-select>
      </div>

      <el-table v-loading="projectStore.loading" :data="filteredProjects" stripe>
        <el-table-column prop="name" label="项目名称" min-width="180">
          <template #default="{ row }">
            <span class="project-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
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
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="editingId ? '编辑项目' : '新建项目'"
      width="560px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="项目描述" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option
              v-for="(item, key) in PROJECT_STATUS_MAP"
              :key="key"
              :label="item.label"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="ownerId">
          <el-select v-model="form.ownerId" style="width: 100%">
            <el-option v-for="m in members" :key="m.id" :label="m.name" :value="m.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="成员" prop="memberIds">
          <el-select v-model="form.memberIds" multiple style="width: 100%">
            <el-option v-for="m in members" :key="m.id" :label="m.name" :value="m.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期" required>
          <el-col :span="11">
            <el-form-item prop="startDate">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="开始日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: center">-</el-col>
          <el-col :span="11">
            <el-form-item prop="endDate">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="结束日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
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
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { useProjectStore } from '@/stores/project'
import { teamApi } from '@/api'
import { PROJECT_STATUS_MAP } from '@/constants'
import type { Project, ProjectForm, ProjectStatus, User } from '@/types'

const projectStore = useProjectStore()

const keyword = ref('')
const statusFilter = ref<ProjectStatus | ''>('')
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const members = ref<User[]>([])

const defaultForm = (): ProjectForm => ({
  name: '',
  description: '',
  status: 'planning',
  ownerId: 1,
  memberIds: [],
  startDate: '',
  endDate: '',
})

const form = reactive(defaultForm())

const rules: FormRules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
}

const filteredProjects = computed(() => {
  return projectStore.projects.filter((p) => {
    const matchKeyword = !keyword.value || p.name.includes(keyword.value)
    const matchStatus = !statusFilter.value || p.status === statusFilter.value
    return matchKeyword && matchStatus
  })
})

function openDialog(project?: Project) {
  Object.assign(form, defaultForm())
  editingId.value = project?.id ?? null
  if (project) {
    Object.assign(form, {
      name: project.name,
      description: project.description,
      status: project.status,
      ownerId: project.ownerId,
      memberIds: [...project.memberIds],
      startDate: project.startDate,
      endDate: project.endDate,
    })
  }
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    if (editingId.value) {
      await projectStore.updateProject(editingId.value, { ...form })
      ElMessage.success('项目已更新')
    } else {
      await projectStore.createProject({ ...form })
      ElMessage.success('项目已创建')
    }
    dialogVisible.value = false
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id: number) {
  await ElMessageBox.confirm('删除后关联任务也将被移除，确定继续？', '警告', { type: 'warning' })
  await projectStore.deleteProject(id)
  ElMessage.success('项目已删除')
}

onMounted(async () => {
  await projectStore.fetchProjects()
  const res = await teamApi.getMembers()
  if (res.code === 0) members.value = res.data
})
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.project-name {
  font-weight: 500;
  color: #303133;
}
</style>
