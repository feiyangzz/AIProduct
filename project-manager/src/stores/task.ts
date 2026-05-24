import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Task, TaskForm } from '@/types'
import { taskApi } from '@/api'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)

  async function fetchTasks(projectId?: number) {
    loading.value = true
    try {
      const res = await taskApi.getList(projectId)
      if (res.code === 0) tasks.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function createTask(form: TaskForm) {
    const res = await taskApi.create(form)
    if (res.code !== 0) throw new Error(res.message)
    tasks.value.unshift(res.data)
    return res.data
  }

  async function updateTask(id: number, form: Partial<TaskForm>) {
    const res = await taskApi.update(id, form)
    if (res.code !== 0) throw new Error(res.message)
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index !== -1) tasks.value[index] = res.data
    return res.data
  }

  async function deleteTask(id: number) {
    const res = await taskApi.delete(id)
    if (res.code !== 0) throw new Error(res.message)
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  return { tasks, loading, fetchTasks, createTask, updateTask, deleteTask }
})
