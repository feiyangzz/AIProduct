import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project, ProjectForm } from '@/types'
import { projectApi } from '@/api'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)

  async function fetchProjects() {
    loading.value = true
    try {
      const res = await projectApi.getList()
      if (res.code === 0) projects.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function createProject(form: ProjectForm) {
    const res = await projectApi.create(form)
    if (res.code !== 0) throw new Error(res.message)
    projects.value.unshift(res.data)
    return res.data
  }

  async function updateProject(id: number, form: Partial<ProjectForm>) {
    const res = await projectApi.update(id, form)
    if (res.code !== 0) throw new Error(res.message)
    const index = projects.value.findIndex((p) => p.id === id)
    if (index !== -1) projects.value[index] = res.data
    return res.data
  }

  async function deleteProject(id: number) {
    const res = await projectApi.delete(id)
    if (res.code !== 0) throw new Error(res.message)
    projects.value = projects.value.filter((p) => p.id !== id)
  }

  return { projects, loading, fetchProjects, createProject, updateProject, deleteProject }
})
