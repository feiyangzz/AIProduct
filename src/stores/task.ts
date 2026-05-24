import { defineStore } from 'pinia'
import { ref } from 'vue'
import { taskApi } from '@/api'
import type { CreateTaskDto, PageParams, Task } from '@/types'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const total = ref(0)
  const loading = ref(false)

  async function fetchTasks(params: PageParams & { projectId?: number; status?: string }) {
    loading.value = true
    try {
      const res = await taskApi.getList(params)
      tasks.value = res.data.list
      total.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  async function createTask(data: CreateTaskDto) {
    const res = await taskApi.create(data)
    return res.data
  }

  async function updateTask(id: number, data: Partial<CreateTaskDto>) {
    const res = await taskApi.update(id, data)
    return res.data
  }

  async function deleteTask(id: number) {
    await taskApi.delete(id)
  }

  return { tasks, total, loading, fetchTasks, createTask, updateTask, deleteTask }
})
