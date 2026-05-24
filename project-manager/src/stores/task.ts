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
      tasks.value = await taskApi.getList(projectId)
    } finally {
      loading.value = false
    }
  }

  async function createTask(form: TaskForm) {
    const task = await taskApi.create(form)
    tasks.value.unshift(task)
    return task
  }

  async function updateTask(id: number, form: Partial<TaskForm>) {
    const task = await taskApi.update(id, form)
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index !== -1) tasks.value[index] = task
    return task
  }

  async function deleteTask(id: number) {
    await taskApi.delete(id)
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  return { tasks, loading, fetchTasks, createTask, updateTask, deleteTask }
})
