import { defineStore } from 'pinia'
import { ref } from 'vue'
import { projectApi } from '@/api'
import type { CreateProjectDto, PageParams, Project } from '@/types'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([])
  const total = ref(0)
  const loading = ref(false)
  const currentProject = ref<Project | null>(null)

  async function fetchProjects(params: PageParams) {
    loading.value = true
    try {
      const res = await projectApi.getList(params)
      projects.value = res.data.list
      total.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  async function fetchProject(id: number) {
    const res = await projectApi.getDetail(id)
    currentProject.value = res.data
    return res.data
  }

  async function createProject(data: CreateProjectDto) {
    const res = await projectApi.create(data)
    return res.data
  }

  async function updateProject(id: number, data: Partial<CreateProjectDto>) {
    const res = await projectApi.update(id, data)
    return res.data
  }

  async function deleteProject(id: number) {
    await projectApi.delete(id)
  }

  return {
    projects,
    total,
    loading,
    currentProject,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
  }
})
